export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing ANTHROPIC_API_KEY env variable" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const { query } = body;
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing query" }),
    };
  }
  console.log("API key present:", !!apiKey);
  console.log("Query received:", query);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `You are a meal search assistant for TheMealDB. The user wants: "${query}".

TheMealDB only supports searching by meal name. Your job is to think of 3-5 SPECIFIC, DIVERSE meal names that match the user's request.

Rules:
- Return actual dish names, not generic ingredients like "chicken" or "pasta"
- Each term must be a different dish — no repeats or near-duplicates
- Be specific: "butter chicken" not just "chicken", "spaghetti carbonara" not just "pasta"
- If the user mentions a cuisine, mood, or ingredient, think of real dishes from that context
- If user says "spicy", think: "chilli", "jerk chicken", "vindaloo", "szechuan"
- If user says "comfort food", think: "shepherd's pie", "mac and cheese", "beef stew"
- If user says "healthy" or "low calorie", think: "grilled salmon", "tuna salad", "vegetable soup"
- If user mentions an ingredient, think of dishes that feature it prominently

Return ONLY a JSON array of meal name strings, no explanation, no markdown. Example: ["butter chicken", "chicken tikka masala", "jerk chicken", "chicken shawarma"]`,
          },
        ],
      }),
    });

    const data = await res.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
