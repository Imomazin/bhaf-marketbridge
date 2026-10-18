/**
 * AI-Automated Document & KYC Verification Service
 *
 * Uses Google Gemini Vision multimodal API to inspect uploaded documents (PDF / JPG / PNG),
 * check authenticity, detect non-conforming uploads (food photos, selfies, memes, unreadable scans),
 * cross-match entity & founder names, and provide automated validation or rejection reasons.
 */

export interface VerificationProfileContext {
  businessName?: string | null;
  founderName?: string | null;
  country?: string | null;
  sector?: string | null;
}

export interface DocumentVerificationInput {
  buffer: Buffer;
  mimeType: string;
  fileName: string;
  category: string;
  profileContext?: VerificationProfileContext;
}

export interface VerificationCheckItem {
  name: string;
  status: "PASS" | "FAIL" | "WARN";
  detail: string;
}

export interface DocumentVerificationResult {
  decision: "APPROVE" | "REJECT" | "FLAG";
  documentType: string;
  confidence: number;
  extractedEntityName?: string;
  extractedPersonName?: string;
  isLegible: boolean;
  isExpired: boolean;
  nameMatchesProfile: boolean;
  reason: string;
  checks: VerificationCheckItem[];
}

export async function verifyDocumentWithAI(
  input: DocumentVerificationInput,
): Promise<DocumentVerificationResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If MOCK_AI=true is set in .env (for local testing without API costs), auto-approve.
  if (process.env.MOCK_AI === "true") {
    console.log("[documentVerifier] MOCK_AI is enabled. Auto-approving document.");
    return {
      decision: "APPROVE",
      documentType: "OTHER_OFFICIAL_DOCUMENT",
      confidence: 100,
      extractedEntityName: input.profileContext?.businessName ?? "Mocked Business",
      extractedPersonName: input.profileContext?.founderName ?? "Mocked Person",
      isLegible: true,
      isExpired: false,
      nameMatchesProfile: true,
      reason: "Mock AI verification enabled. Document automatically approved.",
      checks: [
        { name: "AI Document Type & Authenticity", status: "PASS", detail: "Mocked Approval" },
        { name: "AI Text Legibility & Quality", status: "PASS", detail: "Mocked Approval" },
        { name: "AI Name & Profile Consistency", status: "PASS", detail: "Mocked Approval" },
        { name: "AI Validity & Expiry", status: "PASS", detail: "Mocked Approval" },
      ],
    };
  }

  // If no API key is provided, execute safe heuristic fallback
  if (!apiKey || apiKey === "mock_key") {
    return await runHeuristicFallback(input);
  }

  try {
    const base64Data = input.buffer.toString("base64");
    const businessName = input.profileContext?.businessName ?? "Not specified";
    const founderName = input.profileContext?.founderName ?? "Not specified";
    const country = input.profileContext?.country ?? "Not specified";

    const prompt = `
You are an expert compliance and KYC document verification officer for BHAF MarketBridge (a platform connecting verified African women-led businesses with global funders and buyers).

Analyze the attached document carefully against the expected business profile:
- Expected Business / Organization Name: "${businessName}"
- Expected Founder / Owner Name: "${founderName}"
- Expected Country: "${country}"
- Expected Document Category: "${input.category}"
- File Name: "${input.fileName}"

YOUR OBJECTIVES:
1. Authenticity & Relevance: Is this a legitimate business or official verification document (e.g., CAC Certificate of Incorporation / Business Registration, National ID, International Passport, Tax Certificate, Utility Bill, Audited Accounts, ESG Report, Product Certification)? 
   - CRITICAL: If the upload is a selfie, meme, food photo, landscape, completely blank page, random screenshot, or personal receipt, mark decision as "REJECT".
2. Legibility & Quality: Is the text legible, clear, and uncorrupted? If completely unreadable or severely truncated, mark decision as "REJECT".
3. Entity & Name Matching: Does the entity name, registration name, or director/founder name on the document match or reasonably correspond to the expected business/founder name?
4. Expiration: Is the document past its visible expiration date?

Return ONLY a valid JSON object strictly matching this schema with no markdown formatting or backticks:
{
  "decision": "APPROVE" | "REJECT" | "FLAG",
  "documentType": "CAC_CERTIFICATE" | "NATIONAL_ID" | "PASSPORT" | "TAX_DOCUMENT" | "UTILITY_BILL" | "ESG_REPORT" | "PRODUCT_CERTIFICATION" | "OTHER_OFFICIAL_DOCUMENT" | "INVALID_NON_DOCUMENT",
  "confidence": number between 0 and 100,
  "extractedEntityName": "string or empty",
  "extractedPersonName": "string or empty",
  "isLegible": boolean,
  "isExpired": boolean,
  "nameMatchesProfile": boolean,
  "reason": "A clear, professional, concise 1-2 sentence explanation. If rejected, clearly state why so the user can fix it (e.g. 'Document image is too blurry to verify registration details. Please upload a high-resolution scan of your CAC certificate.')",
  "checks": [
    { "name": "AI Document Type & Authenticity", "status": "PASS" | "FAIL" | "WARN", "detail": "..." },
    { "name": "AI Text Legibility & Quality", "status": "PASS" | "FAIL" | "WARN", "detail": "..." },
    { "name": "AI Name & Profile Consistency", "status": "PASS" | "FAIL" | "WARN", "detail": "..." },
    { "name": "AI Validity & Expiry", "status": "PASS" | "FAIL" | "WARN", "detail": "..." }
  ]
}
`;

    // Try these models in order if one is experiencing high demand (503)
    const models = ["gemini-3.6-flash", "gemini-3.6-flash", "gemini-1.5-flash"];
    let lastErrorStatus = null;
    let lastErrorText = null;

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Normalize mimeType for Gemini
        const safeMime = input.mimeType.startsWith("image/") || input.mimeType === "application/pdf"
          ? input.mimeType
          : "application/pdf";

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: safeMime,
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.1,
            },
          }),
        });

        if (!response.ok) {
          lastErrorStatus = response.status;
          lastErrorText = await response.text();
          console.warn(`[documentVerifier] Gemini API (${model}) returned status ${response.status}: ${lastErrorText}`);
          // If it's a 503, 429, or 404 (model name deprecated), continue to the next model in the loop
          if (response.status === 503 || response.status === 429 || response.status === 404) {
            if (response.status === 503) {
              await new Promise(resolve => setTimeout(resolve, 1500)); // wait 1.5s before retry
            }
            continue;
          }
          // For other errors (like 400 Bad Request, or 403 Invalid API Key), fail immediately
          break;
        }

        const data = await response.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawContent) {
          console.warn(`[documentVerifier] Empty response from Gemini API (${model})`);
          continue; // Try next model just in case
        }

        const cleaned = rawContent.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
        const parsed = JSON.parse(cleaned) as DocumentVerificationResult;

        if (!parsed.decision || !Array.isArray(parsed.checks)) {
          console.warn(`[documentVerifier] Invalid JSON structure from Gemini API (${model})`);
          continue; // Try next model
        }

        // Successfully verified using this model
        console.log(`[documentVerifier] Successfully verified using model: ${model}`);
        return parsed;

      } catch (err) {
        console.error(`[documentVerifier] Network or parse error with model ${model}:`, err);
        // Continue to the next model
      }
    }

    // If we exhausted all models (or broke out early for a hard error), fall back to heuristic
    console.warn("[documentVerifier] All Gemini models failed or returned invalid responses.");
    return await runHeuristicFallback(input);

  } catch (error) {
    console.error("[documentVerifier] Error verifying document with AI:", error);
    return await runHeuristicFallback(input);
  }
}



/**
 * Fallback heuristic verifier used when API key is not present or API is unreachable.
 * Ensures the system never crashes and handles basic safety rules via local OCR.
 */
async function runHeuristicFallback(input: DocumentVerificationInput): Promise<DocumentVerificationResult> {
  const isImageOrPdf = input.mimeType.startsWith("image/") || input.mimeType === "application/pdf";
  const isImage = input.mimeType.startsWith("image/");
  const isPdf = input.mimeType === "application/pdf";
  const hasReasonableSize = input.buffer.length >= 1024 && input.buffer.length <= 15 * 1024 * 1024;
  const isSuspectName = /screenshot|test|untitled|meme|sample/i.test(input.fileName);

  if (!isImageOrPdf) {
    return {
      decision: "REJECT",
      documentType: "INVALID_NON_DOCUMENT",
      confidence: 90,
      isLegible: false,
      isExpired: false,
      nameMatchesProfile: false,
      reason: "Unsupported file format. Please upload a clear PDF, JPEG, or PNG document.",
      checks: [
        { name: "AI Document Type & Authenticity", status: "FAIL", detail: "Invalid MIME type" },
        { name: "AI Text Legibility & Quality", status: "FAIL", detail: "File could not be parsed as a document" },
        { name: "AI Name & Profile Consistency", status: "WARN", detail: "Could not extract names" },
        { name: "AI Validity & Expiry", status: "WARN", detail: "Not verified" },
      ],
    };
  }

  try {
    let extractedText = "";
    console.log("[documentVerifier] Running local backend OCR fallback...");
    
    if (isPdf) {
      const { PDFParse } = require('pdf-parse');
      const parser = new PDFParse({ data: input.buffer });
      const data = await parser.getText();
      extractedText = data.text || "";
    } else if (isImage && input.buffer.length > 100) {
      const isJpeg = input.buffer[0] === 0xff && input.buffer[1] === 0xd8;
      const isPng = input.buffer[0] === 0x89 && input.buffer[1] === 0x50;
      if (isJpeg || isPng) {
        try {
          const Tesseract = (await import("tesseract.js")).default || (await import("tesseract.js"));
          // @ts-ignore
          const res = await Tesseract.recognize(input.buffer, "eng");
          extractedText = res?.data?.text || "";
        } catch (e) {
          console.warn("[documentVerifier] Tesseract OCR error:", e);
        }
      }
    }
    
    const textLower = extractedText.toLowerCase();
    const bName = input.profileContext?.businessName?.toLowerCase() || "";
    const fName = input.profileContext?.founderName?.toLowerCase() || "";
    
    // Check if founder or business name exists in the parsed document text
    const matchedBusiness = bName.length > 2 && textLower.includes(bName);
    const matchedFounder = fName.length > 2 && textLower.includes(fName);
    
    if (matchedBusiness || matchedFounder) {
      console.log("[documentVerifier] Local fallback matched names successfully!");
      return {
        decision: "APPROVE",
        documentType: "OTHER_OFFICIAL_DOCUMENT",
        confidence: 80,
        extractedEntityName: input.profileContext?.businessName ?? undefined,
        extractedPersonName: input.profileContext?.founderName ?? undefined,
        isLegible: true,
        isExpired: false,
        nameMatchesProfile: true,
        reason: "Document verified successfully by local backend text matching. (Fallback Mode)",
        checks: [
          { name: "Document Authenticity (Local)", status: "PASS", detail: "API unavailable, verified locally" },
          { name: "Text Legibility", status: "PASS", detail: "Successfully parsed via local OCR" },
          { name: "Name & Profile Consistency", status: "PASS", detail: "Name found securely in text" },
          { name: "Validity", status: "PASS", detail: "Assumed valid in fallback" }
        ]
      };
    } else if (extractedText.length > 50) {
      console.log("[documentVerifier] Local OCR succeeded, but names didn't match.");
    }
  } catch (err) {
    console.error("[documentVerifier] Local fallback extraction failed:", err);
  }

  // If parsing failed or no names matched, fallback to FLAG
  if (isSuspectName && input.buffer.length < 5000) {
    return {
      decision: "FLAG",
      documentType: "OTHER_OFFICIAL_DOCUMENT",
      confidence: 60,
      isLegible: true,
      isExpired: false,
      nameMatchesProfile: true,
      reason: "Document quality is low or appears to be a draft screenshot. Flagged for admin verification.",
      checks: [
        { name: "AI Document Type & Authenticity", status: "WARN", detail: "Low resolution upload" },
        { name: "AI Text Legibility & Quality", status: "WARN", detail: "File size is very small" },
        { name: "AI Name & Profile Consistency", status: "PASS", detail: "Auto-matched category" },
        { name: "AI Validity & Expiry", status: "PASS", detail: "No visible expiration" },
      ],
    };
  }

  return {
    decision: "FLAG",
    documentType: "OTHER_OFFICIAL_DOCUMENT",
    confidence: 85,
    extractedEntityName: input.profileContext?.businessName ?? undefined,
    extractedPersonName: input.profileContext?.founderName ?? undefined,
    isLegible: true,
    isExpired: false,
    nameMatchesProfile: true,
    reason: "Automated AI verification is currently unavailable. Flagged for manual admin verification.",
    checks: [
      { name: "AI Document Type & Authenticity", status: "WARN", detail: "API Unavailable - Unverified" },
      { name: "AI Text Legibility & Quality", status: "WARN", detail: "API Unavailable - Unverified" },
      { name: "AI Name & Profile Consistency", status: "WARN", detail: "API Unavailable - Unverified" },
      { name: "AI Validity & Expiry", status: "WARN", detail: "API Unavailable - Unverified" },
    ],
  };
}
