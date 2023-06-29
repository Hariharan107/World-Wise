import React, { useReducer, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useCities } from "../contexts/CitiesContext";
import "react-datepicker/dist/react-datepicker.css";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const initialState = {
  isLoadingGeoCoding: false,
  error: null,
  cityName: "",
  countryName: "",
  date: new Date(),
  notes: "",
  emoji: "",
};

function formReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoadingGeoCoding: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_CITY_NAME":
      return {
        ...state,
        cityName: action.payload,
      };
    case "SET_COUNTRY_NAME":
      return {
        ...state,
        countryName: action.payload,
      };
    case "SET_DATE":
      return {
        ...state,
        date: action.payload,
      };
    case "SET_NOTES":
      return {
        ...state,
        notes: action.payload,
      };
    case "SET_EMOJI":
      return {
        ...state,
        emoji: action.payload,
      };
    default:
      return state;
  }
}

function Form() {
  const [latitude, longitude] = useUrlPosition();
  const { addNewCity, loading } = useCities();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(formReducer, initialState);
  const {
    isLoadingGeoCoding,
    error,
    cityName,
    countryName,
    date,
    notes,
    emoji,
  } = state;

  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchGeoLocation = async () => {
      try {
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_LOADING", payload: true });
        const res = await fetch(
          `${BASE_URL}?latitude=${latitude}&longitude=${longitude}`
        );
        const { city, locality, countryName, countryCode } = await res.json();

        if (!countryCode) {
          throw new Error("That doesn't look like a valid location");
        }
        dispatch({ type: "SET_CITY_NAME", payload: city || locality });
        dispatch({ type: "SET_COUNTRY_NAME", payload: countryName });
        dispatch({ type: "SET_EMOJI", payload: convertToEmoji(countryCode) });
      } catch (err) {
        dispatch({ type: "SET_ERROR", payload: err.message });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchGeoLocation();
  }, [latitude, longitude]);

  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      countryName,
      emoji,
      date,
      notes,
      position: {
        lat: latitude,
        lng: longitude,
      },
    };
    await addNewCity(newCity);
    navigate("/app/cities");
  };

  if (isLoadingGeoCoding) return <Spinner />;
  if (!latitude || !longitude)
    return (
      <Message message='Please select a location by clicking on the map' />
    );
  if (error) return <Message message={error} />;

  return (
    <form
      className={`${styles.form} ${loading ? styles.loading : ""}`}
      onSubmit={handleAddCity}
    >
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={(e) =>
            dispatch({ type: "SET_CITY_NAME", payload: e.target.value })
          }
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        <DatePicker
          onChange={(date) => dispatch({ type: "SET_DATE", payload: date })}
          selected={date}
          id='date'
          dateFormat='dd/MM/yyyy'
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={(e) =>
            dispatch({ type: "SET_NOTES", payload: e.target.value })
          }
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
