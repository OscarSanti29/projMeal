import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NutritionPanel from "../components/NutritionPanel";

export default function Mealinfo() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const controller = new AbortController();

    async function Mealdetails() {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
          { signal: controller.signal },
        );

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        if (data.meals && data.meals.length > 0) {
          setInfo(data.meals[0]);
        } else {
          setError("Meal not found.");
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log("Cannot get meal:", error);
          setError("Failed to load meal. Please try again.");
        }
      }
    }

    Mealdetails();
    return () => controller.abort();
  }, [id]);

  function getIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(
          `${measure ? measure.trim() + " " : ""}${ingredient.trim()}`,
        );
      }
    }
    return ingredients;
  }

  function handleSaveMeal(meal) {
    if (!meal || !meal.idMeal) {
      alert("Meal data not available yet — please wait a moment.");
      return;
    }
    let savedMeals;
    try {
      const stored = localStorage.getItem("savedMeals");
      savedMeals = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(savedMeals)) savedMeals = [];
    } catch {
      savedMeals = [];
    }
    const alreadySaved = savedMeals.some((m) => m.idMeal === meal.idMeal);
    if (alreadySaved) {
      alert("Recipe already saved!");
      return;
    }
    savedMeals.push(meal);
    localStorage.setItem("savedMeals", JSON.stringify(savedMeals));
    alert("Recipe saved!");
  }

  if (error)
    return <p className="text-center text-red-500 text-lg p-4">{error}</p>;

  if (!info)
    return <p className="text-center text-lg p-4">Loading meal info...</p>;

  const ingredients = getIngredients(info);

  return (
    <div>
      <h2 className="mealfinder text-center text-6xl text-[#2e1503] mt-6 mb-4">
        {info.strMeal}
      </h2>

      <div className="meal-info flex flex-col md:flex-row items-center md:items-start justify-center max-w-5xl mx-auto gap-6 p-4">
        <div className="grid">
          <img
            src={info.strMealThumb}
            alt={info.strMeal}
            className="w-96 h-96 object-cover rounded-full"
          />
          <button
            onClick={() => handleSaveMeal(info)}
            className="bg-[#e8962a] w-1/2 m-auto my-2 text-xl text-[#fdf3e7] rounded-lg font-semibold cursor-pointer hover:bg-[#c8562a] transition"
          >
            Save Recipe
          </button>
        </div>

        <div className="text-2xl space-y-3 rounded-xl p-3 shadow-xl bg-[#d9c4ae] w-full md:max-w-lg">
          <div>
            <p className="mealfinder font-semibold text-[#2e1503]">
              Category: {info.strCategory}
            </p>
            <p className="mealfinder font-semibold text-[#2e1503]">
              Area: {info.strArea}
            </p>
            {info.strYoutube && (
              <p className="font-semibold mealfinder text-[#2e1503]">
                Video:{" "}
                <a
                  href={info.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e8962a] font-semibold underline hover:text-[#c8562a] transition"
                >
                  Watch on YouTube
                </a>
              </p>
            )}
          </div>

          <div className="font-semibold mealfinder text-[#2e1503]">
            Ingredients
            <ul className="list-disc list-inside mt-1 grid grid-cols-2 text-base">
              {ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Nutrition Panel */}
          <NutritionPanel ingredients={ingredients} />
        </div>
      </div>

      <div className="text-center p-2 text-xl bg-[#c8562a] text-[#fdf3e7] border-6 border-[#d9c4ae] max-w-7xl mx-auto rounded-xl shadow-lg mb-6">
        <strong className="text-5xl">Instructions:</strong>
        <p className="whitespace-pre-line font-semibold">
          {info.strInstructions}
        </p>
      </div>
    </div>
  );
}
