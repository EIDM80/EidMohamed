import { getSupabaseAdmin } from "../../lib/supabaseAdmin.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const certificateNumber = (req.body?.certificateNumber || "").trim();
  if (!certificateNumber) {
    res.status(400).json({ error: "Certificate number is required" });
    return;
  }

  // Only a request that has actually reached "Certified" is a real,
  // issued certificate — anything else (draft, in review, rejected) must
  // never be confirmable here, even though its ID technically exists.
  const { data, error } = await getSupabaseAdmin()
    .from("iso_requests")
    .select("accreditation_body, standards, created_at, subscription_status, companies(name)")
    .eq("id", certificateNumber)
    .eq("status", "Certified")
    .maybeSingle();

  if (error || !data) {
    res.json({ found: false });
    return;
  }

  const standards = (data.standards as { code: string }[]) || [];
  const issueDate = new Date(data.created_at as string);
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 3);
  const company = Array.isArray(data.companies) ? data.companies[0] : data.companies;

  res.json({
    found: true,
    company: (company as { name: string } | null)?.name || "",
    standard: standards.map((s) => s.code).join(", "),
    issued: issueDate.toISOString(),
    expires: expiryDate.toISOString(),
    body: data.accreditation_body,
    active: data.subscription_status === "active" || data.subscription_status === "past_due",
  });
}
