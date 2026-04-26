import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Category from "./categories";
import Areas from "./area";
import AISearch from "./AISearch";

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const [showAI, setShowAI] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search/${query}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="bg-orange-300 border-b-4 border-black w-full">
      {/* Main nav row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
        <h1
          className="mealfinder hover:scale-105 transition-transform cursor-pointer"
          onClick={() => navigate("/")}
        >
          Meal Finder
        </h1>

        <div className="flex flex-wrap items-center gap-2 justify-center">
          <h2
            onClick={() => navigate("/savedmeals")}
            className="text-2xl font-bold cursor-pointer hover:scale-105 transition-transform"
            style={{ fontFamily: '"Bungee Inline", sans-serif' }}
          >
            My Meals
          </h2>
          <h2
            onClick={() => navigate("/shopping")}
            className="text-2xl font-bold cursor-pointer hover:scale-105 transition-transform"
            style={{ fontFamily: '"Bungee Inline", sans-serif' }}
          >
            🛒 Shopping
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          <div className="flex items-center w-full md:w-auto">
            <input
              className="w-full md:w-52 rounded-lg p-2 border border-2"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
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
          <button
            onClick={() => setShowAI((v) => !v)}
            className={`text-sm font-semibold px-3 py-2 rounded-lg border-2 border-orange-500 cursor-pointer transition ${
              showAI
                ? "bg-orange-500 text-white"
                : "bg-white text-orange-600 hover:bg-orange-100"
            }`}
          >
            ✨ AI Search
          </button>
        </div>
      </div>

      {/* AI Search expandable panel */}
      {showAI && (
        <div className="px-4 pb-4">
          <AISearch />
        </div>
      )}
    </div>
  );
}
