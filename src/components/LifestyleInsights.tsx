import React from 'react';
import {
  Sparkles,
  Shirt,
  Footprints,
  Bike,
  Car,
  Utensils,
  Moon,
  Camera,
  Droplet,
  Umbrella,
  ThermometerSnowflake,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { WeatherData, UnitSystem, Language } from '../types/weather';
import { convertTemp } from '../utils/weatherCodes';

interface LifestyleInsightsProps {
  weather: WeatherData;
  unit: UnitSystem;
  language: Language;
}

export const LifestyleInsights: React.FC<LifestyleInsightsProps> = ({
  weather,
  unit,
  language,
}) => {
  const current = weather.current;
  const temp = current.temperature;
  const aqi = weather.airQuality?.usAqi || 50;

  // Determine Clothing Recommendation
  let clothingTitle = '';
  let clothingDesc = '';
  let clothingIcon = <Shirt className="w-5 h-5 text-sky-400" />;

  if (temp >= 32) {
    clothingTitle = 'Ultra-Light Breathable Cotton';
    clothingDesc = 'Loose-fitting, light-colored garments, UV sunglasses, and broad sun protection.';
    clothingIcon = <Sun className="w-5 h-5 text-amber-400" />;
  } else if (temp >= 24) {
    clothingTitle = 'Short Sleeves & Comfortable Casual';
    clothingDesc = 'T-shirts, shorts, or light trousers. Perfect comfortable warmth.';
    clothingIcon = <Shirt className="w-5 h-5 text-sky-400" />;
  } else if (temp >= 16) {
    clothingTitle = 'Light Layers & Long Sleeves';
    clothingDesc = 'Long-sleeved shirt with a light cardigan or windbreaker for breezes.';
    clothingIcon = <Shirt className="w-5 h-5 text-indigo-400" />;
  } else if (temp >= 8) {
    clothingTitle = 'Warm Jacket & Knitwear';
    clothingDesc = 'Mid-weight jacket or sweater, socks, and covered footwear.';
    clothingIcon = <ThermometerSnowflake className="w-5 h-5 text-blue-400" />;
  } else {
    clothingTitle = 'Heavy Winter Coat & Thermals';
    clothingDesc = 'Insulated parka, woolen scarf, thermal underwear, and gloves.';
    clothingIcon = <ThermometerSnowflake className="w-5 h-5 text-cyan-300" />;
  }

  // Rain / Umbrella check
  const needUmbrella = current.precipitation > 0 || current.weatherCode >= 51;

  // Activity calculation scores (0 to 100)
  // Running score
  let runningScore = 90;
  if (temp > 30) runningScore -= (temp - 30) * 4;
  if (temp < 5) runningScore -= (5 - temp) * 4;
  if (current.precipitation > 0) runningScore -= 45;
  if (aqi > 100) runningScore -= 30;
  runningScore = Math.max(10, Math.min(100, Math.round(runningScore)));

  // Cycling score
  let cyclingScore = 88;
  if (current.windSpeed > 30) cyclingScore -= 35;
  if (current.precipitation > 0) cyclingScore -= 40;
  if (temp > 32 || temp < 3) cyclingScore -= 25;
  cyclingScore = Math.max(10, Math.min(100, Math.round(cyclingScore)));

  // Stargazing score
  let starScore = 85;
  if (current.cloudCover > 20) starScore -= current.cloudCover * 0.8;
  if (current.precipitation > 0) starScore = 10;
  starScore = Math.max(10, Math.min(100, Math.round(starScore)));

  // Car Wash score
  let carWashScore = 95;
  if (current.precipitation > 0 || weather.hourly.some((h, i) => i < 12 && h.precipitationProbability > 35)) {
    carWashScore = 20;
  }

  // Outdoor dining score
  let diningScore = 85;
  if (temp < 15 || temp > 33) diningScore -= 30;
  if (current.windSpeed > 25) diningScore -= 35;
  if (current.precipitation > 0) diningScore = 15;
  diningScore = Math.max(10, Math.min(100, Math.round(diningScore)));

  const getScoreBadge = (score: number) => {
    if (score >= 75) return { label: 'Excellent', color: 'text-emerald-400 bg-emerald-500/10' };
    if (score >= 50) return { label: 'Good', color: 'text-sky-400 bg-sky-500/10' };
    if (score >= 30) return { label: 'Fair', color: 'text-amber-400 bg-amber-500/10' };
    return { label: 'Poor', color: 'text-rose-400 bg-rose-500/10' };
  };

  const activities = [
    { title: 'Running & Jogging', icon: <Footprints className="w-4 h-4 text-sky-400" />, score: runningScore, desc: runningScore > 70 ? 'Favorable atmospheric conditions' : 'Consider treadmill or indoor gym' },
    { title: 'Cycling & Commute', icon: <Bike className="w-4 h-4 text-emerald-400" />, score: cyclingScore, desc: current.windSpeed > 25 ? 'Noticeable headwind resistance' : 'Clear streets & good traction' },
    { title: 'Outdoor Dining', icon: <Utensils className="w-4 h-4 text-amber-400" />, score: diningScore, desc: diningScore > 70 ? 'Pleasant patio atmosphere' : 'Better suited for indoor seating' },
    { title: 'Stargazing', icon: <Moon className="w-4 h-4 text-purple-400" />, score: starScore, desc: current.cloudCover < 30 ? 'Clear overhead cosmic viewing' : 'Obscured by cloud formations' },
    { title: 'Car Wash', icon: <Car className="w-4 h-4 text-blue-400" />, score: carWashScore, desc: carWashScore > 60 ? 'Will stay clean for days' : 'Rain probability ahead' },
    { title: 'Photography', icon: <Camera className="w-4 h-4 text-rose-400" />, score: 85, desc: 'Warm natural light and soft shadows' },
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            {language === 'ur'
              ? 'طرز زندگی اور سرگرمیوں کی رہنمائی'
              : language === 'ur_roman'
              ? 'Lifestyle aur Activities ki Rehnumayi'
              : 'Smart Lifestyle & Activity Planner'}
          </h3>
          <p className="text-xs text-slate-400">
            Intelligent recommendations tailored to current conditions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Wardrobe & Clothing Advice */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Shirt className="w-4 h-4 text-sky-400" />
              <span>Wardrobe Advisor</span>
            </div>
            <h4 className="text-lg font-semibold text-white my-1">{clothingTitle}</h4>
            <p className="text-xs text-slate-300 mt-1">{clothingDesc}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Umbrella className="w-4 h-4 text-sky-400" />
              <span>{needUmbrella ? 'Bring an Umbrella' : 'No Umbrella Needed'}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {convertTemp(temp, unit)}° Outside
            </span>
          </div>
        </div>

        {/* Allergy & Health Shield */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Allergy & Breathing Guard</span>
            </div>
            <h4 className="text-lg font-semibold text-white my-1">
              {aqi <= 60 ? 'Low Sensitivity Risk' : aqi <= 120 ? 'Moderate Particle Drift' : 'High Irritation Warning'}
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              {aqi <= 60
                ? 'Air is pristine with minimal dust concentration. Safe for all respiratory sensitivities.'
                : 'Particulate matter or seasonal dust present. Sensitive individuals should pace outdoor exercise.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Air Quality Index: {aqi}</span>
            <span className="text-emerald-400 font-mono font-medium">Safe Breath</span>
          </div>
        </div>

        {/* Golden Hour & Hydration */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Daylight & Hydration</span>
            </div>
            <h4 className="text-lg font-semibold text-white my-1">
              {temp > 30 ? 'Target 3.0L Water Intake' : 'Target 2.2L Water Intake'}
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Atmospheric humidity is {current.humidity}%. Maintain consistent hydration throughout the day.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-sky-400" />
              Hydration status
            </span>
            <span className="text-sky-400 font-mono font-medium">Optimal</span>
          </div>
        </div>
      </div>

      {/* Activity Scores Grid */}
      <div>
        <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
          Daily Activity Readiness
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activities.map((act) => {
            const badge = getScoreBadge(act.score);
            return (
              <div
                key={act.title}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5 shrink-0">
                    {act.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-white">{act.title}</div>
                    <div className="text-xs text-slate-400">{act.desc}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${badge.color}`}>
                    {badge.label}
                  </span>
                  <div className="text-[11px] font-mono text-slate-500 mt-1">
                    {act.score}/100
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
