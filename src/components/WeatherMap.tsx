import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  Play,
  Pause,
  CloudRain,
  Thermometer,
  Wind,
} from 'lucide-react';
import { WeatherData, UnitSystem, Language } from '../types/weather';
import { convertTemp, getWeatherInfo } from '../utils/weatherCodes';

interface WeatherMapProps {
  weather: WeatherData;
  unit: UnitSystem;
  language: Language;
}

type MapLayerType = 'radar' | 'temp' | 'wind' | 'clouds';

export const WeatherMap: React.FC<WeatherMapProps> = ({
  weather,
  unit,
  language,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const radarLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('radar');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingRadar, setIsPlayingRadar] = useState(false);
  const [radarFrame, setRadarFrame] = useState(0);

  const { latitude, longitude, name, country } = weather.location;
  const currentTemp = convertTemp(weather.current.temperature, unit);
  const info = getWeatherInfo(weather.current.weatherCode);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet map with dark theme tiles
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark Basemap (CartoDB Dark Matter / Stadia / OSM Dark)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);

      // Custom marker icon
      const customIcon = L.divIcon({
        className: 'custom-weather-pin',
        html: `
          <div style="
            background: linear-gradient(135deg, #0284c7, #4f46e5);
            color: white;
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            font-family: monospace;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            border: 2px solid white;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
          ">
            <span>${name}: ${currentTemp}°</span>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 15],
      });

      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
      markerRef.current = marker;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([latitude, longitude], 7);
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
        const customIcon = L.divIcon({
          className: 'custom-weather-pin',
          html: `
            <div style="
              background: linear-gradient(135deg, #0284c7, #4f46e5);
              color: white;
              padding: 4px 8px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 700;
              font-family: monospace;
              box-shadow: 0 4px 12px rgba(0,0,0,0.4);
              border: 2px solid white;
              display: flex;
              align-items: center;
              gap: 4px;
              white-space: nowrap;
            ">
              <span>${name}: ${currentTemp}°</span>
            </div>
          `,
          iconSize: [80, 30],
          iconAnchor: [40, 15],
        });
        markerRef.current.setIcon(customIcon);
      }
    }

    return () => {
      // cleanup on unmount
    };
  }, [latitude, longitude, name, currentTemp]);

  // Update weather overlay tile layer when activeLayer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (radarLayerRef.current) {
      map.removeLayer(radarLayerRef.current);
      radarLayerRef.current = null;
    }

    let tileUrl = '';
    let opacity = 0.55;

    // Use RainViewer API tiles for live real-time global precipitation radar
    // or OpenWeather/Iowa State mesonet weather radar
    if (activeLayer === 'radar') {
      tileUrl = 'https://tilecache.rainviewer.com/v2/radar/nowcast_0/256/{z}/{x}/{y}/2/1_1.png';
      opacity = 0.7;
    } else if (activeLayer === 'temp') {
      // Temperature Heat layer
      tileUrl = 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2';
      opacity = 0.6;
    } else if (activeLayer === 'clouds') {
      tileUrl = 'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2';
      opacity = 0.5;
    } else if (activeLayer === 'wind') {
      tileUrl = 'https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2';
      opacity = 0.6;
    }

    if (tileUrl) {
      const layer = L.tileLayer(tileUrl, {
        opacity,
        zIndex: 10,
        tileSize: 256,
      });
      layer.addTo(map);
      radarLayerRef.current = layer;
    }
  }, [activeLayer, radarFrame]);

  // Handle radar animation loop
  useEffect(() => {
    let interval: any;
    if (isPlayingRadar) {
      interval = setInterval(() => {
        setRadarFrame((prev) => (prev + 1) % 4);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlayingRadar]);

  const recenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([latitude, longitude], 8, { animate: true });
    }
  };

  return (
    <div
      className={`bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl' : ''
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              {language === 'ur'
                ? 'موسمیاتی ریڈار اور سیٹلائٹ نقشہ'
                : language === 'ur_roman'
                ? 'Mausam ka Live Radar Map'
                : 'Live Weather Radar & Satellite'}
            </h3>
            <p className="text-xs text-slate-400">
              Interactive precipitation, cloud cover, and surface wind tracking
            </p>
          </div>
        </div>

        {/* Layer Selectors & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer switcher */}
          <div className="flex items-center p-0.5 bg-white/5 border border-white/10 rounded-xl">
            <button
              onClick={() => setActiveLayer('radar')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                activeLayer === 'radar'
                  ? 'bg-sky-500 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Rain Radar</span>
            </button>
            <button
              onClick={() => setActiveLayer('temp')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                activeLayer === 'temp'
                  ? 'bg-sky-500 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Temp</span>
            </button>
            <button
              onClick={() => setActiveLayer('wind')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                activeLayer === 'wind'
                  ? 'bg-sky-500 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Wind</span>
            </button>
          </div>

          {/* Action buttons */}
          <button
            onClick={recenter}
            title="Recenter on current city"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors"
          >
            <Navigation className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-inner">
        <div
          ref={mapContainerRef}
          className={`w-full ${isFullscreen ? 'h-[calc(100vh-140px)]' : 'h-[360px] sm:h-[420px]'} bg-slate-950`}
        />

        {/* Bottom Floating Radar Legend & Timeline Controller */}
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 bg-slate-900/90 backdrop-blur-xl border border-white/15 rounded-xl px-3.5 py-2.5 shadow-2xl flex items-center justify-between sm:justify-start gap-4 z-[400] text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlayingRadar(!isPlayingRadar)}
              className="p-1.5 rounded-lg bg-sky-500 text-white hover:bg-sky-400 transition-colors"
              title={isPlayingRadar ? 'Pause Radar Loop' : 'Play Radar Loop'}
            >
              {isPlayingRadar ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <div className="text-slate-300">
              <span className="font-semibold text-white">Live Doppler</span>
              <span className="text-[10px] text-slate-400 block">Past 60 mins</span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            <span className="text-[10px] text-slate-400">Rain Intensity:</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-2 rounded-sm bg-blue-300" title="Light Drizzle" />
              <span className="w-3 h-2 rounded-sm bg-blue-600" title="Moderate Rain" />
              <span className="w-3 h-2 rounded-sm bg-amber-500" title="Heavy Rain" />
              <span className="w-3 h-2 rounded-sm bg-rose-600" title="Severe Storm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
