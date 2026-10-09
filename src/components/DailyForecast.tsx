import React, { useState } from 'react';
import {
  CalendarDays,
  Droplets,
  Sunrise,
  Sunset,
  Wind,
  Sun,
  ChevronDown,
} from 'lucide-react';
import { DailyForecastItem, UnitSystem, Language } from '../types/weather';
import { getWeatherInfo, convertTemp, convertWindSpeed, degreesToCardinal } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  unit: UnitSystem;
  language: Language;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  daily,
  unit,
  language,
}) => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  if (!daily || daily.length === 0) return null;

  // Calculate absolute minimum and maximum across all 7 days for the range bars
  const allMins = daily.map((d) => convertTemp(d.tempMin, unit));
  const allMaxs = daily.map((d) => convertTemp(d.tempMax, unit));
  const weekMin = Math.min(...allMins);
  const weekMax = Math.max(...allMaxs);
  const weekSpan = Math.max(1, weekMax - weekMin);

  const getDayName = (dateStr: string, idx: number) => {
    if (idx === 0) return language === 'ur' ? 'آج' : language === 'ur_roman' ? 'Aaj' : 'Today';
    if (idx === 1) return language === 'ur' ? 'کل' : language === 'ur_roman' ? 'Kal' : 'Tomorrow';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', { weekday: 'short' });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (isoStr: string) => {
    if (!isoStr) return '--:--';
    try {
      return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoStr.slice(11, 16);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-sky-400" />
          <h3 className="text-base font-semibold text-white tracking-tight">
            {language === 'ur'
              ? '7 دنوں کی پیشن گوئی'
              : language === 'ur_roman'
              ? '7 Dinon ki Forecast'
              : '7-Day Extended Outlook'}
          </h3>
        </div>
        <span className="text-xs text-slate-400">Weekly trend</span>
      </div>

      <div className="divide-y divide-white/5">
        {daily.map((day, idx) => {
          const info = getWeatherInfo(day.weatherCode);
          const tMin = convertTemp(day.tempMin, unit);
          const tMax = convertTemp(day.tempMax, unit);

          // Calculate left and width percentages for the temperature bar
          const leftPercent = Math.max(0, Math.min(90, ((tMin - weekMin) / weekSpan) * 100));
          const rightPercent = Math.max(leftPercent + 10, Math.min(100, ((tMax - weekMin) / weekSpan) * 100));
          const barWidth = Math.max(8, rightPercent - leftPercent);

          const isExpanded = expandedDay === day.date;
          const conditionLabel =
            language === 'ur'
              ? info.labelUrdu
              : language === 'ur_roman'
              ? info.labelRomanUrdu
              : info.label;

          return (
            <div key={day.date} className="py-3 first:pt-1 last:pb-1">
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day.date)}
                className="w-full flex items-center justify-between gap-3 text-left hover:bg-white/[0.02] p-1.5 rounded-xl transition-colors group"
              >
                {/* Day name & Icon */}
                <div className="flex items-center gap-3 w-32 sm:w-36 shrink-0">
                  <span className={`text-sm font-medium ${idx === 0 ? 'text-sky-400 font-semibold' : 'text-slate-200'}`}>
                    {getDayName(day.date, idx)}
                  </span>
                  <div className="text-sky-300">
                    <WeatherIcon code={day.weatherCode} isDay={true} className="w-5 h-5" />
                  </div>
                </div>

                {/* Rain probability */}
                <div className="flex items-center gap-1 w-16 text-xs text-slate-400 shrink-0">
                  {day.precipitationProbabilityMax > 10 ? (
                    <>
                      <Droplets className="w-3 h-3 text-sky-400" />
                      <span className="text-sky-300 font-medium">{day.precipitationProbabilityMax}%</span>
                    </>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </div>

                {/* Temperature bar */}
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-slate-400 w-8 text-right shrink-0">
                    {tMin}°
                  </span>

                  <div className="flex-1 h-1.5 bg-white/10 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-mono font-medium text-white w-8 text-left shrink-0">
                    {tMax}°
                  </span>
                </div>

                {/* Chevron */}
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform ${
                    isExpanded ? 'rotate-180 text-sky-400' : ''
                  }`}
                />
              </button>

              {/* Expanded Day Details */}
              {isExpanded && (
                <div className="mt-2.5 p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400 flex items-center gap-1 mb-1">
                      <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sunrise</span>
                    </div>
                    <span className="font-mono text-white">{formatTime(day.sunrise)}</span>
                  </div>
                  <div>
                    <div className="text-slate-400 flex items-center gap-1 mb-1">
                      <Sunset className="w-3.5 h-3.5 text-orange-400" />
                      <span>Sunset</span>
                    </div>
                    <span className="font-mono text-white">{formatTime(day.sunset)}</span>
                  </div>
                  <div>
                    <div className="text-slate-400 flex items-center gap-1 mb-1">
                      <Wind className="w-3.5 h-3.5 text-sky-400" />
                      <span>Max Wind</span>
                    </div>
                    <span className="font-mono text-white">
                      {convertWindSpeed(day.windSpeedMax, unit).value} {convertWindSpeed(day.windSpeedMax, unit).unitLabel} (
                      {degreesToCardinal(day.windDirectionDominant)})
                    </span>
                  </div>
                  <div>
                    <div className="text-slate-400 flex items-center gap-1 mb-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Max UV Index</span>
                    </div>
                    <span className="font-mono text-white">{Math.round(day.uvIndexMax)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
