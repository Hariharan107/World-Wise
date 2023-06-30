import { useEffect, useContext, createContext, useReducer } from "react";
const CitiesContext = createContext();
const initialState = {
  cities: [],
  loading: false,
  currentCity: {},
  error: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING": {
      return {
        ...state,
        loading: true,
      };
    }
    case "cities/loaded": {
      return {
        ...state,
        loading: false,
        cities: action.payload,
      };
    }
    case "city/loaded": {
      return { ...state, loading: false, currentCity: action.payload };
    }
    case "city/created": {
      return {
        ...state,
        loading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    }
    case "city/deleted": {
      return {
        ...state,
        loading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    }
    case "rejected": {
      return { ...state, loading: false, error: action.payload };
    }
    default:
      return state;
  }
};
const CitiesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, loading, currentCity, error } = state;
  useEffect(() => {
    const FetchCities = async () => {
      dispatch({ type: "SET_LOADING" });
      try {
        const response = await fetch("http://localhost:3001/cities");
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({ type: "rejected", payload: err });
      }
    };
    FetchCities();
  }, []);
  const getCity = async (id) => {
    if (+id === currentCity.id) return;
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await fetch(`http://localhost:3001/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (err) {
      dispatch({ type: "rejected", payload: err });
    }
  };
  const addNewCity = async (newCity) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await fetch("http://localhost:3001/cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({ type: "rejected", payload: err });
    }
  };
  const deleteCity = async (id) => {
    dispatch({ type: "SET_LOADING" });
    try {
      await fetch(`http://localhost:3001/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({ type: "rejected", payload: err });
    }
  };
  const contextValue = {
    cities,
    loading,
    currentCity,
    addNewCity,
    getCity,
    error,
    deleteCity,
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
