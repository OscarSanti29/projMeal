import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Mealinfo() {
  const [info, setInfo] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function Mealdetails() {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await res.json();

        if (data.meals && data.meals.length > 0) {
          setInfo(data.meals[0]);
          console.log("Fetched meal info:", data.meals[0]);
        } else {
          console.error("No meal found for id:", id);
        }
      } catch (error) {
        console.log("Cannot get meal:", error);
      }
    }
    Mealdetails();
  }, [id]);

  function getIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(`${measure} ${ingredient}`.trim());
      }
    }
    return ingredients;
  }

  function handleSaveMeal(meal) {
    console.log("Trying to save meal:", meal);

    if (!meal || !meal.idMeal) {
      alert("Meal data not available yet — please wait a moment.");
      console.error("Invalid meal:", meal);
      return;
    }

    let savedMeals;
    try {
      const stored = localStorage.getItem("savedMeals");
      savedMeals = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(savedMeals)) savedMeals = [];
    } catch (e) {
      console.error("Error reading saved meals:", e);
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
    console.log("Saved meals now:", savedMeals);
  }
  if (!info)
    return <p className="text-center text-lg p-4">Loading meal info...</p>;

  return (
    <div>
      <h2 className="text-center text-2xl mt-6 mb-4">{info.strMeal}</h2>

      <div className="meal-info flex flex-col md:flex-row items-center md:items-start justify-center max-w-5xl mx-auto gap-6 p-4">
        <div className="grid">
          {" "}
          <img
            src={info.strMealThumb}
            alt={info.strMeal}
            className="w-96 h-96 object-cover rounded-full"
          />
          <button
            onClick={() => handleSaveMeal(info)}
            className="border border-2 bg-orange-300 w-1/2 m-auto my-2 rounded-lg font-semibold cursor-pointer hover:bg-orange-400 transition"
          >
            Save Recipe
          </button>
        </div>

        <div className="text-xl space-y-3 rounded-xl p-3 shadow-xl bg-orange-200">
          <div>
            {" "}
            <p>
              <strong>Category:</strong> {info.strCategory}
            </p>
            <p>
              <strong>Area:</strong> {info.strArea}
            </p>
            <p>
              <strong>Video:</strong>{" "}
              <a
                href={info.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Watch on YouTube
              </a>
            </p>
          </div>

          <div className=" font-semibold">
            Ingridients
            <ul className="list-disc list-inside mt-1 grid grid-cols-2 ">
              {getIngredients(info).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className=" text-center p-2 text-lg bg-orange-200 ">
        <strong className="text-5xl">Instructions:</strong>
        <p className="whitespace-pre-line font-semibold">
          {info.strInstructions}
        </p>
      </div>
    </div>
  );
}
