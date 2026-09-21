import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { companyName, isoCode } = req.body || {};
  if (!companyName || !isoCode) {
    res.status(400).json({ error: "Missing companyName or isoCode in request" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(200).json({
      certificateText: "Certificate of compliance awarded for excellence in quality management systems.",
    });
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `Generate a professional text for an ISO certificate for "${companyName}" achieving "${isoCode}". Include a formal declaration, scope statement, and validity period. Format as plain text.`,
    });
    res.status(200).json({ certificateText: response.text });
  } catch (error) {
    console.error("Gemini certificate generation failed:", error);
    res.status(500).json({
      error: "Gemini certificate generation failed",
      certificateText: "Certificate of compliance awarded for excellence in quality management systems.",
    });
  }
}
