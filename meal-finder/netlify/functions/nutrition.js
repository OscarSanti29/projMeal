export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const ingredient = event.queryStringParameters?.ingredient;
  if (!ingredient) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ingredient" }),
    };
  }

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        ingredient,
      )}&search_simple=1&action=process&json=1&page_size=1`,
      { headers: { "User-Agent": "MealFinderApp/1.0" } },
    );

    if (!res.ok) return { statusCode: 200, body: JSON.stringify(null) };

    const data = await res.json();
    const p = data.products?.[0];

    if (!p) return { statusCode: 200, body: JSON.stringify(null) };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: ingredient,
        calories: p.nutriments?.["energy-kcal_100g"] ?? null,
        protein: p.nutriments?.proteins_100g ?? null,
        carbs: p.nutriments?.carbohydrates_100g ?? null,
        fat: p.nutriments?.fat_100g ?? null,
      }),
    };
  } catch (err) {
    return { statusCode: 200, body: JSON.stringify(null) };
  }
}
