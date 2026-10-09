import { GeoLocation, WeatherData, AirQualityData, WeatherAlert } from '../types/weather';

export const POPULAR_CITIES: GeoLocation[] = [
  { id: 1176615, name: 'Islamabad', country: 'Pakistan', country_code: 'PK', admin1: 'Islamabad', latitude: 33.7215, longitude: 73.0433, timezone: 'Asia/Karachi' },
  { id: 1174872, name: 'Karachi', country: 'Pakistan', country_code: 'PK', admin1: 'Sindh', latitude: 24.8607, longitude: 67.0011, timezone: 'Asia/Karachi' },
  { id: 1172451, name: 'Lahore', country: 'Pakistan', country_code: 'PK', admin1: 'Punjab', latitude: 31.5546, longitude: 74.3572, timezone: 'Asia/Karachi' },
  { id: 2643743, name: 'London', country: 'United Kingdom', country_code: 'GB', admin1: 'England', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { id: 5128581, name: 'New York', country: 'United States', country_code: 'US', admin1: 'New York', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { id: 292223, name: 'Dubai', country: 'United Arab Emirates', country_code: 'AE', admin1: 'Dubai', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { id: 1850147, name: 'Tokyo', country: 'Japan', country_code: 'JP', admin1: 'Tokyo', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
  { id: 2988507, name: 'Paris', country: 'France', country_code: 'FR', admin1: 'Île-de-France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { id: 1273294, name: 'Delhi', country: 'India', country_code: 'IN', admin1: 'Delhi', latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
  { id: 2147714, name: 'Sydney', country: 'Australia', country_code: 'AU', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
];

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((item: any) => ({
      id: item.id || Math.floor(Math.random() * 1000000),
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      country: item.country || '',
      country_code: item.country_code || '',
      admin1: item.admin1 || '',
      timezone: item.timezone || 'auto',
    }));
  } catch (err) {
    console.error('Error searching locations:', err);
    return [];
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoLocation> {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    if (res.ok) {
      const data = await res.json();
      return {
        id: Math.floor(Math.random() * 1000000),
        name: data.locality || data.city || data.principalSubdivision || 'Current Location',
        latitude,
        longitude,
        country: data.countryName || '',
        country_code: data.countryCode || '',
        admin1: data.principalSubdivision || '',
      };
    }
  } catch (e) {
    console.warn('Reverse geocode fallback', e);
  }

  return {
    id: 999999,
    name: 'Current Location',
    latitude,
    longitude,
    country: '',
    country_code: '',
  };
}

export async function fetchWeatherData(location: GeoLocation): Promise<WeatherData> {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,visibility,wind_speed_10m,wind_direction_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`;

  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.latitude}&longitude=${location.longitude}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth,dust,uv_index&timezone=auto`;

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(aqiUrl).catch(() => null),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Weather API error (${weatherRes.status})`);
  }

  const wData = await weatherRes.json();
  let airQuality: AirQualityData | undefined;

  if (aqiRes && aqiRes.ok) {
    try {
      const aData = await aqiRes.json();
      if (aData.current) {
        airQuality = {
          time: aData.current.time,
          usAqi: Math.round(aData.current.us_aqi || 35),
          europeanAqi: Math.round(aData.current.european_aqi || 25),
          pm2_5: Math.round((aData.current.pm2_5 || 12) * 10) / 10,
          pm10: Math.round((aData.current.pm10 || 22) * 10) / 10,
          carbonMonoxide: Math.round((aData.current.carbon_monoxide || 250) * 10) / 10,
          nitrogenDioxide: Math.round((aData.current.nitrogen_dioxide || 15) * 10) / 10,
          sulphurDioxide: Math.round((aData.current.sulphur_dioxide || 5) * 10) / 10,
          ozone: Math.round((aData.current.ozone || 45) * 10) / 10,
          dust: Math.round((aData.current.dust || 0) * 10) / 10,
          aerosolOpticalDepth: Math.round((aData.current.aerosol_optical_depth || 0.1) * 100) / 100,
          uvIndex: Math.round(aData.current.uv_index || 0),
        };
      }
    } catch (err) {
      console.warn('AQI parse warning', err);
    }
  }

  // Parse Hourly (take next 24 hours from current time index)
  const hourlyTimes: string[] = wData.hourly?.time || [];
  const currentTimeStr = wData.current?.time;
  let startIndex = 0;
  if (currentTimeStr && hourlyTimes.length > 0) {
    const foundIdx = hourlyTimes.findIndex((t) => t >= currentTimeStr);
    if (foundIdx !== -1) startIndex = foundIdx;
  }
  const hourlyCount = Math.min(24, hourlyTimes.length - startIndex);

  const hourly = Array.from({ length: hourlyCount }).map((_, i) => {
    const idx = startIndex + i;
    return {
      time: hourlyTimes[idx],
      temperature: wData.hourly.temperature_2m[idx],
      feelsLike: wData.hourly.apparent_temperature[idx],
      humidity: wData.hourly.relative_humidity_2m[idx],
      dewPoint: wData.hourly.dew_point_2m ? wData.hourly.dew_point_2m[idx] : wData.hourly.temperature_2m[idx] - 3,
      precipitationProbability: wData.hourly.precipitation_probability ? wData.hourly.precipitation_probability[idx] : 0,
      precipitation: wData.hourly.precipitation ? wData.hourly.precipitation[idx] : 0,
      weatherCode: wData.hourly.weather_code[idx],
      surfacePressure: wData.hourly.surface_pressure ? wData.hourly.surface_pressure[idx] : 1013,
      visibility: wData.hourly.visibility ? wData.hourly.visibility[idx] : 10000,
      windSpeed: wData.hourly.wind_speed_10m[idx],
      windDirection: wData.hourly.wind_direction_10m[idx],
      uvIndex: wData.hourly.uv_index ? wData.hourly.uv_index[idx] : 0,
      isDay: wData.hourly.is_day ? Boolean(wData.hourly.is_day[idx]) : true,
    };
  });

  // Parse Daily (7-10 days)
  const dailyTimes: string[] = wData.daily?.time || [];
  const daily = dailyTimes.map((date, idx) => ({
    date,
    weatherCode: wData.daily.weather_code[idx],
    tempMax: wData.daily.temperature_2m_max[idx],
    tempMin: wData.daily.temperature_2m_min[idx],
    apparentTempMax: wData.daily.apparent_temperature_max[idx],
    apparentTempMin: wData.daily.apparent_temperature_min[idx],
    sunrise: wData.daily.sunrise ? wData.daily.sunrise[idx] : '',
    sunset: wData.daily.sunset ? wData.daily.sunset[idx] : '',
    daylightDuration: wData.daily.daylight_duration ? wData.daily.daylight_duration[idx] : 43200,
    sunshineDuration: wData.daily.sunshine_duration ? wData.daily.sunshine_duration[idx] : 36000,
    uvIndexMax: wData.daily.uv_index_max ? wData.daily.uv_index_max[idx] : 5,
    precipitationSum: wData.daily.precipitation_sum ? wData.daily.precipitation_sum[idx] : 0,
    precipitationProbabilityMax: wData.daily.precipitation_probability_max ? wData.daily.precipitation_probability_max[idx] : 0,
    windSpeedMax: wData.daily.wind_speed_10m_max ? wData.daily.wind_speed_10m_max[idx] : 15,
    windDirectionDominant: wData.daily.wind_direction_10m_dominant ? wData.daily.wind_direction_10m_dominant[idx] : 0,
  }));

  const current = {
    time: wData.current.time,
    temperature: wData.current.temperature_2m,
    feelsLike: wData.current.apparent_temperature,
    humidity: wData.current.relative_humidity_2m,
    weatherCode: wData.current.weather_code,
    isDay: Boolean(wData.current.is_day),
    precipitation: wData.current.precipitation,
    rain: wData.current.rain,
    showers: wData.current.showers,
    snowfall: wData.current.snowfall,
    cloudCover: wData.current.cloud_cover,
    pressure: wData.current.pressure_msl || wData.current.surface_pressure || 1013,
    surfacePressure: wData.current.surface_pressure || 1013,
    windSpeed: wData.current.wind_speed_10m,
    windDirection: wData.current.wind_direction_10m,
    windGusts: wData.current.wind_gusts_10m || wData.current.wind_speed_10m * 1.3,
    uvIndex: wData.current.uv_index !== undefined ? wData.current.uv_index : (hourly[0]?.uvIndex || 0),
  };

  return {
    location,
    current,
    hourly,
    daily,
    airQuality,
    lastUpdated: new Date().toISOString(),
  };
}

// Generate smart weather alerts based on real conditions
export function generateWeatherAlerts(data: WeatherData): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const current = data.current;
  const aqi = data.airQuality?.usAqi;

  // Severe Thunderstorm
  if ([95, 96, 99].includes(current.weatherCode)) {
    alerts.push({
      id: 'alert-thunderstorm',
      severity: 'warning',
      title: 'Thunderstorm Warning',
      titleUrdu: 'گرج چمک اور طوفان کا الرٹ',
      description: 'Severe convective storm detected in your area with possible lightning and heavy downpours.',
      descriptionUrdu: 'آپ کے علاقے میں تیز آندھی، گرج چمک اور موسلادھار بارش کا امکان ہے۔',
      instruction: 'Stay indoors, keep away from open windows and metallic structures.',
    });
  }

  // Extreme Wind Warning
  if (current.windSpeed > 45 || current.windGusts > 60) {
    alerts.push({
      id: 'alert-wind',
      severity: 'warning',
      title: 'High Wind Advisory',
      titleUrdu: 'تیز ہواؤں کی وارننگ',
      description: `Sustained winds up to ${Math.round(current.windSpeed)} km/h with gusts exceeding ${Math.round(current.windGusts)} km/h.`,
      descriptionUrdu: `تیز ہوائیں چل رہی ہیں جن کی رفتار ${Math.round(current.windSpeed)} کلومیٹر فی گھنٹہ تک ہے۔`,
      instruction: 'Secure outdoor loose objects and drive with heightened vigilance.',
    });
  }

  // Extreme Heat Warning
  if (current.temperature >= 40) {
    alerts.push({
      id: 'alert-heat',
      severity: 'warning',
      title: 'Extreme Heat Warning',
      titleUrdu: 'شدید گرمی کی لہر (ہیٹ ویو)',
      description: `Blistering heat of ${Math.round(current.temperature)}°C (feels like ${Math.round(current.feelsLike)}°C).`,
      descriptionUrdu: `شدید گرمی کی لہر۔ درجہ حرارت ${Math.round(current.temperature)} سینٹی گریڈ تک پہنچ گیا ہے۔`,
      instruction: 'Drink abundant fluids, avoid direct sunlight between 11 AM and 4 PM, wear lightweight cotton clothing.',
    });
  } else if (current.temperature <= 0) {
    alerts.push({
      id: 'alert-freeze',
      severity: 'advisory',
      title: 'Freeze & Frost Advisory',
      titleUrdu: 'شدید سردی اور کہرا الرٹ',
      description: `Sub-zero temperatures (${Math.round(current.temperature)}°C). Risk of slippery roads and frost.`,
      descriptionUrdu: `منجمد کر دینے والی سردی۔ درجہ حرارت نقطہ انجماد سے نیچے ہے۔`,
      instruction: 'Bundle up in warm insulated layers, protect outdoor water pipes.',
    });
  }

  // Dangerous Air Quality
  if (aqi && aqi > 150) {
    alerts.push({
      id: 'alert-aqi',
      severity: aqi > 200 ? 'warning' : 'advisory',
      title: 'Unhealthy Air Quality Alert',
      titleUrdu: 'آلودہ ہوا اور اسموگ کا انتباہ',
      description: `Air Quality Index is ${aqi} (Unhealthy). High concentration of particulate matter (PM2.5).`,
      descriptionUrdu: `ہوا کا معیار مضر صحت ہے (AQI: ${aqi})۔ فضائی آلودگی زیادہ ہے۔`,
      instruction: 'Wear an N95 protective mask outdoors and run indoor air purifiers.',
    });
  }

  // High UV warning
  if (current.uvIndex >= 8) {
    alerts.push({
      id: 'alert-uv',
      severity: 'watch',
      title: 'Very High UV Radiation',
      titleUrdu: 'سورج کی بالائے بنفشی شعاعیں (High UV)',
      description: `UV Index is ${Math.round(current.uvIndex)}. Unprotected skin can suffer burns in less than 20 minutes.`,
      descriptionUrdu: `دھوپ میں خطرناک یو وی شعاعیں موجود ہیں۔ جلد کو محفوظ رکھیں۔`,
      instruction: 'Wear sunglasses, wide-brimmed hats, and broad-spectrum sunscreen.',
    });
  }

  return alerts;
}
