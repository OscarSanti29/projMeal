import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Searchbar from "./searchbar";

export default function Mealslector() {
  const { query, category, area } = useParams();
  const [meals, setMeals] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchMeals() {
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
    }
    fetchMeals();
  }, [query, category, area]);

  return (
    <div>
      <Searchbar />
      {query && <h2 className="text-center">Results for "{query}"</h2>}
      {category && (
        <h2 className="text-center">Meals in "{category}" category</h2>
      )}
      {area && <h2> Meals in "{area}" region</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {meals.length > 0 ? (
          meals.map((meal) => (
            <div
              key={meal.idMeal}
              className="bg-orange-300 rounded-lg shadow-md p-4 text-center hover:scale-105 transition-transform"
              onClick={() => nav(`/meal/${meal.idMeal}`)}
            >
              <h3 className="my-2">{meal.strMeal}</h3>
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-sm m-auto"
              />
              <p>{meal.strCategory}</p>
              <button
                className="button rounded-lg mt-2 hover:bg-orange-400 transition"
                key={meal.idMeal}
                onClick={() => nav(`/meal/${meal.idMeal}`)}
              >
                Recipe
              </button>
            </div>
          ))
        ) : (
          <p className="errors">No meals found for "{query}".</p>
        )}
      </div>
    </div>
  );
}
