import CityItems from "./CityItem";
import Spinner from "./Spinner";
import Message from "./Message";
import styles from "./CityList.module.css";
import { useCities } from "../contexts/CitiesContext";
const CityList = () => {
  const { cities, loading } = useCities()
  if (loading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message='Add your first city by clicking on a city on the map' />
    );
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItems key={city.id} {...city} />
      ))}
    </ul>
  );
};

export default CityList;
