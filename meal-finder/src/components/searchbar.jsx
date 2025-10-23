import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Category from "./categories";
import Areas from "./area";

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

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

        <Category />
        <Areas />
      </div>
    </div>
  );
}
