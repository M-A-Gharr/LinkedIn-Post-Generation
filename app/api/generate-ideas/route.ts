import { NextResponse } from 'next/server';

// Ensure this route is treated as dynamic to avoid static-generation
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
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
            content: 'You are an expert LinkedIn content strategist who creates engaging content ideas across various professional topics.',
          },
          {
            role: 'user',
            content: `Generate 10 compelling LinkedIn content ideas for the next 2 weeks. Include diverse topics like:
            - Leadership insights
            - Industry trends
            - Personal growth
            - Team collaboration
            - Innovation
            - Career development

            Return ONLY a valid JSON array with this exact structure:
            [
              {
                "title": "Short catchy title",
                "description": "Brief description of the content idea (2-3 sentences)",
                "category": "One of: Leadership, Career, Innovation, Industry, Personal"
              }
            ]

            Return only the JSON array, no additional text.`,
          },
        ],
        temperature: 0.9,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const ideas = JSON.parse(content);

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Error generating ideas:', error);
    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    );
  }
}
