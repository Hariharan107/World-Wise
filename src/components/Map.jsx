import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
const Map = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("form");
  };
  return (
    <div className={styles.mapContainer} onClick={handleNavigate}>
      Map
    </div>
  );
};

export default Map;
