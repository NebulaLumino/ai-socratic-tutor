import { NextRequest, NextResponse } from 'next/server';

function getClient() {
  const { default: OpenAI } = require('openai');
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { topic, question } = await req.json();
    const client = getClient();
    const userMsg = question?.trim()
      ? `A student asks about "${topic}" with this specific question: "${question}". Guide them using the Socratic method. Respond with thoughtful guiding questions and hints rather than direct answers. Start with a relevant question to help them think through the concept.`
      : `Act as an expert Socratic tutor for the topic: "${topic}". Use only questions to guide the student toward deeper understanding. Begin by asking a thoughtful, probing question about ${topic}.`;

    const chat = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a Socratic tutor. Your goal is to guide students to discover answers themselves through thoughtful questions. Never give direct answers. Always respond with questions that deepen understanding.' },
        { role: 'user', content: userMsg },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    return NextResponse.json({ output: chat.choices[0].message.content });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
