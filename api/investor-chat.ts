import type { VercelRequest, VercelResponse } from "@vercel/node";

const SYSTEM_PROMPT = `You are "Victor Chen", a ruthless but fair Silicon Valley seed investor.
You are evaluating a founder's startup pitch across 10 rounds.
You receive the current game state each round and respond IN CHARACTER  never break character.
You give SHORT, punchy responses (2–4 sentences max).
You reference the actual metrics (MRR, users, burn, product score).
You are skeptical but encouraging when metrics are good.
You are brutal and specific when metrics are bad.
You never give generic advice. Always react to the numbers.
When the founder chooses "Fundraise", you explicitly state your decision: INVEST or PASS, with a specific dollar amount if investing.
End every message with one sharp question the founder must think about.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ error: "Invalid request" });

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY not configured" });

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 250,
    }),
  });

  if (!response.ok) {
    const status = response.status === 429 ? 429 : 500;
    return res.status(status).json({ error: status === 429 ? "Rate limited. Try again shortly." : "AI error" });
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "...";
  return res.status(200).json({ content });
}
