import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchMealsByName } from "../api/APIFunctions";

async function aiSearchTerms(userQuery) {
  const res = await fetch("/.netlify/functions/ai-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: userQuery }),
  });

  if (!res.ok) throw new Error("AI search request failed");

  const data = await res.json();

  // Log the raw response so we can see what's coming back
  console.log("Raw API response:", data);

  const text = data.content?.[0]?.text || "";
  console.log("Extracted text:", text);

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    // Filter out any empty strings
    return parsed.filter((t) => t && t.trim() !== "");
  } catch {
    console.error("Failed to parse:", text);
    return [userQuery];
  }
}

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const navigate = useNavigate();

  const handleAISearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAiResults(null);
    try {
      const terms = await aiSearchTerms(query);
      console.log("AI suggested terms:", terms);
      const resultsArrays = await Promise.all(terms.map(searchMealsByName));
      const seen = new Set();
      const merged = resultsArrays
        .flat()
        .filter((m) => {
          if (!m || seen.has(m.idMeal)) return false;
          seen.add(m.idMeal);
          return true;
        })
        .slice(0, 20); // cap at 20 results
      setAiResults(merged);
    } catch (err) {
      console.error("AI search failed:", err);
      setAiResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAISearch();
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 bg-orange-50 border-2 border-orange-400 rounded-xl px-3 py-2">
        <span className="text-orange-500 text-lg">✨</span>
        <input
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-orange-300"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Try: 'high protein meals' or 'something with chicken and garlic'..."
        />
        <button
          onClick={handleAISearch}
          disabled={loading}
          className="bg-orange-400 hover:bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-lg transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "..." : "AI Search"}
        </button>
      </div>

      {aiResults !== null && (
        <div className="mt-4">
          {aiResults.length === 0 ? (
            <p className="text-center text-red-500 text-sm">
              No meals found for that search.
            </p>
          ) : (
            <>
              <p className="text-sm text-orange-600 font-semibold mb-3">
                ✨ AI found {aiResults.length} meal
                {aiResults.length !== 1 ? "s" : ""} for you:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {aiResults.map((meal) => (
                  <div
                    key={meal.idMeal}
                    onClick={() => navigate(`/meal/${meal.idMeal}`)}
                    className="bg-orange-200 rounded-lg p-3 text-center cursor-pointer hover:scale-105 transition-transform shadow-sm"
                  >
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      className="w-full rounded-lg mb-2"
                    />
                    <p className="text-xs font-semibold">{meal.strMeal}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
