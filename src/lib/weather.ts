// ---------------------------------------------------------------------------
// Open-Meteo Weather Service
// Free API — no key required — https://open-meteo.com/en/docs
// ---------------------------------------------------------------------------

/** Icon key used to map weather conditions to lucide-react icons in the UI */
export type WeatherIcon =
  | "sun"
  | "moon"
  | "partly-cloudy"
  | "cloud"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

export interface WeatherCondition {
  label: string;
  icon: WeatherIcon;
}

export interface CurrentConditions {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: WeatherCondition;
  isDay: boolean;
  soilTemp: number | null;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  tempHigh: number;
  tempLow: number;
  condition: WeatherCondition;
  precipitationSum: number;
}

export interface WeatherData {
  current: CurrentConditions;
  daily: DailyForecast[];
}

// ---------------------------------------------------------------------------
// WMO Weather Code → human-readable condition
// ---------------------------------------------------------------------------

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function interpretWeatherCode(
  code: number,
  isDay = true,
): WeatherCondition {
  if (code === 0) return { label: "Clear sky", icon: isDay ? "sun" : "moon" };
  if (code === 1) return { label: "Mainly clear", icon: isDay ? "sun" : "moon" };
  if (code === 2) return { label: "Partly cloudy", icon: "partly-cloudy" };
  if (code === 3) return { label: "Overcast", icon: "cloud" };
  if (code === 45 || code === 48) return { label: "Fog", icon: "fog" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", icon: "drizzle" };
  if (code >= 61 && code <= 67) return { label: "Rain", icon: "rain" };
  if (code >= 71 && code <= 77) return { label: "Snow", icon: "snow" };
  if (code >= 80 && code <= 82) return { label: "Rain showers", icon: "rain" };
  if (code >= 85 && code <= 86) return { label: "Snow showers", icon: "snow" };
  if (code >= 95 && code <= 99) return { label: "Thunderstorm", icon: "storm" };
  return { label: "Unknown", icon: "cloud" };
}

// ---------------------------------------------------------------------------
// Open-Meteo Geocoding
// ---------------------------------------------------------------------------

interface GeocodingHit {
  latitude: number;
  longitude: number;
  name: string;
  admin1?: string;
}

/**
 * Geocode a location string (e.g. "Charlotte, NC") via Open-Meteo's
 * free geocoding API. Returns the top result's coordinates.
 */
export async function geocodeLocation(
  location: string,
): Promise<{ latitude: number; longitude: number } | null> {
  // Use just the city part for better geocoding results
  const city = location.split(",")[0].trim();
  if (!city) return null;

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=3&language=en&format=json`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8_000) });
  if (!res.ok) return null;

  const data = (await res.json()) as { results?: GeocodingHit[] };
  if (!data.results?.length) return null;

  // If the user typed a state, try to match it
  const statePart = location.split(",")[1]?.trim().toLowerCase();
  const match =
    (statePart &&
      data.results.find((r) =>
        r.admin1?.toLowerCase().startsWith(statePart),
      )) ||
    data.results[0];

  return { latitude: match.latitude, longitude: match.longitude };
}

// ---------------------------------------------------------------------------
// Forecast Fetch
// ---------------------------------------------------------------------------

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    precipitation: number;
    is_day: number;
    soil_temperature_6cm?: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

/**
 * Fetch current conditions + 5-day forecast from Open-Meteo.
 * Accepts explicit coordinates or a location string (geocoded automatically).
 */
export async function fetchWeather(options: {
  latitude?: number;
  longitude?: number;
  location?: string;
}): Promise<WeatherData> {
  let lat = options.latitude;
  let lng = options.longitude;

  // Geocode if we don't have coordinates
  if (lat == null || lng == null) {
    if (!options.location) throw new Error("No location provided");
    const geo = await geocodeLocation(options.location);
    if (!geo) throw new Error(`Could not geocode "${options.location}"`);
    lat = geo.latitude;
    lng = geo.longitude;
  }

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "weather_code",
      "wind_speed_10m",
      "precipitation",
      "is_day",
      "soil_temperature_6cm",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
    ].join(","),
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    precipitation_unit: "inch",
    timezone: "auto",
    forecast_days: "5",
  });

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`,
    { signal: AbortSignal.timeout(10_000) },
  );
  if (!res.ok) throw new Error(`Open-Meteo API error: ${res.status}`);

  const data = (await res.json()) as OpenMeteoResponse;
  const isDay = data.current.is_day === 1;

  const current: CurrentConditions = {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: Math.round(data.current.relative_humidity_2m),
    windSpeed: Math.round(data.current.wind_speed_10m),
    precipitation: data.current.precipitation,
    condition: interpretWeatherCode(data.current.weather_code, isDay),
    isDay,
    soilTemp:
      data.current.soil_temperature_6cm != null
        ? Math.round(data.current.soil_temperature_6cm)
        : null,
  };

  const daily: DailyForecast[] = data.daily.time.map((dateStr, i) => {
    const date = new Date(dateStr + "T12:00:00");
    return {
      date: dateStr,
      dayName: DAY_SHORT[date.getDay()],
      tempHigh: Math.round(data.daily.temperature_2m_max[i]),
      tempLow: Math.round(data.daily.temperature_2m_min[i]),
      condition: interpretWeatherCode(data.daily.weather_code[i], true),
      precipitationSum: data.daily.precipitation_sum[i],
    };
  });

  return { current, daily };
}

// ---------------------------------------------------------------------------
// Lawn-specific weather insight
// ---------------------------------------------------------------------------

export function getLawnInsight(current: CurrentConditions): string {
  const { temperature, precipitation, windSpeed, soilTemp, condition } =
    current;

  // Rain / active precipitation
  if (precipitation > 0.1 || condition.icon === "rain" || condition.icon === "storm") {
    return "Skip mowing today — wet grass clumps and promotes disease.";
  }

  // Freezing
  if (temperature <= 32) {
    return "Frost advisory — avoid walking on frozen grass to prevent blade damage.";
  }

  // Extreme heat
  if (temperature >= 95) {
    return "Heat stress likely — water deeply in the early morning if needed.";
  }

  // High wind
  if (windSpeed >= 20) {
    return "Windy conditions — skip spraying any herbicides or fertilizers today.";
  }

  // Soil temp insight
  if (soilTemp !== null) {
    if (soilTemp >= 50 && soilTemp < 55) {
      return `Soil temp ${soilTemp}°F — pre-emergent window approaching. Get ready!`;
    }
    if (soilTemp >= 55 && soilTemp < 65) {
      return `Soil temp ${soilTemp}°F — prime pre-emergent window. Apply now if you haven't.`;
    }
    if (soilTemp >= 65 && soilTemp < 70) {
      return `Soil temp ${soilTemp}°F — grass actively growing. Great mowing conditions!`;
    }
  }

  // Good conditions
  if (temperature >= 55 && temperature <= 85 && condition.icon === "sun") {
    return "Great lawn care weather — ideal for mowing or outdoor projects.";
  }

  return "Decent conditions for lawn care today.";
}
