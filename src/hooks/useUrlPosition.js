import { useSearchParams } from "react-router-dom";

export const useUrlPosition = () => {
  const [searchParams] = useSearchParams();
  const latitude = searchParams.get("lat");
  const longitude = searchParams.get("lng");
  return [latitude, longitude];
};
