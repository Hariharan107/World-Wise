import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
function App() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const FetchCities = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/cities");
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    FetchCities();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='pricing' element={<Pricing />} />
        <Route path='product' element={<Product />} />
        <Route path='login' element={<Login />} />
        <Route path='/app' element={<AppLayout />}>
          <Route index element={<Navigate replace to='cities' />} />
          <Route
            path='cities'
            element={<CityList cities={cities} isLoading={loading} />}
          />
          <Route path='cities/:id' element={<City />} />
          <Route
            path='countries'
            element={<CountryList cities={cities} isLoading={loading} />}
          />
          <Route path='form' element={<Form />} />
        </Route>
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
5;
