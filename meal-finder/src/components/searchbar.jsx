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
    <div className="bg-[#C8562A] border-b-4 border-[#d9c4ae] w-full ">
      {/* Main nav row */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-4">
        <h1
          className="mealfinder text-7xl hover:scale-105 transition-transform cursor-pointer text-[#2e1503] hover:text-[#d9c4ae]"
          onClick={() => navigate("/")}
        >
          Meal Finder
        </h1>

        <div className="">
          <h2
            onClick={() => navigate("/savedmeals")}
            className="mealfinder text-5xl cursor-pointer hover:scale-105 transition-transform text-[#2e1503] hover:text-[#d9c4ae]"
          >
            My Meals
          </h2>
          <h2
            onClick={() => navigate("/shopping")}
            className="mealfinder text-5xl cursor-pointer hover:scale-105 transition-transform text-[#2e1503] hover:text-[#d9c4ae]"
          >
            Grocery List
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="">
            <input
              className="w-full md:w-52 rounded-xl p-1 bg-[#f5efe8] cursor-pointer font-bold"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search meals..."
            />
            <button
              className="ml-2 cursor-pointer text-xl"
              onClick={handleSearch}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <button
            onClick={() => setShowAI((v) => !v)}
            className={`w-full md:w-52 rounded-xl p-1 bg-[#f5efe8] cursor-pointer font-bold ${
              showAI ? "" : ""
            }`}
          >
            AI Search
          </button>
          <Category />
          <Areas />
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
