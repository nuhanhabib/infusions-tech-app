import { NextResponse } from "next/server";
import { systemPrompt } from "@/lib/systemPrompt";
import { fallbackReply } from "@/lib/fallbackReply";

export const maxDuration = 30;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Keep only valid, recent messages and cap their size.
  const cleaned = (Array.isArray(body?.messages) ? body.messages : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  // The API needs the conversation to start with a user message.
  while (cleaned.length && cleaned[0].role !== "user") cleaned.shift();
  if (!cleaned.length || cleaned[cleaned.length - 1].role !== "user") {
    return NextResponse.json({ error: "No user message" }, { status: 400 });
  }

  const lastUserText = cleaned[cleaned.length - 1].content;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // No key configured: use the built-in rule-based replies.
  if (!apiKey) {
    return NextResponse.json({ reply: fallbackReply(lastUserText), mode: "fallback" });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: systemPrompt,
        messages: cleaned,
      }),
    });

    if (!res.ok) {
      console.error("Anthropic API error", res.status, await res.text());
      return NextResponse.json({ reply: fallbackReply(lastUserText), mode: "fallback" });
    }

    const data = await res.json();
    const reply = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({ reply: reply || fallbackReply(lastUserText), mode: "ai" });
  } catch (err) {
    console.error("Chat route failed", err);
    return NextResponse.json({ reply: fallbackReply(lastUserText), mode: "fallback" });
  }
}