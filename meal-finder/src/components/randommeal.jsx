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
          <h2 className="mealfinder text-6xl text-[#2e1503] text-center mb-4">
            Meal of the day: {meal.strMeal}
          </h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-[#d9c4ae] shadow-xl rounded-xl p-3 ">
            <div className="grid">
              <img
                className="w-96 h-96 object-cover rounded-full"
                src={meal.strMealThumb}
                alt={meal.strMeal}
              />
              <button
                className="mt-4 p-1 shadow-xl font-semibold w-1/2 m-auto text-xl bg-[#fdf3e7] rounded-lg hover:bg-[#c8562a] transition"
                onClick={() => nav(`/meal/${meal.idMeal}`)}
              >
                See Recipe
              </button>
            </div>

            <div className="mx-3 my-20">
              <p className="font-bold text-3xl">Category: {meal.strCategory}</p>
              <p className="font-bold text-3xl">Region: {meal.strArea}</p>

              <div className=" font-semibold text-lg">
                Ingridients
                <ul className="list-disc list-inside mt-1 grid grid-cols-2 ">
                  {getIngredients(meal).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">No meal available</p>
      )}
    </div>
  );
}
