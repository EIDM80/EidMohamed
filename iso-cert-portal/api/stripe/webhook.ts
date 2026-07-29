import Stripe from "stripe";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
import { RequestStatus } from "../../types";
import { ISO_STANDARDS } from "../../constants";

// Stripe signature verification needs the exact raw request bytes, so the
// platform's automatic JSON body parsing must be turned off for this route.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Maps Stripe's richer subscription.status set onto our simpler stored enum.
const mapSubscriptionStatus = (stripeStatus: Stripe.Subscription.Status): "active" | "past_due" | "canceled" | "unpaid" => {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    default:
      return "unpaid";
  }
};

// As of this Stripe API version, billing periods live per subscription item
// (flexible billing periods) rather than on the subscription itself — our
// subscriptions only ever have one item (the certification price).
const getPeriodEnd = (subscription: Stripe.Subscription): number =>
  subscription.items.data[0]?.current_period_end ?? Math.floor(Date.now() / 1000);

// Likewise, an Invoice's subscription reference moved under parent.subscription_details.
const getInvoiceSubscriptionId = (invoice: Stripe.Invoice): string | undefined => {
  const sub = invoice.parent?.subscription_details?.subscription;
  return typeof sub === "string" ? sub : sub?.id;
};

async function handleCheckoutCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  const meta = session.metadata || {};
  const companyId = meta.companyId;
  const standardIds = (meta.standardIds || "").split(",").filter(Boolean);
  const standards = ISO_STANDARDS.filter((s) => standardIds.includes(s.id));
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

  if (!companyId || standards.length === 0 || !subscriptionId) {
    console.error("Stripe webhook: missing companyId, standards, or subscription on session", meta);
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const nextRenewalAt = new Date(getPeriodEnd(subscription) * 1000).toISOString();

  const { error } = await getSupabaseAdmin().from("iso_requests").insert({
    company_id: companyId,
    type: meta.type === "multi" ? "multi" : "single",
    accreditation_body: meta.accreditationBody,
    standards,
    amount: Number(meta.amount) || 0,
    currency: meta.currency || "usd",
    payment_status: "paid",
    stripe_session_id: session.id,
    stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id,
    stripe_subscription_id: subscriptionId,
    renewal_term: meta.term === "3y" ? "3y" : "1y",
    subscription_status: mapSubscriptionStatus(subscription.status),
    next_renewal_at: nextRenewalAt,
    status: RequestStatus.SUBMITTED,
  });
  if (error) {
    console.error("Failed to create request after payment:", error.message, meta);
  }
}

// Renewal payments (billing_reason: 'subscription_cycle') land here — the
// very first payment is already handled by checkout.session.completed.
async function handleInvoicePaid(stripe: Stripe, invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const nextRenewalAt = new Date(getPeriodEnd(subscription) * 1000).toISOString();

  const { error } = await getSupabaseAdmin()
    .from("iso_requests")
    .update({
      subscription_status: mapSubscriptionStatus(subscription.status),
      next_renewal_at: nextRenewalAt,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);
  if (error) {
    console.error("Failed to update request after renewal payment:", error.message, subscriptionId);
  }
}

async function handleSubscriptionStatusChange(subscription: Stripe.Subscription) {
  const { error } = await getSupabaseAdmin()
    .from("iso_requests")
    .update({
      subscription_status: mapSubscriptionStatus(subscription.status),
      next_renewal_at: new Date(getPeriodEnd(subscription) * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);
  if (error) {
    console.error("Failed to sync subscription status:", error.message, subscription.id);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { error } = await getSupabaseAdmin()
    .from("iso_requests")
    .update({ subscription_status: "canceled", updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", subscription.id);
  if (error) {
    console.error("Failed to mark subscription canceled:", error.message, subscription.id);
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    res.status(500).send("Stripe is not configured on the server.");
    return;
  }

  const stripe = new Stripe(secretKey);
  const buf = await buffer(req);
  const signature = req.headers["stripe-signature"];

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(stripe, event.data.object as Stripe.Checkout.Session);
        break;
      case "invoice.paid":
        await handleInvoicePaid(stripe, event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = getInvoiceSubscriptionId(invoice);
        if (subscriptionId) {
          const { error } = await getSupabaseAdmin()
            .from("iso_requests")
            .update({ subscription_status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subscriptionId);
          if (error) console.error("Failed to mark subscription past_due:", error.message, subscriptionId);
        }
        break;
      }
      case "customer.subscription.updated":
        await handleSubscriptionStatusChange(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }
  } catch (err: any) {
    // Logged for manual follow-up; still ack the webhook so Stripe doesn't
    // retry indefinitely on a data-side problem (e.g. Supabase misconfigured).
    console.error(`Stripe webhook handler failed for ${event.type}:`, err.message);
  }

  res.status(200).json({ received: true });
}
