import React, { useState, useEffect, useCallback } from 'react';
import {
  CloudSun,
  Clock,
  CalendarDays,
  Layers,
  Activity,
  Sparkles,
  RefreshCw,
  AlertCircle,
  MapPin,
  ExternalLink,
  Heart,
} from 'lucide-react';
import { GeoLocation, WeatherData, UnitSystem, Language, WeatherAlert } from './types/weather';
import {
  fetchWeatherData,
  reverseGeocode,
  generateWeatherAlerts,
  POPULAR_CITIES,
} from './services/weatherApi';
import { Header } from './components/Header';
import { WeatherHero } from './components/WeatherHero';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { MetricsGrid } from './components/MetricsGrid';
import { AirQualityCard } from './components/AirQualityCard';
import { WeatherMap } from './components/WeatherMap';
import { LifestyleInsights } from './components/LifestyleInsights';
import { SavedLocationsModal } from './components/SavedLocationsModal';

export default function App() {
  // State Initialization from LocalStorage
  const [unit, setUnit] = useState<UnitSystem>(() => {
    return (localStorage.getItem('atmosphere_unit') as UnitSystem) || 'metric';
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('atmosphere_lang') as Language) || 'en';
  });

  const [favorites, setFavorites] = useState<GeoLocation[]>(() => {
    try {
      const saved = localStorage.getItem('atmosphere_favs');
      return saved ? JSON.parse(saved) : POPULAR_CITIES.slice(0, 3);
    } catch {
      return POPULAR_CITIES.slice(0, 3);
    }
  });

  const [location, setLocation] = useState<GeoLocation>(() => {
    try {
      const saved = localStorage.getItem('atmosphere_last_loc');
      return saved ? JSON.parse(saved) : POPULAR_CITIES[0]; // Default to Islamabad
    } catch {
      return POPULAR_CITIES[0];
    }
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'hourly' | 'daily' | 'radar' | 'aqi' | 'lifestyle'>('overview');
  const [isFavModalOpen, setIsFavModalOpen] = useState(false);

  // Sync Preferences to LocalStorage
  useEffect(() => {
    localStorage.setItem('atmosphere_unit', unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('atmosphere_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('atmosphere_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (location) {
      localStorage.setItem('atmosphere_last_loc', JSON.stringify(location));
    }
  }, [location]);

  // Load weather data
  const loadWeather = useCallback(async (loc: GeoLocation, showRefreshAnimation = false) => {
    if (showRefreshAnimation) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchWeatherData(loc);
      setWeatherData(data);
      const generatedAlerts = generateWeatherAlerts(data);
      setAlerts(generatedAlerts);
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setError('Unable to fetch live meteorological data. Please check connection and try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch when location changes
  useEffect(() => {
    loadWeather(location);
  }, [location, loadWeather]);

  // Geolocation trigger
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsRefreshing(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const resolved = await reverseGeocode(latitude, longitude);
        setLocation(resolved);
      },
      (err) => {
        console.warn('Geolocation failed:', err);
        setError('Location access permission was declined. Using previous city.');
        setIsRefreshing(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  // Favorites handlers
  const handleToggleFavorite = (loc: GeoLocation) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) =>
          f.name.toLowerCase() === loc.name.toLowerCase() ||
          (Math.abs(f.latitude - loc.latitude) < 0.05 && Math.abs(f.longitude - loc.longitude) < 0.05)
      );
      if (exists) {
        return prev.filter((f) => f.name.toLowerCase() !== loc.name.toLowerCase());
      } else {
        return [...prev, loc];
      }
    });
  };

  const handleRemoveFavorite = (loc: GeoLocation) => {
    setFavorites((prev) => prev.filter((f) => f.name.toLowerCase() !== loc.name.toLowerCase()));
  };

  const handleAddFavorite = (loc: GeoLocation) => {
    setFavorites((prev) => [...prev, loc]);
  };

  const formatLastUpdated = (isoString?: string) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentLocation={location}
        onSelectLocation={setLocation}
        onUseCurrentLocation={handleUseCurrentLocation}
        unit={unit}
        onToggleUnit={setUnit}
        language={language}
        onChangeLanguage={setLanguage}
        onRefresh={() => loadWeather(location, true)}
        isRefreshing={isRefreshing}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onOpenFavorites={() => setIsFavModalOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs (Zero-pill compliant segmented controls) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 overflow-x-auto">
          <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/5 rounded-xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'overview'
                  ? 'bg-sky-500 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CloudSun className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'خلاصہ' : language === 'ur_roman' ? 'Overview' : 'Overview'}</span>
            </button>
            <button
              onClick={() => setActiveTab('hourly')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'hourly'
                  ? 'bg-sky-500 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? '24 گھنٹے' : language === 'ur_roman' ? '24 Ghantey' : 'Hourly (24h)'}</span>
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'daily'
                  ? 'bg-sky-500 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? '7 دن' : language === 'ur_roman' ? '7 Din' : '7-Day Outlook'}</span>
            </button>
            <button
              onClick={() => setActiveTab('radar')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'radar'
                  ? 'bg-sky-500 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'ریڈار نقشہ' : language === 'ur_roman' ? 'Radar Map' : 'Radar & Map'}</span>
            </button>
            <button
              onClick={() => setActiveTab('aqi')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'aqi'
                  ? 'bg-sky-500 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'ہوا کا معیار' : language === 'ur_roman' ? 'Air Quality' : 'Air Quality'}</span>
            </button>
            <button
              onClick={() => setActiveTab('lifestyle')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'lifestyle'
                  ? 'bg-sky-500 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'رہنمائی' : language === 'ur_roman' ? 'Lifestyle' : 'Lifestyle'}</span>
            </button>
          </div>

          {/* Sync Time Stamp */}
          {weatherData && (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 shrink-0 pl-4 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Updated {formatLastUpdated(weatherData.lastUpdated)}</span>
            </div>
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadWeather(location)}
              className="text-xs font-semibold px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !weatherData && (
          <div className="space-y-6 animate-pulse">
            <div className="h-64 sm:h-80 bg-white/5 rounded-3xl" />
            <div className="h-32 bg-white/5 rounded-3xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="h-44 bg-white/5 rounded-3xl" />
              <div className="h-44 bg-white/5 rounded-3xl" />
              <div className="h-44 bg-white/5 rounded-3xl" />
            </div>
          </div>
        )}

        {/* Active View Modes */}
        {weatherData && (
          <>
            {/* Overview Tab (Comprehensive Dashboard view) */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Hero Card */}
                <WeatherHero
                  weather={weatherData}
                  unit={unit}
                  language={language}
                  alerts={alerts}
                />

                {/* 24-Hour Timeline */}
                <HourlyForecast
                  hourly={weatherData.hourly}
                  unit={unit}
                  language={language}
                />

                {/* Dual Column: 7-Day & Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <DailyForecast
                      daily={weatherData.daily}
                      unit={unit}
                      language={language}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <MetricsGrid
                      current={weatherData.current}
                      todayDaily={weatherData.daily[0]}
                      unit={unit}
                      language={language}
                    />
                  </div>
                </div>

                {/* Air Quality Section Preview */}
                <AirQualityCard
                  airQuality={weatherData.airQuality}
                  language={language}
                />

                {/* Live Radar Preview */}
                <WeatherMap
                  weather={weatherData}
                  unit={unit}
                  language={language}
                />

                {/* Lifestyle & Clothing Recommendations */}
                <LifestyleInsights
                  weather={weatherData}
                  unit={unit}
                  language={language}
                />
              </div>
            )}

            {/* Hourly Forecast Detailed Tab */}
            {activeTab === 'hourly' && (
              <div className="space-y-6">
                <HourlyForecast
                  hourly={weatherData.hourly}
                  unit={unit}
                  language={language}
                />
                <MetricsGrid
                  current={weatherData.current}
                  todayDaily={weatherData.daily[0]}
                  unit={unit}
                  language={language}
                />
              </div>
            )}

            {/* 7-Day Daily Forecast Tab */}
            {activeTab === 'daily' && (
              <div className="space-y-6">
                <DailyForecast
                  daily={weatherData.daily}
                  unit={unit}
                  language={language}
                />
              </div>
            )}

            {/* Radar Map Tab */}
            {activeTab === 'radar' && (
              <div className="space-y-6">
                <WeatherMap
                  weather={weatherData}
                  unit={unit}
                  language={language}
                />
              </div>
            )}

            {/* Air Quality Tab */}
            {activeTab === 'aqi' && (
              <div className="space-y-6">
                <AirQualityCard
                  airQuality={weatherData.airQuality}
                  language={language}
                />
              </div>
            )}

            {/* Lifestyle & Recommendations Tab */}
            {activeTab === 'lifestyle' && (
              <div className="space-y-6">
                <LifestyleInsights
                  weather={weatherData}
                  unit={unit}
                  language={language}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Clean Aesthetic Footer */}
      <footer className="mt-12 border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Atmosphere Weather</span>
            <span aria-hidden="true">·</span>
            <span>Live meteorological data powered by Open-Meteo</span>
            <span aria-hidden="true">·</span>
            <span>WMO Standards</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Free & Open Source Data</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              API Operational
            </span>
          </div>
        </div>
      </footer>

      {/* Saved Locations Modal */}
      <SavedLocationsModal
        isOpen={isFavModalOpen}
        onClose={() => setIsFavModalOpen(false)}
        favorites={favorites}
        onSelect={setLocation}
        onRemove={handleRemoveFavorite}
        onAdd={handleAddFavorite}
        unit={unit}
        language={language}
      />
    </div>
  );
}
