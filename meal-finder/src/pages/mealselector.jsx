import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Searchbar from "../components/searchbar";

export default function Mealslector() {
  const { query, category, area } = useParams();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchMeals() {
      try {
        setLoading(true);
        let url = "";

        if (query) {
          url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
        } else if (category) {
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        } else if (area) {
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setMeals(data.meals || []);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMeals();
  }, [query, category, area]);

  return (
    <div>
      {query && (
        <h2 className="mealfinder text-[#2e1503] text-6xl text-center text-2xl mt-4">
          Results for "{query}"
        </h2>
      )}
      {category && (
        <h2 className="mealfinder text-[#2e1503] text-6xl text-center text-2xl mt-4">
          Meals in "{category}" category
        </h2>
      )}
      {area && (
        <h2 className="mealfinder text-[#2e1503] text-6xl text-center text-2xl mt-4">
          Meals in "{area}" region
        </h2>
      )}

      {loading ? (
        <p className="text-center mt-8">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {meals.length > 0 ? (
            meals.map((meal) => (
              <div
                key={meal.idMeal}
                className="bg-[#D9C4AE] rounded-lg shadow-md p-4 text-center hover:scale-105 transition-transform cursor-pointer hover:bg-[#C8562A]"
                onClick={() => nav(`/meal/${meal.idMeal}`)}
              >
                <h3 className="my-2 mealfinder font-bold text-2xl">
                  {meal.strMeal}
                </h3>
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="w-full m-auto rounded-lg"
                />
                {meal.strCategory && <p className="mt-2">{meal.strCategory}</p>}
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-red-500">
              No meals found for "{query || category || area}".
            </p>
          )}
        </div>
      )}
    </div>
  );
}
