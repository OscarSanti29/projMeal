const API = "https://www.themealdb.com/api/json/v1/1/";

export async function getMeal() {
  const res = await fetch(`${API}random.php`);
  if (!res.ok) throw new Error(`HTTP error!! status: ${res.status}`);
  return await res.json();
}

export async function getCategories() {
  const res = await fetch(`${API}categories.php`);
  if (!res.ok) throw new Error(`HTTP Error!!: ${res.status}`);
  return await res.json();
}

export async function getAreas() {
  const res = await fetch(`${API}list.php?a=list`);
  if (!res.ok) throw new Error(`HTTP Error!!: ${res.status}`);
  return await res.json();
}

export async function getMealById(id) {
  const res = await fetch(`${API}lookup.php?i=${id}`);
  if (!res.ok) throw new Error(`HTTP Error!!: ${res.status}`);
  const data = await res.json();
  return data.meals ? data.meals[0] : null;
}

// Open Food Facts - fetch nutrition for an ingredient
export async function getNutrition(ingredientName) {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        ingredientName,
      )}&search_simple=1&action=process&json=1&page_size=1`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.products && data.products.length > 0) {
      const p = data.products[0];
      return {
        name: ingredientName,
        calories: p.nutriments?.["energy-kcal_100g"] ?? null,
        protein: p.nutriments?.proteins_100g ?? null,
        carbs: p.nutriments?.carbohydrates_100g ?? null,
        fat: p.nutriments?.fat_100g ?? null,
      };
    }
    return null;
  } catch {
    return null;
  }
}

// AI-powered search via Claude
export async function aiSearchMeals(userQuery) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a meal search assistant. The user wants to find meals with this request: "${userQuery}".
          
Extract 1-3 search terms to query TheMealDB API (search by meal name). TheMealDB searches by meal name only.
Return ONLY a JSON array of search terms, no other text. Example: ["chicken", "pasta"]
Keep terms simple and broad. If user mentions calories or nutrition, suggest ingredient-based meal names instead.`,
        },
      ],
    }),
  });
  const data = await res.json();
  const text = data.content?.[0]?.text || '[""]';
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return [userQuery];
  }
}

// Fetch meals from MealDB by search term
export async function searchMealsByName(term) {
  const res = await fetch(`${API}search.php?s=${encodeURIComponent(term)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.meals || [];
}
