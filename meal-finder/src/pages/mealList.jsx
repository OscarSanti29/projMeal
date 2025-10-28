import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SavedRecipes() {
  const [savedMeals, setSavedMeals] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const meals = JSON.parse(localStorage.getItem("savedMeals") || "[]");
    const validMeals = meals.filter((m) => m && m.idMeal);
    setSavedMeals(validMeals);
  }, []);

  return (
    <div className="p-6">
      <h2>Saved Recipes</h2>
      {savedMeals.length === 0 ? (
        <p>No saved recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {savedMeals.map((meal) => (
            <div
              key={meal.idMeal}
              className="bg-orange-300 rounded-lg shadow-md p-4 text-center hover:scale-105 transition-transform cursor-pointer"
              onClick={() => nav(`/meal/${meal.idMeal}`)}
            >
              <h3 className="my-2 font-semibold">{meal.strMeal}</h3>
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full m-auto rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
