import Mealinfo from "./components/mealinfo";
import Home from "./components/Home";
import Mealslector from "./components/mealselector";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meal/:id" element={<Mealinfo />} />
          <Route path="/search/:query" element={<Mealslector />} />
          <Route path="/category/:category" element={<Mealslector />} />
          <Route path="/area/:area" element={<Mealslector />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
