import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Droplets,
  Wind,
  Eye,
  Sun,
  ShieldAlert,
  ChevronRight,
  X,
} from 'lucide-react';
import { WeatherData, UnitSystem, Language, WeatherAlert } from '../types/weather';
import { getWeatherInfo, convertTemp, convertWindSpeed } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import { WeatherBackgroundCanvas } from './WeatherBackgroundCanvas';

interface WeatherHeroProps {
  weather: WeatherData;
  unit: UnitSystem;
  language: Language;
  alerts: WeatherAlert[];
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({
  weather,
  unit,
  language,
  alerts,
}) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  const current = weather.current;
  const todayDaily = weather.daily[0];
  const info = getWeatherInfo(current.weatherCode);

  const activeAlerts = alerts.filter((a) => !dismissedAlerts.includes(a.id));

  // Translated Condition Name
  const conditionLabel =
    language === 'ur'
      ? info.labelUrdu
      : language === 'ur_roman'
      ? info.labelRomanUrdu
      : info.label;

  const currentTemp = convertTemp(current.temperature, unit);
  const feelsLikeTemp = convertTemp(current.feelsLike, unit);
  const maxTemp = todayDaily ? convertTemp(todayDaily.tempMax, unit) : currentTemp + 2;
  const minTemp = todayDaily ? convertTemp(todayDaily.tempMin, unit) : currentTemp - 4;
  const windInfo = convertWindSpeed(current.windSpeed, unit);

  // Background styling
  const gradientClass = current.isDay ? info.bgColorDay : info.bgColorNight;

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${gradientClass} p-6 sm:p-8 lg:p-10 shadow-2xl transition-all duration-700`}>
      {/* Dynamic atmospheric canvas effect (rain, snow, motes, stars) */}
      <WeatherBackgroundCanvas category={info.category} isDay={current.isDay} />

      <div className="relative z-10">
        {/* Active Weather Warnings Banner */}
        {activeAlerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm transition-all ${
                  alert.severity === 'warning'
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      alert.severity === 'warning' ? 'text-rose-400' : 'text-amber-400'
                    }`}
                  />
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{language === 'ur' ? alert.titleUrdu : alert.title}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-white/10">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {language === 'ur' ? alert.descriptionUrdu : alert.description}
                    </p>
                    {expandedAlert === alert.id && (
                      <p className="text-xs text-white/90 mt-2 p-2 rounded-lg bg-black/20 font-mono">
                        Safety Advisory: {alert.instruction}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() =>
                      setExpandedAlert(expandedAlert === alert.id ? null : alert.id)
                    }
                    className="text-xs underline hover:text-white transition-colors"
                  >
                    {expandedAlert === alert.id ? 'Hide details' : 'Safety action'}
                  </button>
                  <button
                    onClick={() => setDismissedAlerts((prev) => [...prev, alert.id])}
                    className="p-1 hover:bg-white/10 rounded-md transition-colors"
                    title="Dismiss alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hero Main Content */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          {/* Left: Location & Massive Temperature */}
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
              <span>{weather.location.name}</span>
              <span aria-hidden="true">·</span>
              <span>{weather.location.country}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{current.isDay ? 'Daytime' : 'Night'}</span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-7xl sm:text-8xl lg:text-9xl font-bold font-mono tracking-tighter text-white drop-shadow-sm">
                {currentTemp}°
              </span>
              <div className="flex flex-col gap-1 pb-3">
                <span className="text-xl sm:text-2xl font-medium text-slate-200">
                  {unit === 'metric' ? 'Celsius' : 'Fahrenheit'}
                </span>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="flex items-center text-slate-300">
                    <ArrowUp className="w-3.5 h-3.5 text-rose-400 mr-0.5 inline" />
                    {maxTemp}°
                  </span>
                  <span className="flex items-center text-slate-300">
                    <ArrowDown className="w-3.5 h-3.5 text-sky-400 mr-0.5 inline" />
                    {minTemp}°
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Feels {feelsLikeTemp}°
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Weather Condition visual & description */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl text-sky-300">
                <WeatherIcon
                  code={current.weatherCode}
                  isDay={current.isDay}
                  className="w-12 h-12 sm:w-16 sm:h-16"
                />
              </div>
              <div className="text-left lg:text-right">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                  {conditionLabel}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {current.precipitation > 0
                    ? `Precipitation: ${current.precipitation} mm`
                    : `Cloud Cover: ${current.cloudCover}%`}
                </p>
              </div>
            </div>

            {/* Quick telemetry text row (zero-pill design) */}
            <div className="flex items-center gap-4 text-xs text-slate-300 pt-2 border-t border-white/10 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>{current.humidity}% Humidity</span>
              </div>
              <span aria-hidden="true" className="text-white/20">·</span>
              <div className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-sky-400" />
                <span>{windInfo.value} {windInfo.unitLabel} Wind</span>
              </div>
              <span aria-hidden="true" className="text-white/20">·</span>
              <div className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>UV {Math.round(current.uvIndex)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
