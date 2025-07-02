const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function getAISuggestion(promptText) {
  if (!OPENAI_API_KEY) {
    throw new Error(
      "OpenAI API key is not defined. Check your environment variables."
    );
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that suggests next sentences for a writing app.",
        },
        { role: "user", content: promptText },
      ],
      max_tokens: 50,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`OpenAI API request failed: ${errorDetails}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
