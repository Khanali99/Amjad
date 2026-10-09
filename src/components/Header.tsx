import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Globe2,
  X,
  Compass,
  SlidersHorizontal,
} from 'lucide-react';
import { GeoLocation, UnitSystem, Language } from '../types/weather';
import { searchLocations, POPULAR_CITIES } from '../services/weatherApi';

interface HeaderProps {
  currentLocation: GeoLocation;
  onSelectLocation: (loc: GeoLocation) => void;
  onUseCurrentLocation: () => void;
  unit: UnitSystem;
  onToggleUnit: (unit: UnitSystem) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  favorites: GeoLocation[];
  onToggleFavorite: (loc: GeoLocation) => void;
  onOpenFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  onUseCurrentLocation,
  unit,
  onToggleUnit,
  language,
  onChangeLanguage,
  onRefresh,
  isRefreshing,
  favorites,
  onToggleFavorite,
  onOpenFavorites,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const isCurrentFav = favorites.some(
    (f) =>
      f.name.toLowerCase() === currentLocation.name.toLowerCase() ||
      (Math.abs(f.latitude - currentLocation.latitude) < 0.05 &&
        Math.abs(f.longitude - currentLocation.longitude) < 0.05)
  );

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchLocations(query);
      setResults(res);
      setIsSearching(false);
      setIsOpen(true);
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: GeoLocation) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/70 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Location Indicator */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 ring-1 ring-white/20">
              <Compass className="w-5 h-5 animate-[spin_24s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg tracking-tight text-white font-mono">
                  Atmosphere
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-[220px]">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">
                  {currentLocation.name}
                  {currentLocation.country ? `, ${currentLocation.country}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Right Quick Action */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => onToggleFavorite(currentLocation)}
              aria-label="Toggle Favorite"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-amber-400 transition-colors"
            >
              {isCurrentFav ? (
                <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onRefresh}
              aria-label="Refresh Weather Data"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Global Location Search Bar */}
        <div ref={searchContainerRef} className="relative w-full md:max-w-md flex-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (query.trim().length >= 2 || results.length > 0) setIsOpen(true);
              }}
              placeholder={
                language === 'ur'
                  ? 'شہر یا ملک تلاش کریں...'
                  : language === 'ur_roman'
                  ? 'Shehar ka naam search karein...'
                  : 'Search any city worldwide (e.g. London, Karachi)...'
              }
              className="w-full pl-10 pr-20 py-2 text-sm bg-white/5 hover:bg-white/[0.08] focus:bg-slate-900 text-white placeholder-slate-400 rounded-xl border border-white/10 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all shadow-inner"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onUseCurrentLocation}
                title="Detect GPS location"
                className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5">
              {isSearching ? (
                <div className="p-4 text-xs text-slate-400 text-center flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
                  Searching global locations...
                </div>
              ) : results.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider bg-white/[0.02]">
                    Matched Cities
                  </div>
                  {results.map((loc) => (
                    <button
                      key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                      onClick={() => handleSelect(loc)}
                      className="w-full px-3.5 py-2.5 text-left text-sm text-slate-200 hover:bg-sky-500/15 hover:text-white flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-500 group-hover:text-sky-400 shrink-0" />
                        <span className="font-medium text-white">{loc.name}</span>
                        {loc.admin1 && (
                          <span className="text-xs text-slate-400">· {loc.admin1}</span>
                        )}
                        <span className="text-xs text-slate-400">({loc.country})</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {loc.latitude > 0 ? `${loc.latitude.toFixed(1)}°N` : `${Math.abs(loc.latitude).toFixed(1)}°S`}
                      </span>
                    </button>
                  ))}
                </div>
              ) : query.length >= 2 ? (
                <div className="p-4 text-xs text-slate-400 text-center">
                  No cities found for &ldquo;{query}&rdquo;. Try another spelling.
                </div>
              ) : null}

              {/* Quick Popular Picks */}
              <div className="p-2.5 bg-black/20">
                <div className="text-[11px] font-medium text-slate-400 px-1 mb-1.5">
                  Popular Hubs
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CITIES.slice(0, 6).map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelect(city)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/5 transition-colors"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Controls: Units, Languages, Favorites & Refresh */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Unit Toggle */}
          <div className="flex items-center p-0.5 bg-white/5 border border-white/10 rounded-lg">
            <button
              onClick={() => onToggleUnit('metric')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                unit === 'metric' ? 'bg-sky-500 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onToggleUnit('imperial')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                unit === 'imperial' ? 'bg-sky-500 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <div className="flex items-center p-0.5 bg-white/5 border border-white/10 rounded-lg">
              <button
                onClick={() => onChangeLanguage('en')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                  language === 'en' ? 'bg-white/20 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => onChangeLanguage('ur_roman')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                  language === 'ur_roman' ? 'bg-white/20 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                title="Roman Urdu"
              >
                Urdu
              </button>
              <button
                onClick={() => onChangeLanguage('ur')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                  language === 'ur' ? 'bg-white/20 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                title="اردو"
              >
                اردو
              </button>
            </div>
          </div>

          {/* Favorite current toggle */}
          <button
            onClick={() => onToggleFavorite(currentLocation)}
            title={isCurrentFav ? 'Remove from favorites' : 'Save as favorite'}
            className={`p-2 rounded-lg border transition-all ${
              isCurrentFav
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {isCurrentFav ? (
              <BookmarkCheck className="w-4 h-4 fill-amber-400/30" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          {/* Open saved locations drawer/modal */}
          <button
            onClick={onOpenFavorites}
            title="Saved Locations"
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-[10px] font-mono font-bold text-white flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Refresh Data */}
          <button
            onClick={onRefresh}
            title="Refresh weather data"
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-sky-400 hover:border-sky-500/30 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
