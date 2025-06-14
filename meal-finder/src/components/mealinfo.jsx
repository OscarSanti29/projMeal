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

  if (!info) return <p>Loading meal info...</p>;
  return (
    <div>
      <Searchbar />
      <h2>{info.strMeal}</h2>
      <div className="meal-info text-lg">
        {" "}
        <img src={info.strMealThumb} alt={info.strMeal} className="w-lg " />
        <div className="p-6">
          {" "}
          <p>
            {" "}
            <strong>Category:</strong> {info.strCategory}
          </p>
          <p>
            {" "}
            <strong>Area: </strong>
            {info.strArea}
          </p>
          <p>
            {" "}
            <strong>Video: </strong>
            {info.strYoutube}
          </p>
          <strong>Ingredients: </strong>
          <ul>
            {getIngredients(info).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-center text-lg">
        {" "}
        <strong>Instructions: </strong>
        {info.strInstructions}
      </p>
    </div>
  );
}
