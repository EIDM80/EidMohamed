import express from "express";
import path from "path";
import dotenv from "dotenv";
import Stripe from "stripe";
import { Resend } from "resend";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { getSupabaseAdmin } from "./lib/supabaseAdmin";
import { priceOrder, Currency, RenewalTerm } from "./lib/pricing";
import { ISO_STANDARDS } from "./constants";
import { RequestStatus } from "./types";

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

// Notifies the team by email whenever a client pays for a new certification
// order. Never throws — a missing/failing email must not block the order
// itself from being recorded.
async function sendOrderNotificationEmail(params: {
  companyId: string;
  standards: { code: string }[];
  accreditationBody: string;
  amount: number;
  currency: string;
  term: "1y" | "3y";
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("RESEND_API_KEY is not set — order notification email not sent");
    return;
  }
  try {
    const { data: company } = await getSupabaseAdmin()
      .from("companies")
      .select("name")
      .eq("id", params.companyId)
      .maybeSingle();

    const resend = new Resend(resendKey);
    const fromAddress = process.env.RESEND_FROM_EMAIL || "GAMC Website <noreply@gloria-c.com>";
    const standardCodes = params.standards.map((s) => s.code).join(", ");
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: "iso@gloria-c.com",
      subject: `New Order: ${standardCodes} — ${company?.name || "Unknown company"}`,
      text: [
        "A client just paid for a new ISO certification order:",
        "",
        `Company: ${company?.name || "Unknown"} (${params.companyId})`,
        `Standards: ${standardCodes}`,
        `Accreditation body: ${params.accreditationBody}`,
        `Amount: ${params.amount} ${params.currency.toUpperCase()}`,
        `Term: ${params.term === "3y" ? "3 years" : "1 year"}`,
      ].join("\n"),
    });
    if (error) console.error("Resend failed to send order notification email:", error);
  } catch (err) {
    console.error("Order notification email threw an error:", err);
  }
}

// Node doesn't read .env files on its own; layer .env then .env.local
// (matching Vite's own precedence) so GEMINI_API_KEY reaches process.env
// whether it was set here or by the hosting platform's real env vars.
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

// Secure API Key Retrieval
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Registered before express.json() below: Stripe's signature check needs
  // the exact raw request bytes, not the parsed-and-reserialized JSON.
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripe || !webhookSecret) {
      return res.status(500).send("Stripe is not configured on the server.");
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"] as string, webhookSecret);
    } catch (err: any) {
      console.error("Stripe webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const meta = session.metadata || {};
          const companyId = meta.companyId;
          const standardIds = (meta.standardIds || "").split(",").filter(Boolean);
          const standards = ISO_STANDARDS.filter((s) => standardIds.includes(s.id));
          const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

          if (!companyId || standards.length === 0 || !subscriptionId) {
            console.error("Stripe webhook: missing companyId, standards, or subscription on session", meta);
            break;
          }

          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
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
            next_renewal_at: new Date(getPeriodEnd(subscription) * 1000).toISOString(),
            referral_code: meta.referralCode || null,
            status: RequestStatus.SUBMITTED,
          });
          if (error) {
            console.error("Failed to create request after payment:", error.message, meta);
          } else {
            await sendOrderNotificationEmail({
              companyId,
              standards,
              accreditationBody: meta.accreditationBody,
              amount: Number(meta.amount) || 0,
              currency: meta.currency || "usd",
              term: meta.term === "3y" ? "3y" : "1y",
            });
          }
          break;
        }
        case "invoice.paid": {
          const invoice = event.data.object as Stripe.Invoice;
          const subscriptionId = getInvoiceSubscriptionId(invoice);
          if (!subscriptionId) break;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const { error } = await getSupabaseAdmin()
            .from("iso_requests")
            .update({
              subscription_status: mapSubscriptionStatus(subscription.status),
              next_renewal_at: new Date(getPeriodEnd(subscription) * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscriptionId);
          if (error) console.error("Failed to update request after renewal payment:", error.message, subscriptionId);
          break;
        }
        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          const subscriptionId = getInvoiceSubscriptionId(invoice);
          if (!subscriptionId) break;
          const { error } = await getSupabaseAdmin()
            .from("iso_requests")
            .update({ subscription_status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subscriptionId);
          if (error) console.error("Failed to mark subscription past_due:", error.message, subscriptionId);
          break;
        }
        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          const { error } = await getSupabaseAdmin()
            .from("iso_requests")
            .update({
              subscription_status: mapSubscriptionStatus(subscription.status),
              next_renewal_at: new Date(getPeriodEnd(subscription) * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);
          if (error) console.error("Failed to sync subscription status:", error.message, subscription.id);
          break;
        }
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const { error } = await getSupabaseAdmin()
            .from("iso_requests")
            .update({ subscription_status: "canceled", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subscription.id);
          if (error) console.error("Failed to mark subscription canceled:", error.message, subscription.id);
          break;
        }
        default:
          break;
      }
    } catch (err: any) {
      console.error(`Stripe webhook handler failed for ${event.type}:`, err.message);
    }

    res.status(200).json({ received: true });
  });

  app.use(express.json());

  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    if (!stripeSecretKey) {
      return res.status(500).json({ error: "Payments are not configured on the server yet." });
    }

    const { companyId, type, accreditationBody, standardIds, currency, term, email, referralCode, origin } = req.body || {};
    if (!companyId || !type || !accreditationBody || !Array.isArray(standardIds) || standardIds.length === 0) {
      return res.status(400).json({ error: "Missing required order details" });
    }

    const selectedStandards = ISO_STANDARDS.filter((s) => standardIds.includes(s.id));
    if (selectedStandards.length === 0) {
      return res.status(400).json({ error: "No matching ISO standards found" });
    }

    const safeCurrency: Currency = currency === "aed" ? "aed" : "usd";
    const safeTerm: RenewalTerm = term === "3y" ? "3y" : "1y";
    const pricing = priceOrder(selectedStandards, type === "multi" ? "multi" : "single", safeCurrency, safeTerm);
    const baseUrl = typeof origin === "string" && origin.startsWith("http") ? origin : "";
    const metadata: Record<string, string> = {
      companyId,
      type: type === "multi" ? "multi" : "single",
      accreditationBody,
      standardIds: standardIds.join(","),
      currency: safeCurrency,
      term: safeTerm,
      amount: String(pricing.totalUsd),
    };
    if (typeof referralCode === "string" && referralCode.trim()) {
      metadata.referralCode = referralCode.trim();
    }

    try {
      const session = await stripe!.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: typeof email === "string" && email ? email : undefined,
        line_items: [
          {
            price_data: {
              currency: safeCurrency,
              unit_amount: pricing.totalInSmallestUnit,
              recurring: { interval: "year", interval_count: pricing.intervalCount },
              product_data: {
                name: `ISO Certification — ${selectedStandards.map((s) => s.code).join(", ")}`,
                description: `Accreditation body: ${accreditationBody} · Renews every ${pricing.intervalCount} year(s)`,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/?payment=cancelled`,
        metadata,
        subscription_data: { metadata },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe checkout session creation failed:", error);
      res.status(500).json({ error: "Could not start checkout session" });
    }
  });

  app.post("/api/leads/submit-training-inquiry", async (req, res) => {
    const { fullName, email, phone, company, standardCode, message } = req.body || {};
    if (!fullName || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const { data, error: dbError } = await getSupabaseAdmin()
      .from("training_leads")
      .insert({
        full_name: fullName,
        email,
        phone: phone || null,
        company: company || null,
        standard_code: standardCode || null,
        message: message || null,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Failed to save training lead:", dbError.message);
      return res.status(500).json({ error: "Could not save your request. Please try again." });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error("RESEND_API_KEY is not set — lead saved but no email sent:", data?.id);
      return res.json({ success: true });
    }

    try {
      const resend = new Resend(resendKey);
      const fromAddress = process.env.RESEND_FROM_EMAIL || "GAMC Website <noreply@gloria-c.com>";
      const { error: emailError } = await resend.emails.send({
        from: fromAddress,
        to: "iso@gloria-c.com",
        replyTo: email,
        subject: `New Lead: Training inquiry — ${standardCode || "General"}`,
        text: [
          "New training course lead from the website:",
          "",
          `Name: ${fullName}`,
          `Email: ${email}`,
          `Phone: ${phone || "-"}`,
          `Company: ${company || "-"}`,
          `Standard: ${standardCode || "-"}`,
          `Message: ${message || "-"}`,
        ].join("\n"),
      });
      if (emailError) {
        console.error("Resend failed to send lead email:", emailError, data?.id);
      } else if (data?.id) {
        await getSupabaseAdmin().from("training_leads").update({ email_sent: true }).eq("id", data.id);
      }
    } catch (err) {
      console.error("Resend email send threw an error:", err, data?.id);
    }

    res.json({ success: true });
  });

  // API Routes
  app.post("/api/gemini/summarize", async (req, res) => {
    try {
      const { standards, body } = req.body;
      if (!standards || !body) {
        return res.status(400).json({ error: "Missing standards or body in request" });
      }

      if (!ai) {
        return res.json({ 
          summary: "API Key is not configured on the server. Please refer to standard manual requirements." 
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: `Provide a professional summary of the document requirements for obtaining ${standards.join(', ')} certification from the ${body} accreditation body. Keep it concise and formatted for a client dashboard.`,
      });

      res.json({ summary: response.text });
    } catch (error) {
      console.error("Gemini summarizing failed:", error);
      res.status(500).json({ 
        error: "Gemini summarizing failed", 
        summary: "Unable to load AI summary. Please refer to standard manual requirements." 
      });
    }
  });

  app.post("/api/gemini/generate-certificate", async (req, res) => {
    try {
      const { companyName, isoCode } = req.body;
      if (!companyName || !isoCode) {
        return res.status(400).json({ error: "Missing companyName or isoCode in request" });
      }

      if (!ai) {
        return res.json({ 
          certificateText: "Certificate of compliance awarded for excellence in quality management systems." 
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: `Generate a professional text for an ISO certificate for "${companyName}" achieving "${isoCode}". Include a formal declaration, scope statement, and validity period. Format as plain text.`,
      });

      res.json({ certificateText: response.text });
    } catch (error) {
      console.error("Gemini certificate generation failed:", error);
      res.status(500).json({ 
        error: "Gemini certificate generation failed",
        certificateText: "Certificate of compliance awarded for excellence in quality management systems." 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
