import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const data = await res.json();
      setCategories(data.categories || []);
    }
    fetchCategories();
  }, []);

  // Fetch areas on mount
  useEffect(() => {
    async function fetchAreas() {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
      );
      const data = await res.json();
      setAreas(data.meals || []); // 'meals' key is used here even for area list
    }
    fetchAreas();
  }, []);

  // Fetch meals when area is selected
  useEffect(() => {
    if (!selectedArea) return;

    async function fetchMealsByArea() {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`
      );
      const data = await res.json();
      console.log("Meals by area:", data.meals); // For debug
    }

    fetchMealsByArea();
  }, [selectedArea]);

  // Fetch meals when category is selected
  useEffect(() => {
    if (!selectedCategory) return;

    async function fetchMealsByCategory() {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
      );
      const data = await res.json();
      console.log("Meals by category:", data.meals); // For debug
    }

    fetchMealsByCategory();
  }, [selectedCategory]);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search/${query}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-orange-300 p-4 border-b-4 border-black w-full">
      <h1
        className="mealfinder hover:scale-105 transition-transform"
        onClick={() => navigate(`/`)}
      >
        Meal Finder
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
        <div className="flex items-center w-full md:w-auto">
          {" "}
          <input
            className="searchbar rounded-lg p-1 w-full md:w-60"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meals..."
          />
          <button
            className="ml-2 rounded-lg cursor-pointer text-xl"
            onClick={handleSearch}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        <select
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            navigate(`/category/${e.target.value}`);
          }}
          value={selectedCategory}
          className="w-full md:w-52 rounded-lg p-2 border border-2"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.idCategory} value={cat.strCategory}>
              {cat.strCategory}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            setSelectedArea(e.target.value);
            navigate(`/area/${e.target.value}`);
          }}
          value={selectedArea}
          className="w-full md:w-52 rounded-lg p-2 border border-2"
        >
          <option value="">Select a region</option>
          {areas.map((area) => (
            <option key={area.strArea} value={area.strArea}>
              {area.strArea}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
