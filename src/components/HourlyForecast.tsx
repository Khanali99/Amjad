import React, { useRef, useState } from 'react';
import {
  Clock,
  Droplets,
  Wind,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
} from 'lucide-react';
import { HourlyForecastItem, UnitSystem, Language } from '../types/weather';
import { convertTemp, convertWindSpeed, degreesToCardinal } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: UnitSystem;
  language: Language;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  unit,
  language,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const formatHour = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    } catch {
      return isoString.slice(11, 16);
    }
  };

  if (!hourly || hourly.length === 0) return null;

  // Find min and max temp in next 24h to scale temperature bar/dots
  const temps = hourly.map((h) => convertTemp(h.temperature, unit));
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const tRange = Math.max(1, maxT - minT);

  const selectedItem = selectedIdx !== null ? hourly[selectedIdx] : hourly[0];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <h3 className="text-base font-semibold text-white tracking-tight">
            {language === 'ur'
              ? 'اگلے 24 گھنٹوں کی پیشن گوئی'
              : language === 'ur_roman'
              ? 'Agley 24 Ghanton ki Forecast'
              : '24-Hour Hourly Forecast'}
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll Left"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll Right"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hourly Scrollable Track */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {hourly.map((item, idx) => {
          const isNow = idx === 0;
          const temp = temps[idx];
          const isSelected = selectedIdx === idx;
          // Calculate relative height bar percentage
          const heightPercent = 20 + Math.round(((temp - minT) / tRange) * 50);

          return (
            <button
              key={`${item.time}-${idx}`}
              onClick={() => setSelectedIdx(idx)}
              className={`flex-shrink-0 flex flex-col items-center justify-between p-3.5 rounded-2xl w-24 border text-center transition-all ${
                isSelected
                  ? 'bg-sky-500/20 border-sky-500/50 shadow-lg shadow-sky-500/10'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5'
              }`}
            >
              {/* Hour Label */}
              <span className={`text-xs font-medium ${isNow ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}>
                {isNow ? (language === 'ur' ? 'ابھی' : 'Now') : formatHour(item.time)}
              </span>

              {/* Weather Icon */}
              <div className="my-2.5 text-sky-300">
                <WeatherIcon code={item.weatherCode} isDay={item.isDay} className="w-6 h-6" />
              </div>

              {/* Temperature Display */}
              <span className="text-base font-semibold font-mono text-white">
                {temp}°
              </span>

              {/* Temperature Visual Indicator Bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full"
                  style={{ width: `${heightPercent}%` }}
                />
              </div>

              {/* Precipitation Chance */}
              <div className="mt-2.5 flex items-center justify-center gap-1 text-[11px] text-slate-400">
                <Droplets className="w-3 h-3 text-sky-400" />
                <span className={item.precipitationProbability > 20 ? 'text-sky-300 font-medium' : ''}>
                  {item.precipitationProbability}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Hour Details Strip */}
      {selectedItem && (
        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-200 font-medium">{formatHour(selectedItem.time)} Details:</span>
            <span>Feels like {convertTemp(selectedItem.feelsLike, unit)}°</span>
            <span aria-hidden="true">·</span>
            <span>Humidity: {selectedItem.humidity}%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {convertWindSpeed(selectedItem.windSpeed, unit).value}{' '}
                {convertWindSpeed(selectedItem.windSpeed, unit).unitLabel} (
                {degreesToCardinal(selectedItem.windDirection)})
              </span>
            </div>
            <span aria-hidden="true">·</span>
            <span>UV Index: {Math.round(selectedItem.uvIndex)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
