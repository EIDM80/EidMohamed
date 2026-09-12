export const summarizeRequirements = async (standards: string[], body: string): Promise<string> => {
  try {
    const response = await fetch("/api/gemini/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ standards, body }),
    });
    
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    
    const data = await response.json();
    return data.summary || "Unable to load AI summary. Please refer to standard manual requirements.";
  } catch (error) {
    console.error("summarizeRequirements client fetch failed:", error);
    return "Unable to load AI summary. Please refer to standard manual requirements.";
  }
};

export const generateMockCertificateContent = async (companyName: string, isoCode: string): Promise<string> => {
  try {
    const response = await fetch("/api/gemini/generate-certificate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ companyName, isoCode }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return data.certificateText || "Certificate of compliance awarded for excellence in quality management systems.";
  } catch (error) {
    console.error("generateMockCertificateContent client fetch failed:", error);
    return "Certificate of compliance awarded for excellence in quality management systems.";
  }
};
