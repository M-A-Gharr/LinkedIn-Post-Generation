import { NextResponse } from 'next/server';

// Ensure this route is treated as dynamic to avoid static-generation
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { prompt, theme, type } = await request.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert LinkedIn content creator who writes engaging, professional posts that drive engagement and build thought leadership.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return NextResponse.json({ content, theme, type });
  } catch (error) {
    console.error('Error generating post:', error);
    return NextResponse.json(
      { error: 'Failed to generate post' },
      { status: 500 }
    );
  }
}
