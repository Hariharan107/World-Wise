import { useState, useEffect, useContext, createContext } from "react";
const CitiesContext = createContext();
const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
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
  const getCity = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const addNewCity = async (newCity) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();
      setCities((cities) => [...cities, data]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const contextValue = {
    cities,
    loading,
    currentCity,
    addNewCity,
    getCity,
  };
  return (
    <CitiesContext.Provider value={contextValue}>
      {children}
    </CitiesContext.Provider>
  );
};

const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
};
export { CitiesProvider, useCities };
