import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Searchbar from "./searchbar";

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
        setInfo(data.meals[0] || null);
      } catch (error) {
        console.log("cannot get meal:", error);
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

  if (!info)
    return <p className="text-center text-lg p-4">Loading meal info...</p>;

  return (
    <div>
      <Searchbar />
      <h2 className="text-center text-2xl mt-6 mb-4">{info.strMeal}</h2>

      <div className="meal-info flex flex-col md:flex-row items-center md:items-start justify-center max-w-5xl mx-auto gap-6 p-4">
        <img
          src={info.strMealThumb}
          alt={info.strMeal}
          className="w-64 h-64 object-cover rounded-full"
        />

        <div className="text-lg space-y-3">
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
          <div>
            <strong>Ingredients:</strong>
            <ul className="list-disc list-inside mt-1">
              {getIngredients(info).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 text-lg">
        <strong className="block mb-2">Instructions:</strong>
        <p className="whitespace-pre-line">{info.strInstructions}</p>
      </div>
    </div>
  );
}
