import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
const CityItem = ({ cityName, emoji, date, position: { lat, lng }, id }) => {
  const { currentCity, deleteCity } = useCities();

  const handleDeleteCity = (e) => {
    e.preventDefault();
    deleteCity(id);
    console.log("cId:" + currentCity.id);
    console.log("id:" + id);
  };

  return (
    <div>
      <li>
        <Link
          className={`${styles.cityItem} ${
            currentCity.id === id ? styles["cityItem--active"] : ""
          }`}
          to={`${id}?lat=${lat}&lng=${lng}`}
        >
          <span className={styles.emoji}>{emoji}</span>
          <h3 className={styles.name}>{cityName}</h3>
          <time>{formatDate(date)}</time>
          <button className={styles.deleteBtn} onClick={handleDeleteCity}>
            {" "}
            &times;
          </button>
        </Link>
      </li>
    </div>
  );
};

export default CityItem;
