import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  interpretWeatherCode,
  getLawnInsight,
  geocodeLocation,
  fetchWeather,
  type CurrentConditions,
} from "@/lib/weather";

// ---------------------------------------------------------------------------
// interpretWeatherCode
// ---------------------------------------------------------------------------

describe("interpretWeatherCode", () => {
  it("returns Clear sky / sun for code 0 (day)", () => {
    const result = interpretWeatherCode(0, true);
    expect(result).toEqual({ label: "Clear sky", icon: "sun" });
  });

  it("returns Clear sky / moon for code 0 (night)", () => {
    const result = interpretWeatherCode(0, false);
    expect(result).toEqual({ label: "Clear sky", icon: "moon" });
  });

  it("returns Mainly clear / moon for code 1 (night)", () => {
    const result = interpretWeatherCode(1, false);
    expect(result).toEqual({ label: "Mainly clear", icon: "moon" });
  });

  it("returns Partly cloudy for code 2", () => {
    expect(interpretWeatherCode(2)).toEqual({ label: "Partly cloudy", icon: "partly-cloudy" });
  });

  it("returns Overcast for code 3", () => {
    expect(interpretWeatherCode(3)).toEqual({ label: "Overcast", icon: "cloud" });
  });

  it("returns Fog for code 45", () => {
    expect(interpretWeatherCode(45)).toEqual({ label: "Fog", icon: "fog" });
  });

  it("returns Drizzle for code 53", () => {
    expect(interpretWeatherCode(53)).toEqual({ label: "Drizzle", icon: "drizzle" });
  });

  it("returns Rain for code 61", () => {
    expect(interpretWeatherCode(61)).toEqual({ label: "Rain", icon: "rain" });
  });

  it("returns Snow for code 71", () => {
    expect(interpretWeatherCode(71)).toEqual({ label: "Snow", icon: "snow" });
  });

  it("returns Rain showers for code 80", () => {
    expect(interpretWeatherCode(80)).toEqual({ label: "Rain showers", icon: "rain" });
  });

  it("returns Thunderstorm for code 95", () => {
    expect(interpretWeatherCode(95)).toEqual({ label: "Thunderstorm", icon: "storm" });
  });

  it("returns Unknown for unrecognized code", () => {
    expect(interpretWeatherCode(999)).toEqual({ label: "Unknown", icon: "cloud" });
  });

  it("defaults isDay to true", () => {
    expect(interpretWeatherCode(0).icon).toBe("sun");
  });
});

// ---------------------------------------------------------------------------
// getLawnInsight
// ---------------------------------------------------------------------------

function makeConditions(overrides: Partial<CurrentConditions> = {}): CurrentConditions {
  return {
    temperature: 72,
    feelsLike: 72,
    humidity: 50,
    windSpeed: 5,
    precipitation: 0,
    condition: { label: "Clear sky", icon: "sun" },
    isDay: true,
    soilTemp: null,
    ...overrides,
  };
}

describe("getLawnInsight", () => {
  it("returns skip mowing when precipitation > 0.1", () => {
    const msg = getLawnInsight(makeConditions({ precipitation: 0.5 }));
    expect(msg).toMatch(/skip mowing/i);
  });

  it("returns skip mowing when condition is rain", () => {
    const msg = getLawnInsight(
      makeConditions({ condition: { label: "Rain", icon: "rain" } }),
    );
    expect(msg).toMatch(/skip mowing/i);
  });

  it("returns skip mowing when condition is storm", () => {
    const msg = getLawnInsight(
      makeConditions({ condition: { label: "Thunderstorm", icon: "storm" } }),
    );
    expect(msg).toMatch(/skip mowing/i);
  });

  it("returns frost advisory when temp <= 32", () => {
    const msg = getLawnInsight(makeConditions({ temperature: 30 }));
    expect(msg).toMatch(/frost advisory/i);
  });

  it("returns heat stress when temp >= 95", () => {
    const msg = getLawnInsight(makeConditions({ temperature: 100 }));
    expect(msg).toMatch(/heat stress/i);
  });

  it("returns skip spraying when wind >= 20", () => {
    const msg = getLawnInsight(makeConditions({ windSpeed: 25 }));
    expect(msg).toMatch(/skip spraying/i);
  });

  it("returns pre-emergent approaching for soil temp 50-54", () => {
    const msg = getLawnInsight(makeConditions({ soilTemp: 52 }));
    expect(msg).toMatch(/pre-emergent window approaching/i);
  });

  it("returns prime pre-emergent for soil temp 55-64", () => {
    const msg = getLawnInsight(makeConditions({ soilTemp: 60 }));
    expect(msg).toMatch(/prime pre-emergent/i);
  });

  it("returns actively growing for soil temp 65-69", () => {
    const msg = getLawnInsight(makeConditions({ soilTemp: 67 }));
    expect(msg).toMatch(/actively growing/i);
  });

  it("returns great weather for sunny 55-85°F", () => {
    const msg = getLawnInsight(makeConditions({ temperature: 70 }));
    expect(msg).toMatch(/great lawn care weather/i);
  });

  it("returns decent conditions as fallback", () => {
    const msg = getLawnInsight(
      makeConditions({
        temperature: 50,
        condition: { label: "Overcast", icon: "cloud" },
      }),
    );
    expect(msg).toMatch(/decent conditions/i);
  });

  it("rain takes priority over freezing", () => {
    const msg = getLawnInsight(makeConditions({ temperature: 30, precipitation: 1 }));
    expect(msg).toMatch(/skip mowing/i);
  });
});

// ---------------------------------------------------------------------------
// geocodeLocation (mocked fetch)
// ---------------------------------------------------------------------------

describe("geocodeLocation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns coordinates for a valid location", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [{ latitude: 35.22, longitude: -80.84, name: "Charlotte", admin1: "North Carolina" }],
      }),
    } as Response);

    const result = await geocodeLocation("Charlotte, NC");
    expect(result).toEqual({ latitude: 35.22, longitude: -80.84 });

    const call = vi.mocked(fetch).mock.calls[0];
    expect(call[0]).toContain("geocoding-api.open-meteo.com");
    expect(call[0]).toContain("name=Charlotte");
  });

  it("matches state when multiple results returned", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          { latitude: 35.0, longitude: -80.0, name: "Charlotte", admin1: "Virginia" },
          { latitude: 35.22, longitude: -80.84, name: "Charlotte", admin1: "North Carolina" },
        ],
      }),
    } as Response);

    const result = await geocodeLocation("Charlotte, North Carolina");
    expect(result).toEqual({ latitude: 35.22, longitude: -80.84 });
  });

  it("returns null when no results", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);

    expect(await geocodeLocation("Xyzzyville")).toBeNull();
  });

  it("returns null when response is not ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    expect(await geocodeLocation("Charlotte")).toBeNull();
  });

  it("returns null for empty string", async () => {
    expect(await geocodeLocation("")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// fetchWeather (mocked fetch)
// ---------------------------------------------------------------------------

describe("fetchWeather", () => {
  const mockOpenMeteoResponse = {
    current: {
      time: "2025-06-01T12:00",
      temperature_2m: 78.3,
      apparent_temperature: 80.1,
      relative_humidity_2m: 55.2,
      weather_code: 0,
      wind_speed_10m: 8.4,
      precipitation: 0,
      is_day: 1,
      soil_temperature_6cm: 62.5,
    },
    daily: {
      time: ["2025-06-01", "2025-06-02"],
      weather_code: [0, 61],
      temperature_2m_max: [82.4, 75.1],
      temperature_2m_min: [65.2, 60.8],
      precipitation_sum: [0, 0.45],
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and parses weather with coordinates", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockOpenMeteoResponse,
    } as Response);

    const result = await fetchWeather({ latitude: 35.22, longitude: -80.84 });

    expect(result.current.temperature).toBe(78);
    expect(result.current.feelsLike).toBe(80);
    expect(result.current.humidity).toBe(55);
    expect(result.current.windSpeed).toBe(8);
    expect(result.current.precipitation).toBe(0);
    expect(result.current.condition.label).toBe("Clear sky");
    expect(result.current.isDay).toBe(true);
    expect(result.current.soilTemp).toBe(63);

    expect(result.daily).toHaveLength(2);
    expect(result.daily[0].tempHigh).toBe(82);
    expect(result.daily[0].condition.icon).toBe("sun");
    expect(result.daily[1].condition.label).toBe("Rain");
    expect(result.daily[1].precipitationSum).toBe(0.45);

    const url = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(url).toContain("api.open-meteo.com");
    expect(url).toContain("latitude=35.22");
    expect(url).toContain("temperature_unit=fahrenheit");
  });

  it("geocodes when only location is provided", async () => {
    // First call: geocode, second call: weather
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ latitude: 35.22, longitude: -80.84, name: "Charlotte" }],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOpenMeteoResponse,
      } as Response);

    const result = await fetchWeather({ location: "Charlotte, NC" });
    expect(result.current.temperature).toBe(78);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("throws when no location provided", async () => {
    await expect(fetchWeather({})).rejects.toThrow("No location provided");
  });

  it("throws when geocode fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);

    await expect(fetchWeather({ location: "Xyzzyville" })).rejects.toThrow(/could not geocode/i);
  });

  it("throws on API error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 503,
    } as Response);

    await expect(fetchWeather({ latitude: 35, longitude: -80 })).rejects.toThrow(/api error/i);
  });

  it("handles null soil temperature", async () => {
    const noSoil = {
      ...mockOpenMeteoResponse,
      current: { ...mockOpenMeteoResponse.current, soil_temperature_6cm: undefined },
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => noSoil,
    } as Response);

    const result = await fetchWeather({ latitude: 35, longitude: -80 });
    expect(result.current.soilTemp).toBeNull();
  });
});
