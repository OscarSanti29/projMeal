import { useState } from "react";
import { getNutrition } from "../api/APIFunctions";

export default function NutritionPanel({ ingredients }) {
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchNutrition = async () => {
    if (nutrition.length > 0) {
      setOpen(true);
      return;
    }
    setLoading(true);
    setOpen(true);
    try {
      // Only fetch first 8 ingredients to stay fast
      const topIngredients = ingredients.slice(0, 8);
      const results = await Promise.all(
        topIngredients.map((ing) => {
          const name = ing.split(" ").slice(-2).join(" "); // strip measure
          return getNutrition(name);
        }),
      );
      setNutrition(results.filter(Boolean));
    } catch (err) {
      console.error("Nutrition fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalCalories = nutrition
    .reduce((sum, n) => sum + (n.calories || 0), 0)
    .toFixed(0);

  return (
    <div className="mt-4">
      <button
        onClick={open ? () => setOpen(false) : fetchNutrition}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer text-sm"
      >
        🥗 {open ? "Hide" : "Show"} Nutrition Info
      </button>

      {open && (
        <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-bold text-green-800 text-base mb-3">
            Nutrition Breakdown{" "}
            <span className="text-xs font-normal text-green-600">
              (per 100g per ingredient)
            </span>
          </h3>

          {loading ? (
            <p className="text-green-700 text-sm">Fetching nutrition data...</p>
          ) : nutrition.length === 0 ? (
            <p className="text-sm text-red-500">No nutrition data found.</p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-white rounded-lg p-2 text-center border border-green-200">
                  <p className="text-xs text-green-600">Est. Calories</p>
                  <p className="text-xl font-bold text-green-800">
                    {totalCalories}
                  </p>
                  <p className="text-xs text-green-500">kcal total</p>
                </div>
                <div className="bg-white rounded-lg p-2 text-center border border-green-200">
                  <p className="text-xs text-green-600">Ingredients tracked</p>
                  <p className="text-xl font-bold text-green-800">
                    {nutrition.length}
                  </p>
                  <p className="text-xs text-green-500">
                    of {ingredients.length}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-2 text-center border border-green-200">
                  <p className="text-xs text-green-600">Avg Protein</p>
                  <p className="text-xl font-bold text-green-800">
                    {(
                      nutrition.reduce((s, n) => s + (n.protein || 0), 0) /
                      nutrition.length
                    ).toFixed(1)}
                    g
                  </p>
                  <p className="text-xs text-green-500">per ingredient</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-green-700 border-b border-green-200">
                      <th className="text-left py-1">Ingredient</th>
                      <th className="text-right py-1">Calories</th>
                      <th className="text-right py-1">Protein</th>
                      <th className="text-right py-1">Carbs</th>
                      <th className="text-right py-1">Fat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutrition.map((n, i) => (
                      <tr key={i} className="border-b border-green-100">
                        <td className="py-1 capitalize">{n.name}</td>
                        <td className="text-right py-1">
                          {n.calories ? `${n.calories.toFixed(0)} kcal` : "—"}
                        </td>
                        <td className="text-right py-1">
                          {n.protein ? `${n.protein.toFixed(1)}g` : "—"}
                        </td>
                        <td className="text-right py-1">
                          {n.carbs ? `${n.carbs.toFixed(1)}g` : "—"}
                        </td>
                        <td className="text-right py-1">
                          {n.fat ? `${n.fat.toFixed(1)}g` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-green-500 mt-2">
                * Data from Open Food Facts, estimated values per 100g
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
