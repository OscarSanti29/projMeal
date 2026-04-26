import { useEffect, useState } from "react";

function parseIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : "",
      });
    }
  }
  return ingredients;
}

function consolidateIngredients(meals) {
  const map = {};
  meals.forEach((meal) => {
    const items = parseIngredients(meal);
    items.forEach(({ ingredient, measure }) => {
      const key = ingredient.toLowerCase();
      if (!map[key]) {
        map[key] = { ingredient, measures: [], meals: [] };
      }
      if (measure) map[key].measures.push(measure);
      if (!map[key].meals.includes(meal.strMeal)) {
        map[key].meals.push(meal.strMeal);
      }
    });
  });
  return Object.values(map).sort((a, b) =>
    a.ingredient.localeCompare(b.ingredient),
  );
}

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [savedMeals, setSavedMeals] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const meals = JSON.parse(localStorage.getItem("savedMeals") || "[]").filter(
      (m) => m && m.idMeal,
    );
    setSavedMeals(meals);
    setItems(consolidateIngredients(meals));
  }, []);

  const toggle = (key) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const unchecked = items.filter((i) => !checked[i.ingredient.toLowerCase()]);
  const checkedItems = items.filter((i) => checked[i.ingredient.toLowerCase()]);

  const copyList = () => {
    const text = unchecked
      .map((i) => `• ${i.measures.join(" + ")} ${i.ingredient}`)
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (savedMeals.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">🛒 Shopping List</h2>
        <p className="text-gray-500">
          Save some meals first and your shopping list will be generated here!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">🛒 Shopping List</h2>
        <button
          onClick={copyList}
          className="bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
        >
          {copied ? "✓ Copied!" : "Copy List"}
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-5">
        Combined ingredients from {savedMeals.length} saved meal
        {savedMeals.length !== 1 ? "s" : ""}:{" "}
        <span className="font-semibold text-orange-600">
          {savedMeals.map((m) => m.strMeal).join(", ")}
        </span>
      </p>

      {/* Unchecked items */}
      <div className="space-y-2 mb-6">
        {unchecked.map((item) => {
          const key = item.ingredient.toLowerCase();
          return (
            <div
              key={key}
              onClick={() => toggle(key)}
              className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-orange-100 transition"
            >
              <div className="w-5 h-5 border-2 border-orange-400 rounded mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-semibold text-gray-800">
                  {item.ingredient}
                </span>
                {item.measures.length > 0 && (
                  <span className="text-sm text-gray-500 ml-2">
                    — {item.measures.join(", ")}
                  </span>
                )}
                {item.meals.length > 1 && (
                  <p className="text-xs text-orange-500 mt-0.5">
                    Used in: {item.meals.join(", ")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Checked items */}
      {checkedItems.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 font-semibold mb-2">
            ✓ Got it ({checkedItems.length})
          </p>
          <div className="space-y-2 opacity-40">
            {checkedItems.map((item) => {
              const key = item.ingredient.toLowerCase();
              return (
                <div
                  key={key}
                  onClick={() => toggle(key)}
                  className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer"
                >
                  <div className="w-5 h-5 border-2 border-gray-400 rounded mt-0.5 flex-shrink-0 bg-gray-400" />
                  <span className="line-through text-gray-500">
                    {item.ingredient}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
