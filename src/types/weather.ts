export type UnitSystem = 'metric' | 'imperial';
export type Language = 'en' | 'ur_roman' | 'ur';

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country: string;
  country_code: string;
  admin1?: string; // State / Province
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  weatherCode: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  cloudCover: number;
  pressure: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  dewPoint: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  surfacePressure: number;
  visibility: number; // in meters or miles
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  daylightDuration: number; // seconds
  sunshineDuration: number;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windDirectionDominant: number;
}

export interface AirQualityData {
  time: string;
  usAqi: number;
  europeanAqi: number;
  pm2_5: number; // µg/m³
  pm10: number; // µg/m³
  carbonMonoxide: number; // µg/m³
  nitrogenDioxide: number; // µg/m³
  sulphurDioxide: number; // µg/m³
  ozone: number; // µg/m³
  dust: number;
  aerosolOpticalDepth: number;
  uvIndex: number;
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQualityData;
  lastUpdated: string;
}

export interface WeatherAlert {
  id: string;
  severity: 'warning' | 'advisory' | 'watch';
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  instruction: string;
}
