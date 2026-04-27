import { useState } from "react";
import { getNutrition } from "../api/APIFunctions";

function parseFraction(str) {
  if (!str) return 1;
  if (str.includes("/")) {
    const [a, b] = str.split("/");
    return parseFloat(a) / parseFloat(b);
  }
  return parseFloat(str) || 1;
}

function toGrams(measure) {
  if (!measure) return 100;
  const m = measure.toLowerCase().trim();
  const gMatch = m.match(/^([\d.\/]+)\s*g\b/);
  if (gMatch) return parseFraction(gMatch[1]);
  const kgMatch = m.match(/^([\d.\/]+)\s*kg\b/);
  if (kgMatch) return parseFraction(kgMatch[1]) * 1000;
  const ozMatch = m.match(/^([\d.\/]+)\s*oz/);
  if (ozMatch) return parseFraction(ozMatch[1]) * 28.35;
  const lbMatch = m.match(/^([\d.\/]+)\s*lb/);
  if (lbMatch) return parseFraction(lbMatch[1]) * 453.6;
  const cupMatch = m.match(/^([\d.\/]+)\s*cup/);
  if (cupMatch) return parseFraction(cupMatch[1]) * 240;
  const tbspMatch = m.match(/^([\d.\/]+)\s*(tbsp|tablespoon)/);
  if (tbspMatch) return parseFraction(tbspMatch[1]) * 15;
  const tspMatch = m.match(/^([\d.\/]+)\s*(tsp|teaspoon)/);
  if (tspMatch) return parseFraction(tspMatch[1]) * 5;
  const mlMatch = m.match(/^([\d.\/]+)\s*ml/);
  if (mlMatch) return parseFraction(mlMatch[1]);
  const numMatch = m.match(/^([\d.\/]+)/);
  if (numMatch) return parseFraction(numMatch[1]) * 150;
  if (m.includes("pinch") || m.includes("taste") || m.includes("garnish"))
    return 2;
  return 100;
}

function parseIngredientLine(fullString) {
  const words = fullString.trim().split(/\s+/);
  const ingredientName = words.slice(-2).join(" ");
  const measure = words.slice(0, -2).join(" ") || "";
  return { ingredientName, measure };
}

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
      const top = ingredients.slice(0, 10);
      const results = await Promise.all(
        top.map(async (fullIng) => {
          const { ingredientName, measure } = parseIngredientLine(fullIng);
          const data = await getNutrition(ingredientName);
          if (!data || data.calories === null) return null;
          const grams = toGrams(measure);
          const factor = grams / 100;
          return {
            name: ingredientName,
            grams: Math.round(grams),
            calories: Math.round((data.calories || 0) * factor),
            protein: +((data.protein || 0) * factor).toFixed(1),
            carbs: +((data.carbs || 0) * factor).toFixed(1),
            fat: +((data.fat || 0) * factor).toFixed(1),
          };
        }),
      );
      setNutrition(results.filter(Boolean));
    } catch (err) {
      console.error("Nutrition fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const totals = nutrition.reduce(
    (acc, n) => ({
      calories: acc.calories + n.calories,
      protein: +(acc.protein + n.protein).toFixed(1),
      carbs: +(acc.carbs + n.carbs).toFixed(1),
      fat: +(acc.fat + n.fat).toFixed(1),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

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
            Estimated Meal Nutrition
            <span className="text-xs font-normal text-green-600 ml-2">
              (based on recipe amounts)
            </span>
          </h3>

          {loading ? (
            <p className="text-green-700 text-sm animate-pulse">
              Calculating nutrition...
            </p>
          ) : nutrition.length === 0 ? (
            <p className="text-sm text-red-500">No nutrition data found.</p>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  {
                    label: "Total Calories",
                    value: totals.calories,
                    unit: "kcal",
                    color: "text-orange-600",
                  },
                  {
                    label: "Protein",
                    value: `${totals.protein}g`,
                    unit: "",
                    color: "text-blue-600",
                  },
                  {
                    label: "Carbs",
                    value: `${totals.carbs}g`,
                    unit: "",
                    color: "text-yellow-600",
                  },
                  {
                    label: "Fat",
                    value: `${totals.fat}g`,
                    unit: "",
                    color: "text-red-500",
                  },
                ].map(({ label, value, unit, color }) => (
                  <div
                    key={label}
                    className="bg-white rounded-lg p-2 text-center border border-green-200"
                  >
                    <p className="text-xs text-green-600">{label}</p>
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    {unit && <p className="text-xs text-green-500">{unit}</p>}
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-green-700 border-b border-green-200">
                      <th className="text-left py-1">Ingredient</th>
                      <th className="text-right py-1">~Amount</th>
                      <th className="text-right py-1">Cal</th>
                      <th className="text-right py-1">Protein</th>
                      <th className="text-right py-1">Carbs</th>
                      <th className="text-right py-1">Fat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutrition.map((n, i) => (
                      <tr key={i} className="border-b border-green-100">
                        <td className="py-1 capitalize">{n.name}</td>
                        <td className="text-right py-1 text-green-600">
                          {n.grams}g
                        </td>
                        <td className="text-right py-1">{n.calories}</td>
                        <td className="text-right py-1">{n.protein}g</td>
                        <td className="text-right py-1">{n.carbs}g</td>
                        <td className="text-right py-1">{n.fat}g</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold text-green-800 border-t-2 border-green-300">
                      <td className="py-1" colSpan={2}>
                        Total
                      </td>
                      <td className="text-right py-1">{totals.calories}</td>
                      <td className="text-right py-1">{totals.protein}g</td>
                      <td className="text-right py-1">{totals.carbs}g</td>
                      <td className="text-right py-1">{totals.fat}g</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="text-xs text-green-500 mt-2">
                * Estimates from Open Food Facts. Actual values may vary.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
