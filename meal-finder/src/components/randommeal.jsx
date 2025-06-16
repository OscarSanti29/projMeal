import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RandomMeal() {
  const [meal, setMeal] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    async function getMeal() {
      try {
        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/random.php"
        );
        const data = await res.json();
        setMeal(data.meals[0]);
      } catch (error) {
        console.error("failed to fetch meal:", error);
      }
    }
    getMeal();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {meal ? (
        <div>
          <h2 className="text-2xl text-center mb-4">
            {" "}
            Meal of the day: {meal.strMeal}
          </h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              className="w-64 h-64 object-cover rounded-full"
              src={meal.strMealThumb}
            />
            <div className=" text-lg space-y-3">
              {" "}
              <p>
                {" "}
                <strong>Category:</strong> {meal.strCategory}
              </p>
              <p>
                {" "}
                <strong>Area: </strong>
                {meal.strArea}
              </p>{" "}
              <button
                className="mt-2 px-4 py-2 bg-orange-300 border border-black border-2 rounded-lg hover:bg-orange-400 transition"
                key={meal.idMeal}
                onClick={() => nav(`/meal/${meal.idMeal}`)}
              >
                See Recipe
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}{" "}
    </div>
  );
}
