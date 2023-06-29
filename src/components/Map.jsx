import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "../hooks/useGeoLocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
const Map = () => {
  const [position, setPosition] = useState([40, 0]);
  const { cities } = useCities();
  const [latitude, longitude] = useUrlPosition();
  const {
    isLoading: PositionLoading,
    position: myPosition,
    getPosition,
  } = useGeolocation();
  useEffect(() => {
    if (myPosition) {
      setPosition([myPosition.lat, myPosition.lng]);
    }
  }, [myPosition]);
  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <div className={styles.mapContainer}>
      {!myPosition && (
        <Button type='position' onClick={getPosition}>
          {PositionLoading ? "Loading..." : "Get my location"}
        </Button>
      )}
      <MapContainer
        center={position}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              {city.emoji} {city.cityName}
            </Popup>
          </Marker>
        ))}
        <ChangePosition position={position} />
        <DetectClick />
      </MapContainer>
    </div>
  );
};
const ChangePosition = ({ position }) => {
  useMap().setView(position, 6);
  return null; // No JSX to render
};
const DetectClick = () => {
  const navigate = useNavigate();
  useMapEvents({
    click: ({ latlng: { lat, lng } }) => {
      navigate(`form?lat=${lat}&lng=${lng}`);
    },
  });
};
export default Map;
