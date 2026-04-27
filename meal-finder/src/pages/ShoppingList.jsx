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
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-6xl mealfinder text-[#2e1503] mb-4">
          Shopping List
        </h2>
        <p className="text-gray-500">
          Save some meals first and your shopping list will be generated here!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-6xl mealfinder text-[#2e1503]">Shopping List</h2>
        <button
          onClick={copyList}
          className="bg-[#e8962a] hover:bg-[#c8562a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
        >
          {copied ? "✓ Copied!" : "Copy List"}
        </button>
      </div>

      <p className="text-md font-semibold text-gray-500 mb-6">
        Combined ingredients from {savedMeals.length} saved meal
        {savedMeals.length !== 1 ? "s" : ""}:{" "}
        <span className="font-bold text-[#e8962a]">
          {savedMeals.map((m) => m.strMeal).join(", ")}
        </span>
      </p>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column — Still need */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-[#e8962a]" />
            <h3 className="font-bold text-lg text-[#2e1503]">
              Still Need ({unchecked.length})
            </h3>
          </div>
          <div className="space-y-2">
            {unchecked.length === 0 ? (
              <p className="text-gray-400 text-sm italic px-1">
                All done! Everything's in the cart.
              </p>
            ) : (
              unchecked.map((item) => {
                const key = item.ingredient.toLowerCase();
                return (
                  <div
                    key={key}
                    onClick={() => toggle(key)}
                    className="flex items-start gap-3 border border-[#e8962a] rounded-lg px-4 py-3 cursor-pointer hover:bg-orange-50 transition"
                  >
                    <div className="w-5 h-5 border-2 border-[#2e1503] rounded mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">
                        {item.measures.length > 0 && (
                          <span className="text-[#c8562a] font-normal mr-1">
                            {item.measures.join(" + ")}
                          </span>
                        )}
                        {item.ingredient}
                      </span>
                      {item.meals.length > 1 && (
                        <p className="text-xs text-[#e8962a] mt-0.5">
                          Used in: {item.meals.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column — Already got */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <h3 className="font-bold text-lg text-[#2e1503]">
              Already Got ({checkedItems.length})
            </h3>
          </div>
          <div className="space-y-2">
            {checkedItems.length === 0 ? (
              <p className="text-gray-400 text-sm italic px-1">
                Tap an item on the left to mark it as gotten.
              </p>
            ) : (
              checkedItems.map((item) => {
                const key = item.ingredient.toLowerCase();
                return (
                  <div
                    key={key}
                    onClick={() => toggle(key)}
                    className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-green-100 transition"
                  >
                    <div className="w-5 h-5 border-2 border-green-500 rounded mt-0.5 flex-shrink-0 bg-green-500 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="line-through text-gray-400 font-semibold">
                      {item.ingredient}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
