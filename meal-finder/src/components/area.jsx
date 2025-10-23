import { getAreas } from "../api/APIFunctions";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Areas() {
  const [area, setArea] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreas();
        setArea(data.meals || []);
      } catch (error) {
        console.error("Failed to get Area: ", error);
      }
    };
    fetchAreas();
  }, []);

  return (
    <>
      <select
        onChange={(e) => {
          setSelectedArea(e.target.value);
          nav(`/area/${e.target.value}`);
        }}
        value={selectedArea}
        className="w-full md:w-52 rounded-lg p-2 border border-2"
      >
        <option value="">Select a region</option>
        {area.map((a) => (
          <option key={a.strArea} value={a.strArea}>
            {a.strArea}
          </option>
        ))}
      </select>
    </>
  );
}
