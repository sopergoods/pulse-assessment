import type { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid body" }, { status: 400 });
  }

  const { messages } = (body ?? {}) as Record<string, unknown>;

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "invalid messages" }, { status: 400 });
  }

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: "You are a mysterious anonymous stranger on a world map app called Pulse. You are friendly, curious, and brief. Keep replies to 1-3 sentences. Never reveal you are an AI unless directly asked.",
    messages: messages as Anthropic.MessageParam[],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  return Response.json({ reply: text });
}