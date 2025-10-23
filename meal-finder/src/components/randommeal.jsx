import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMeal } from "../api/APIFunctions";

export default function RandomMeal() {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        setError(null);
        const mealData = await getMeal();

        if (mealData && mealData.meals && mealData.meals[0]) {
          setMeal(mealData.meals[0]);
        } else {
          setError("No meal data found");
        }
      } catch (error) {
        console.error("Could not get meal:", error);
        setError("Failed to load meal. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, []);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {meal ? (
        <div>
          <h2 className="text-2xl text-center mb-4">
            Meal of the day: {meal.strMeal}
          </h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              className="w-64 h-64 object-cover rounded-full"
              src={meal.strMealThumb}
              alt={meal.strMeal}
            />
            <div className="text-lg space-y-3">
              <p>
                <strong>Category:</strong> {meal.strCategory}
              </p>
              <p>
                <strong>Area:</strong> {meal.strArea}
              </p>
              <button
                className="mt-2 px-4 py-2 bg-orange-300 border-black border-2 rounded-lg hover:bg-orange-400 transition"
                onClick={() => nav(`/meal/${meal.idMeal}`)}
              >
                See Recipe
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">No meal available</p>
      )}
    </div>
  );
}
