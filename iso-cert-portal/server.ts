import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
        model: 'gemini-3.5-flash',
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
        model: 'gemini-3.5-flash',
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
