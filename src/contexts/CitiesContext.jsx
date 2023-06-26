import { useState, useEffect, useContext, createContext } from "react";
const CitiesContext = createContext();
const CitiesProvider = ({ children }) => {
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
  const contextValue = {
    cities,
    loading,
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
