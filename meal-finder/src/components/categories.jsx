import { getCategories } from "../api/APIFunctions";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Category() {
  const nav = useNavigate();
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategory(data.categories || []);
      } catch (error) {
        console.error("Failed to get categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <select
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          nav(`/category/${e.target.value}`);
        }}
        value={selectedCategory}
        className="w-full md:w-52 rounded-xl p-1 bg-[#f5efe8] cursor-pointer font-bold"
      >
        <option value="">Select a category</option>
        {category.map((cat) => (
          <option key={cat.idCategory} value={cat.strCategory}>
            {cat.strCategory}
          </option>
        ))}
      </select>
    </>
  );
}
