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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata || {};
    const companyId = meta.companyId;
    const standardIds = (meta.standardIds || "").split(",").filter(Boolean);
    const standards = ISO_STANDARDS.filter((s) => standardIds.includes(s.id));

    if (companyId && standards.length > 0) {
      try {
        const { error } = await getSupabaseAdmin().from("iso_requests").insert({
          company_id: companyId,
          type: meta.type === "multi" ? "multi" : "single",
          accreditation_body: meta.accreditationBody,
          standards,
          amount: Number(meta.amount) || 0,
          currency: meta.currency || "usd",
          payment_status: "paid",
          stripe_session_id: session.id,
          status: RequestStatus.SUBMITTED,
        });
        if (error) {
          // Logged for manual follow-up; still ack the webhook so Stripe
          // doesn't retry indefinitely on a data-side problem.
          console.error("Failed to create request after payment:", error.message, meta);
        }
      } catch (err: any) {
        console.error("Supabase admin client unavailable:", err.message);
      }
    } else {
      console.error("Stripe webhook: missing companyId or unmatched standards in metadata", meta);
    }
  }

  res.status(200).json({ received: true });
}
