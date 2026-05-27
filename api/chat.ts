// Vercel edge serverless function — keeps DEEPSEEK_API_KEY server-side
export const config = { runtime: "edge" };

const SYSTEM_PROMPT = `You are Petal AI, a knowledgeable and empathetic women's health and cycle coach. You help users understand their menstrual cycle, hormonal health, fertility, pregnancy, nutrition, and overall wellbeing.

Guidelines:
- Keep responses concise (2–4 sentences) and warm
- Be evidence-based but easy to understand
- Use 1 relevant emoji per response
- Never diagnose or prescribe — always recommend consulting a healthcare provider for medical concerns
- You can reference cycle phases (Period, Follicular, Fertile window, Ovulation, Luteal) when relevant`;

export default async function handler(req: Request): Promise<Response> {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: { messages: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return json({ error: "messages array required" }, 400);
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return json({ error: "DEEPSEEK_API_KEY not configured" }, 500);
  }

  try {
    const upstream = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 350,
        temperature: 0.7,
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      console.error("DeepSeek error:", err);
      return json({ error: "Upstream API error" }, 502);
    }

    const data = (await upstream.json()) as {
      choices: { message: { content: string } }[];
    };
    const reply =
      data.choices?.[0]?.message?.content ?? "I'm not sure — could you rephrase your question? 🌸";

    return json({ reply }, 200);
  } catch (err) {
    console.error("chat handler error:", err);
    return json({ error: "Internal error" }, 500);
  }
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
