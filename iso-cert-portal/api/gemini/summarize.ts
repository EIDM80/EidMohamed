import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { standards, body } = req.body || {};
  if (!standards || !body) {
    res.status(400).json({ error: "Missing standards or body in request" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(200).json({
      summary: "API Key is not configured on the server. Please refer to standard manual requirements.",
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
      contents: `Provide a professional summary of the document requirements for obtaining ${standards.join(", ")} certification from the ${body} accreditation body. Keep it concise and formatted for a client dashboard.`,
    });
    res.status(200).json({ summary: response.text });
  } catch (error) {
    console.error("Gemini summarizing failed:", error);
    res.status(500).json({
      error: "Gemini summarizing failed",
      summary: "Unable to load AI summary. Please refer to standard manual requirements.",
    });
  }
}
