import Mealinfo from "./pages/mealinfo";
import Home from "./pages/Home";
import Mealslector from "./pages/mealselector";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SavedRecipes } from "./pages/mealList";
import Searchbar from "./components/searchbar";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <>
      <BrowserRouter>
        {location.pathname && <Searchbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meal/:id" element={<Mealinfo />} />
          <Route path="/search/:query" element={<Mealslector />} />
          <Route path="/category/:category" element={<Mealslector />} />
          <Route path="/area/:area" element={<Mealslector />} />
          <Route path="/savedmeals" element={<SavedRecipes />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
