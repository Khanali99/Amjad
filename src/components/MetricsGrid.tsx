import React from 'react';
import {
  Wind,
  Droplets,
  Sun,
  Compass,
  Gauge,
  Eye,
  Cloud,
  Sunrise,
  Sunset,
  ArrowUpRight,
} from 'lucide-react';
import { CurrentWeather, DailyForecastItem, UnitSystem, Language } from '../types/weather';
import {
  convertWindSpeed,
  convertPressure,
  convertTemp,
  degreesToCardinal,
  getUVLevel,
} from '../utils/weatherCodes';

interface MetricsGridProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  unit: UnitSystem;
  language: Language;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  current,
  todayDaily,
  unit,
  language,
}) => {
  const windInfo = convertWindSpeed(current.windSpeed, unit);
  const gustInfo = convertWindSpeed(current.windGusts, unit);
  const pressureInfo = convertPressure(current.pressure, unit);
  const uvInfo = getUVLevel(current.uvIndex);

  // Visibility conversion (meters to km or miles)
  const visibilityKm = 10; // Open-Meteo visibility baseline 10km if clear
  const visibilityStr =
    unit === 'imperial'
      ? `${(visibilityKm * 0.621371).toFixed(1)} mi`
      : `${visibilityKm} km`;

  // Sunrise and Sunset calculation
  const sunriseStr = todayDaily?.sunrise
    ? new Date(todayDaily.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '06:00 AM';
  const sunsetStr = todayDaily?.sunset
    ? new Date(todayDaily.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '06:30 PM';

  // Calculate day progress percentage
  let dayProgressPercent = 50;
  if (todayDaily?.sunrise && todayDaily?.sunset) {
    const sr = new Date(todayDaily.sunrise).getTime();
    const ss = new Date(todayDaily.sunset).getTime();
    const now = Date.now();
    if (now <= sr) dayProgressPercent = 0;
    else if (now >= ss) dayProgressPercent = 100;
    else dayProgressPercent = Math.round(((now - sr) / (ss - sr)) * 100);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Wind & Compass Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-sky-400" />
            <span className="font-medium text-slate-300">
              {language === 'ur' ? 'ہوا اور سمت' : 'Wind & Direction'}
            </span>
          </div>
          <span>{degreesToCardinal(current.windDirection)}</span>
        </div>

        <div className="flex items-center justify-between my-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-white">
                {windInfo.value}
              </span>
              <span className="text-sm text-slate-400">{windInfo.unitLabel}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Gusts up to {gustInfo.value} {gustInfo.unitLabel}
            </div>
          </div>

          {/* Compass Dial */}
          <div className="relative w-16 h-16 rounded-full border border-white/15 flex items-center justify-center bg-white/[0.02]">
            <span className="absolute top-1 text-[9px] font-mono text-slate-500">N</span>
            <span className="absolute bottom-1 text-[9px] font-mono text-slate-500">S</span>
            <span className="absolute left-1 text-[9px] font-mono text-slate-500">W</span>
            <span className="absolute right-1 text-[9px] font-mono text-slate-500">E</span>
            <div
              className="w-8 h-0.5 bg-gradient-to-r from-sky-400 to-rose-400 rounded-full transition-transform duration-700"
              style={{
                transform: `rotate(${current.windDirection - 90}deg)`,
              }}
            />
            <div className="w-2 h-2 rounded-full bg-white shadow-sm absolute" />
          </div>
        </div>

        <div className="text-xs text-slate-400 border-t border-white/5 pt-2 mt-2">
          Direction: {current.windDirection}° ({degreesToCardinal(current.windDirection)})
        </div>
      </div>

      {/* UV Index Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="font-medium text-slate-300">
              {language === 'ur' ? 'یو وی انڈیکس' : 'UV Radiation'}
            </span>
          </div>
          <span className={`font-medium ${uvInfo.textColor}`}>
            {language === 'ur' ? uvInfo.levelUrdu : uvInfo.level}
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">
              {Math.round(current.uvIndex)}
            </span>
            <span className="text-xs text-slate-400">/ 11+ max</span>
          </div>

          {/* UV Spectrum gradient bar */}
          <div className="w-full h-2 bg-white/10 rounded-full mt-3 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-purple-600 rounded-full"
              style={{ width: `${Math.min(100, (current.uvIndex / 11) * 100)}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-slate-400 border-t border-white/5 pt-2 mt-2 truncate" title={uvInfo.advice}>
          {uvInfo.advice}
        </div>
      </div>

      {/* Humidity & Dew Point */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span className="font-medium text-slate-300">
              {language === 'ur' ? 'نمی' : 'Humidity'}
            </span>
          </div>
          <span>
            {current.humidity > 70 ? 'High' : current.humidity < 30 ? 'Dry' : 'Comfortable'}
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-white">
              {current.humidity}%
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full"
              style={{ width: `${current.humidity}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-slate-400 border-t border-white/5 pt-2 mt-2">
          Dew point is approximately {convertTemp(current.temperature - ((100 - current.humidity) / 5), unit)}°
        </div>
      </div>

      {/* Atmospheric Pressure */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-sky-400" />
            <span className="font-medium text-slate-300">
              {language === 'ur' ? 'ہوا کا دباؤ' : 'Pressure'}
            </span>
          </div>
          <span className="text-emerald-400 font-medium">Standard</span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-white">
              {pressureInfo.value}
            </span>
            <span className="text-sm text-slate-400">{pressureInfo.unitLabel}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Surface level: {Math.round(current.surfacePressure)} hPa
          </div>
        </div>

        <div className="text-xs text-slate-400 border-t border-white/5 pt-2 mt-2">
          Barometric trend: Steady atmospheric stability
        </div>
      </div>

      {/* Visibility & Cloud Cover */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-sky-400" />
            <span className="font-medium text-slate-300">
              {language === 'ur' ? 'حد نگاہ اور بادل' : 'Visibility & Clouds'}
            </span>
          </div>
          <span>Cloud {current.cloudCover}%</span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-white">
              {visibilityStr}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {current.cloudCover > 80
              ? 'Dense overcast skies'
              : current.cloudCover > 40
              ? 'Partly scattered cloudiness'
              : 'Clear horizontal range'}
          </div>
        </div>

        <div className="text-xs text-slate-400 border-t border-white/5 pt-2 mt-2">
          Cloud coverage: {current.cloudCover}% of the sky dome
        </div>
      </div>

      {/* Sun Arc & Day Length */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <Sunrise className="w-4 h-4 text-amber-400" />
            <span className="font-medium text-slate-300">
              {language === 'ur' ? 'طلوع و غروب آفتاب' : 'Sun Tracker'}
            </span>
          </div>
          <span>{dayProgressPercent}% daylight</span>
        </div>

        <div className="my-1 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Rise</div>
              <div className="text-xs font-mono font-medium text-white">{sunriseStr}</div>
            </div>
          </div>

          {/* Mini Arc Tracker */}
          <div className="flex-1 px-2">
            <div className="w-full h-1.5 bg-white/10 rounded-full relative">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-full"
                style={{ width: `${dayProgressPercent}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-md shadow-amber-400/50 -ml-1.5"
                style={{ left: `${dayProgressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sunset className="w-4 h-4 text-orange-400" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Set</div>
              <div className="text-xs font-mono font-medium text-white">{sunsetStr}</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 border-t border-white/5 pt-2 mt-2">
          Day duration: {todayDaily?.daylightDuration ? `${(todayDaily.daylightDuration / 3600).toFixed(1)} hrs` : '12 hrs'}
        </div>
      </div>
    </div>
  );
};
