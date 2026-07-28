import Stripe from "stripe";
import { ISO_STANDARDS } from "../../constants";
import { priceOrder, Currency } from "../../lib/pricing";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    res.status(500).json({ error: "Payments are not configured on the server yet." });
    return;
  }

  const { companyId, type, accreditationBody, standardIds, currency, origin } = req.body || {};
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
  const pricing = priceOrder(selectedStandards, type === "multi" ? "multi" : "single", safeCurrency);

  const baseUrl =
    typeof origin === "string" && origin.startsWith("http") ? origin : process.env.PUBLIC_SITE_URL || "";

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: safeCurrency,
            unit_amount: pricing.totalInSmallestUnit,
            product_data: {
              name: `ISO Certification — ${selectedStandards.map((s) => s.code).join(", ")}`,
              description: `Accreditation body: ${accreditationBody}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?payment=cancelled`,
      metadata: {
        companyId,
        type: type === "multi" ? "multi" : "single",
        accreditationBody,
        standardIds: standardIds.join(","),
        currency: safeCurrency,
        amount: String(pricing.totalUsd),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);
    res.status(500).json({ error: "Could not start checkout session" });
  }
}
