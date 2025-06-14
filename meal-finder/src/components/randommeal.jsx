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
    <div className="">
      {meal ? (
        <div>
          <h2> Meal of the day: {meal.strMeal}</h2>
          <div className="random">
            <img className="ml-70" src={meal.strMealThumb} />
            <div className="p-6 text-xl">
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
                className=" button rounded-lg"
                key={meal.idMeal}
                onClick={() => nav(`/meal/${meal.idMeal}`)}
              >
                See Recipe
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}{" "}
    </div>
  );
}
