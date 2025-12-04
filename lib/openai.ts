export async function generateLinkedInPost(
  theme: string,
  type: 'long' | 'short' | 'carousel'
): Promise<string> {
  const prompts = {
    long: `Generate a professional and engaging long-form LinkedIn post (300-500 words) about "${theme}".
    Include:
    - A compelling hook
    - Key insights or stories
    - Actionable takeaways
    - A call-to-action
    - Use line breaks for readability
    - Include relevant emojis sparingly
    Make it authentic and valuable.`,

    short: `Generate a concise and impactful LinkedIn post (100-150 words) about "${theme}".
    Include:
    - A strong opening line
    - One key insight
    - A clear call-to-action
    Keep it punchy and memorable.`,

    carousel: `Generate content for a LinkedIn carousel post about "${theme}".
    Provide:
    - Slide 1: Attention-grabbing title (max 10 words)
    - Slides 2-8: Key points, one per slide (max 30 words each)
    - Slide 9: Call-to-action or conclusion
    Format as: [SLIDE X] Content
    Make each slide visually scannable and impactful.`
  };

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompts[type],
      theme,
      type,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate post');
  }

  const data = await response.json();
  return data.content;
}

export async function generateCalendarIdeas(): Promise<Array<{
  title: string;
  description: string;
  category: string;
}>> {
  const response = await fetch('/api/generate-ideas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to generate ideas');
  }

  const data = await response.json();
  return data.ideas;
}
