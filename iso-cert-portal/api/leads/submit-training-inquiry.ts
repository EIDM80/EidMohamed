import { Resend } from "resend";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { fullName, email, phone, company, standardCode, message } = req.body || {};
  if (!fullName || !email) {
    res.status(400).json({ error: "Name and email are required" });
    return;
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
    res.status(500).json({ error: "Could not save your request. Please try again." });
    return;
  }

  // The lead is already saved above, so a missing/failing email never loses
  // it — it's just not emailed yet, and stays visible in the admin panel.
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("RESEND_API_KEY is not set — lead saved but no email sent:", data?.id);
    res.status(200).json({ success: true });
    return;
  }

  try {
    const resend = new Resend(resendKey);
    const fromAddress = process.env.RESEND_FROM_EMAIL || "ISO Order Portal <noreply@gloria-c.com>";
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

  res.status(200).json({ success: true });
}
