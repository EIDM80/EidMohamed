import Stripe from "stripe";
import { ISO_STANDARDS } from "../../constants.js";
import { priceOrder, Currency, RenewalTerm } from "../../lib/pricing.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set in this environment");
    res.status(500).json({ error: "Payments are not configured on the server yet." });
    return;
  }

  const { companyId, type, accreditationBody, standardIds, currency, term, email, referralCode, origin } = req.body || {};
  if (!companyId || !type || !accreditationBody || !Array.isArray(standardIds) || standardIds.length === 0) {
    res.status(400).json({ error: "Missing required order details" });
    return;
  }

  const selectedStandards = ISO_STANDARDS.filter((s) => standardIds.includes(s.id));
  if (selectedStandards.length === 0) {
    res.status(400).json({ error: "No matching ISO standards found" });
    return;
  }

  const safeCurrency: Currency = currency === "aed" ? "aed" : "usd";
  const safeTerm: RenewalTerm = term === "3y" ? "3y" : "1y";
  const pricing = priceOrder(selectedStandards, type === "multi" ? "multi" : "single", safeCurrency, safeTerm);

  const baseUrl =
    typeof origin === "string" && origin.startsWith("http") ? origin : process.env.PUBLIC_SITE_URL || "";

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
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
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
      // Metadata on the session covers the initial checkout.session.completed
      // event; subscription_data.metadata copies it onto the Subscription
      // object itself, which is what later invoice/subscription events carry.
      subscription_data: { metadata },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);
    res.status(500).json({ error: "Could not start checkout session" });
  }
}
