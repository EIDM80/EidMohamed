import { Resend } from "resend";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin.js";

const slugifyForCode = (name: string): string =>
  name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 10) || "REF";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, phone } = req.body || {};
  if (!name || !email) {
    res.status(400).json({ error: "Name and email are required" });
    return;
  }

  const code = `${slugifyForCode(name)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const { error: dbError } = await getSupabaseAdmin()
    .from("referral_codes")
    .insert({ code, referrer_name: name, referrer_contact: [email, phone].filter(Boolean).join(" / ") });

  if (dbError) {
    console.error("Failed to create referral code:", dbError.message);
    res.status(500).json({ error: "Could not create your referral link. Please try again." });
    return;
  }

  const baseUrl = typeof req.headers?.origin === "string" ? req.headers.origin : process.env.PUBLIC_SITE_URL || "";
  const link = `${baseUrl}/?ref=${code}`;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const fromAddress = process.env.RESEND_FROM_EMAIL || "GAMC Website <noreply@gloria-c.com>";
      await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: "Your GAMC referral link is ready",
        text: `Hi ${name},\n\nThanks for joining the GAMC referral program! Share this link with clients — you'll earn AED 500 for every referred client who completes payment for an ISO certificate:\n\n${link}\n\nYour code: ${code}`,
      });
      await resend.emails.send({
        from: fromAddress,
        to: "iso@gloria-c.com",
        subject: `New referral partner: ${name}`,
        text: `${name} (${email}${phone ? `, ${phone}` : ""}) just joined the referral program.\nCode: ${code}\nLink: ${link}`,
      });
    } catch (err) {
      console.error("Referral confirmation email threw an error:", err);
    }
  } else {
    console.error("RESEND_API_KEY is not set — referral confirmation email not sent");
  }

  res.status(200).json({ code, link });
}
