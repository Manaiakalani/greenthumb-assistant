import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/context/ProfileContext";
import { fetchWeather, type WeatherData } from "@/lib/weather";

export function useWeather() {
  const { profile } = useProfile();
  const hasLocation = !!(profile.latitude != null || profile.location);

  const query = useQuery<WeatherData>({
    queryKey: ["weather", profile.latitude, profile.longitude, profile.location],
    queryFn: () =>
      fetchWeather({
        latitude: profile.latitude,
        longitude: profile.longitude,
        location: profile.location,
      }),
    enabled: hasLocation,
    staleTime: 15 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
    retry: 2,
  });

  return { ...query, hasLocation };
}
