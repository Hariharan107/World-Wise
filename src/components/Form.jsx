import { useState, useEffect } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";
import { useUrlPosition } from "../hooks/useUrlPosition";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [latitude, longitude] = useUrlPosition();
  const [isLoadingGeoCoding, setisLoadingGeoCoding] = useState(false);
  const [error, setError] = useState(null);
  const [cityName, setCityName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
  useEffect(() => {
    const fetchGeoLocation = async () => {
      try {
        setError(null);
        setisLoadingGeoCoding(true);
        const res = await fetch(
          `${BASE_URL}?latitude=${latitude}&longitude=${longitude}`
        );
        const { city, locality, countryName, countryCode } = await res.json();

        if (!countryCode)
          throw new Error("That doesn't look like a valid location");
        setCityName(city || locality);
        setCountryName(countryName);
        setEmoji(convertToEmoji(countryCode));
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setisLoadingGeoCoding(false);
      }
    };
    fetchGeoLocation();
  }, [latitude, longitude]);
  if (isLoadingGeoCoding) return <Spinner />;
  if (error) return <Message message={error} />;
  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        <input
          id='date'
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={(e) => setNotes(e.target.value)}
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
