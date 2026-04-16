import { NextRequest, NextResponse } from 'next/server';

// Lazy-loaded OpenAI client to avoid build-time credential checks
let _clientPromise: Promise<any> | null = null;

async function getClient() {
  if (!_clientPromise) {
    _clientPromise = (async () => {
      const { default: OpenAI } = await import('openai');
      return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: 'https://api.deepseek.com/v1',
      });
    })();
  }
  return _clientPromise;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const client = await getClient();
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
    });
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
