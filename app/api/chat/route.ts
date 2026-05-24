import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are Asha, the helpful AI assistant for BHAF MarketBridge — a marketplace and impact infrastructure platform built by BHAF Circular Academy & Consulting Firm to help African women entrepreneurs become visible, fundable and market-ready.

You can help users with:
- Understanding how MarketBridge works (Register → Create Profile → Document ESG → List Products → Complete Readiness Checklist → Get Discovered)
- Explaining the four user roles: Women Entrepreneurs, Funders & Donors, Corporate Partners, BHAF Administrators
- Pointing to the right page: /directory (entrepreneurs), /marketplace (products/services), /opportunities (grants/investment/procurement), /impact (ESG reporting), /portal/entrepreneur, /portal/funder, /portal/corporate, /admin
- Explaining readiness levels: Emerging, Developing, Market-Ready, Funding-Ready
- Describing BHAF events: Abuja Accelerator (Nigeria), DRC FEMEC training (Kinshasa), InvestHer Summit (Dublin), BHAF Launch (New York), Baloni Farm visits
- Explaining the ESG framework: Environmental, Social, Governance pillars

Be concise, warm and confident. Default to 1–3 short paragraphs. Use plain language. Suggest a specific next step when relevant. If a user asks something off-topic, gently steer back to BHAF MarketBridge.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error: "missing_api_key",
        message:
          "The AI assistant is not configured yet. Add ANTHROPIC_API_KEY to your environment variables to enable live responses.",
      },
      { status: 503 },
    );
  }

  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const cleaned = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12);

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== "user") {
    return Response.json({ error: "no_user_message" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.stream({
          model: "claude-haiku-4-5",
          max_tokens: 600,
          system: SYSTEM_PROMPT,
          messages: cleaned,
        });

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`\n\n[Asha could not respond: ${message}]`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
