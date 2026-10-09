import React from 'react';
import {
  Wind,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Heart,
  Home,
  Bike,
  Sparkles,
  Info,
} from 'lucide-react';
import { AirQualityData, Language } from '../types/weather';
import { getAQILevel } from '../utils/weatherCodes';

interface AirQualityCardProps {
  airQuality?: AirQualityData;
  language: Language;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({
  airQuality,
  language,
}) => {
  if (!airQuality) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl text-center text-slate-400">
        <Activity className="w-8 h-8 text-sky-400 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Air Quality data currently synchronizing...</p>
      </div>
    );
  }

  const aqiInfo = getAQILevel(airQuality.usAqi);

  const pollutants = [
    { name: 'PM2.5', label: 'Fine Dust', val: airQuality.pm2_5, unit: 'µg/m³', max: 50, desc: 'Combustion particles & organic compounds' },
    { name: 'PM10', label: 'Coarse Dust', val: airQuality.pm10, unit: 'µg/m³', max: 100, desc: 'Dust, pollen, and mold spores' },
    { name: 'O₃', label: 'Ozone', val: airQuality.ozone, unit: 'µg/m³', max: 120, desc: 'Ground-level photochemical smog' },
    { name: 'NO₂', label: 'Nitrogen Dioxide', val: airQuality.nitrogenDioxide, unit: 'µg/m³', max: 100, desc: 'Vehicle exhaust and emissions' },
    { name: 'SO₂', label: 'Sulphur Dioxide', val: airQuality.sulphurDioxide, unit: 'µg/m³', max: 50, desc: 'Industrial and power plant emissions' },
    { name: 'CO', label: 'Carbon Monoxide', val: airQuality.carbonMonoxide, unit: 'µg/m³', max: 1000, desc: 'Incomplete combustion byproduct' },
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              {language === 'ur'
                ? 'ہوا کا معیار (Air Quality Index)'
                : language === 'ur_roman'
                ? 'Hawa ka Meyar (Air Quality)'
                : 'Air Quality & Pollutants'}
            </h3>
            <p className="text-xs text-slate-400">
              Real-time atmospheric composition & health guidelines
            </p>
          </div>
        </div>

        {/* Status Tag */}
        <div className={`self-start sm:self-auto px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${aqiInfo.bgColor} ${aqiInfo.borderColor} ${aqiInfo.textColor}`}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: aqiInfo.color }} />
          <span>{language === 'ur' ? aqiInfo.levelUrdu : language === 'ur_roman' ? aqiInfo.levelRomanUrdu : aqiInfo.level}</span>
        </div>
      </div>

      {/* Main AQI Meter Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* AQI Score */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">
              US Air Quality Index
            </span>
            <div className="flex items-baseline gap-3 my-2">
              <span className="text-5xl sm:text-6xl font-bold font-mono text-white">
                {airQuality.usAqi}
              </span>
              <div className="text-xs text-slate-400">
                <span>EU AQI: {airQuality.europeanAqi}</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-1">{aqiInfo.description}</p>
          </div>

          {/* Scale Bar */}
          <div className="mt-4">
            <div className="w-full h-2.5 bg-white/10 rounded-full relative overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(100, (airQuality.usAqi / 300) * 100)}%`,
                  backgroundColor: aqiInfo.color,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0 Good</span>
              <span>100 Mod</span>
              <span>150 Unhealthy</span>
              <span>300+ Haz</span>
            </div>
          </div>
        </div>

        {/* Health Advisory & Recommendations */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Health Guidance</span>
            </div>
            <p className="text-sm text-slate-200 mb-4">{aqiInfo.advice}</p>
          </div>

          {/* Quick Lifestyle Rules */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/5">
            <div className="p-2.5 rounded-xl bg-white/[0.02] text-center">
              <Bike className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">Outdoor Sports</div>
              <div className={`text-xs font-semibold ${airQuality.usAqi <= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {airQuality.usAqi <= 50 ? 'Recommended' : airQuality.usAqi <= 100 ? 'Acceptable' : 'Reduce Exertion'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.02] text-center">
              <Home className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">Windows</div>
              <div className={`text-xs font-semibold ${airQuality.usAqi <= 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {airQuality.usAqi <= 100 ? 'Open for Air' : 'Keep Closed'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.02] text-center">
              <Sparkles className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">Air Purifier</div>
              <div className={`text-xs font-semibold ${airQuality.usAqi > 100 ? 'text-amber-400' : 'text-slate-400'}`}>
                {airQuality.usAqi > 100 ? 'Turn On' : 'Optional'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.02] text-center">
              <ShieldAlert className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">Wear Mask</div>
              <div className={`text-xs font-semibold ${airQuality.usAqi > 150 ? 'text-rose-400' : 'text-slate-400'}`}>
                {airQuality.usAqi > 150 ? 'N95 Advised' : 'Not Required'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Pollutants Breakdown Grid */}
      <div>
        <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
          Pollutant Concentration Breakdown
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {pollutants.map((p) => {
            const ratio = Math.min(100, Math.round((p.val / p.max) * 100));
            return (
              <div
                key={p.name}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-white">{p.name}</span>
                  <span className="text-[10px] text-slate-500">{p.label}</span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-lg font-bold font-mono text-white">{p.val}</span>
                  <span className="text-[10px] text-slate-400">{p.unit}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      ratio > 75 ? 'bg-rose-500' : ratio > 45 ? 'bg-amber-500' : 'bg-sky-400'
                    }`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
