export interface WeatherCodeInfo {
  code: number;
  label: string;
  labelRomanUrdu: string;
  labelUrdu: string;
  iconName: string; // Lucide icon identifier
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  bgColorDay: string;
  bgColorNight: string;
  gradientDay: string;
  gradientNight: string;
}

export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    labelRomanUrdu: 'Saaf Aasman',
    labelUrdu: 'صاف آسمان',
    iconName: 'Sun',
    category: 'clear',
    bgColorDay: 'from-amber-500/20 via-sky-500/10 to-blue-600/20',
    bgColorNight: 'from-slate-900 via-indigo-950 to-slate-950',
    gradientDay: 'from-amber-400 to-orange-500',
    gradientNight: 'from-indigo-400 to-purple-600',
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    labelRomanUrdu: 'Zyada tar Saaf',
    labelUrdu: 'زیادہ تر صاف',
    iconName: 'SunMedium',
    category: 'clear',
    bgColorDay: 'from-sky-500/20 via-amber-500/10 to-blue-600/20',
    bgColorNight: 'from-slate-900 via-indigo-950 to-slate-950',
    gradientDay: 'from-sky-400 to-amber-500',
    gradientNight: 'from-indigo-400 to-slate-600',
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    labelRomanUrdu: 'Juzwi Badal',
    labelUrdu: 'جزوی بادل',
    iconName: 'CloudSun',
    category: 'cloudy',
    bgColorDay: 'from-blue-500/20 via-slate-400/15 to-cyan-600/20',
    bgColorNight: 'from-slate-900 via-slate-800 to-indigo-950',
    gradientDay: 'from-blue-400 to-slate-400',
    gradientNight: 'from-slate-400 to-indigo-400',
  },
  3: {
    code: 3,
    label: 'Overcast',
    labelRomanUrdu: 'Mukammal Badal',
    labelUrdu: 'گھنے بادل',
    iconName: 'Cloud',
    category: 'cloudy',
    bgColorDay: 'from-slate-600/30 via-slate-500/20 to-zinc-700/30',
    bgColorNight: 'from-zinc-950 via-slate-900 to-stone-900',
    gradientDay: 'from-slate-400 to-zinc-500',
    gradientNight: 'from-zinc-400 to-slate-600',
  },
  45: {
    code: 45,
    label: 'Foggy',
    labelRomanUrdu: 'Dhund / Kohar',
    labelUrdu: 'دھند',
    iconName: 'CloudFog',
    category: 'fog',
    bgColorDay: 'from-zinc-500/25 via-slate-400/20 to-neutral-600/25',
    bgColorNight: 'from-zinc-900 via-stone-900 to-slate-950',
    gradientDay: 'from-zinc-300 to-slate-400',
    gradientNight: 'from-zinc-500 to-slate-700',
  },
  48: {
    code: 48,
    label: 'Depositing Rime Fog',
    labelRomanUrdu: 'Jamti Huwi Dhund',
    labelUrdu: 'جمتی ہوئی دھند',
    iconName: 'CloudFog',
    category: 'fog',
    bgColorDay: 'from-zinc-500/25 via-slate-400/20 to-neutral-600/25',
    bgColorNight: 'from-zinc-900 via-stone-900 to-slate-950',
    gradientDay: 'from-zinc-300 to-slate-400',
    gradientNight: 'from-zinc-500 to-slate-700',
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    labelRomanUrdu: 'Halki Boondabaandi',
    labelUrdu: 'ہلکی بونداباندی',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    bgColorDay: 'from-cyan-600/25 via-blue-500/15 to-slate-600/25',
    bgColorNight: 'from-slate-900 via-cyan-950 to-slate-950',
    gradientDay: 'from-cyan-400 to-blue-500',
    gradientNight: 'from-cyan-500 to-blue-700',
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    labelRomanUrdu: 'Darmiyani Boondabaandi',
    labelUrdu: 'درمیانی بونداباندی',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    bgColorDay: 'from-cyan-600/25 via-blue-500/15 to-slate-600/25',
    bgColorNight: 'from-slate-900 via-cyan-950 to-slate-950',
    gradientDay: 'from-cyan-400 to-blue-500',
    gradientNight: 'from-cyan-500 to-blue-700',
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    labelRomanUrdu: 'Tez Boondabaandi',
    labelUrdu: 'تیز بونداباندی',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    bgColorDay: 'from-blue-600/30 via-slate-500/20 to-cyan-700/30',
    bgColorNight: 'from-slate-950 via-blue-950 to-slate-900',
    gradientDay: 'from-blue-400 to-cyan-600',
    gradientNight: 'from-blue-500 to-cyan-800',
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    labelRomanUrdu: 'Halki Barish',
    labelUrdu: 'ہلکی بارش',
    iconName: 'CloudRain',
    category: 'rain',
    bgColorDay: 'from-blue-600/25 via-indigo-500/15 to-slate-700/25',
    bgColorNight: 'from-slate-900 via-blue-950 to-slate-950',
    gradientDay: 'from-blue-400 to-indigo-500',
    gradientNight: 'from-blue-500 to-indigo-700',
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    labelRomanUrdu: 'Barish',
    labelUrdu: 'بارش',
    iconName: 'CloudRain',
    category: 'rain',
    bgColorDay: 'from-blue-700/35 via-indigo-600/25 to-slate-800/35',
    bgColorNight: 'from-slate-950 via-blue-950 to-slate-900',
    gradientDay: 'from-blue-500 to-indigo-600',
    gradientNight: 'from-blue-600 to-slate-700',
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    labelRomanUrdu: 'Musaladhar Barish',
    labelUrdu: 'موسلادھار بارش',
    iconName: 'CloudRain',
    category: 'rain',
    bgColorDay: 'from-indigo-800/40 via-blue-900/30 to-slate-900/40',
    bgColorNight: 'from-slate-950 via-slate-900 to-black',
    gradientDay: 'from-indigo-500 to-blue-700',
    gradientNight: 'from-indigo-600 to-black',
  },
  71: {
    code: 71,
    label: 'Slight Snow',
    labelRomanUrdu: 'Halki Barfbari',
    labelUrdu: 'ہلکی برف باری',
    iconName: 'CloudSnow',
    category: 'snow',
    bgColorDay: 'from-sky-300/30 via-slate-200/20 to-blue-300/30',
    bgColorNight: 'from-slate-900 via-blue-950 to-slate-950',
    gradientDay: 'from-sky-300 to-indigo-300',
    gradientNight: 'from-blue-300 to-slate-400',
  },
  73: {
    code: 73,
    label: 'Moderate Snow',
    labelRomanUrdu: 'Barfbari',
    labelUrdu: 'برف باری',
    iconName: 'CloudSnow',
    category: 'snow',
    bgColorDay: 'from-slate-300/35 via-sky-300/25 to-blue-400/35',
    bgColorNight: 'from-slate-900 via-sky-950 to-slate-950',
    gradientDay: 'from-sky-200 to-slate-300',
    gradientNight: 'from-sky-400 to-slate-300',
  },
  75: {
    code: 75,
    label: 'Heavy Snow',
    labelRomanUrdu: 'Shadeed Barfbari',
    labelUrdu: 'شدید برف باری',
    iconName: 'CloudSnow',
    category: 'snow',
    bgColorDay: 'from-slate-400/40 via-sky-400/30 to-blue-500/40',
    bgColorNight: 'from-slate-950 via-slate-900 to-blue-950',
    gradientDay: 'from-slate-200 to-blue-200',
    gradientNight: 'from-slate-300 to-blue-400',
  },
  80: {
    code: 80,
    label: 'Slight Showers',
    labelRomanUrdu: 'Halke Chhinte',
    labelUrdu: 'ہلکے چھینٹے',
    iconName: 'CloudRain',
    category: 'rain',
    bgColorDay: 'from-blue-500/25 via-sky-500/15 to-slate-600/25',
    bgColorNight: 'from-slate-900 via-blue-950 to-slate-950',
    gradientDay: 'from-blue-400 to-sky-500',
    gradientNight: 'from-blue-500 to-slate-600',
  },
  81: {
    code: 81,
    label: 'Moderate Showers',
    labelRomanUrdu: 'Barish ke Chhinte',
    labelUrdu: 'بارش کی بوچھاڑ',
    iconName: 'CloudRain',
    category: 'rain',
    bgColorDay: 'from-blue-600/30 via-indigo-500/20 to-slate-700/30',
    bgColorNight: 'from-slate-950 via-indigo-950 to-slate-900',
    gradientDay: 'from-blue-500 to-indigo-600',
    gradientNight: 'from-indigo-500 to-slate-700',
  },
  82: {
    code: 82,
    label: 'Violent Showers',
    labelRomanUrdu: 'Shadeed Bochar',
    labelUrdu: 'شدید بوچھاڑ',
    iconName: 'CloudRain',
    category: 'rain',
    bgColorDay: 'from-indigo-700/40 via-blue-800/30 to-slate-900/40',
    bgColorNight: 'from-black via-slate-950 to-indigo-950',
    gradientDay: 'from-indigo-600 to-blue-800',
    gradientNight: 'from-indigo-700 to-black',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    labelRomanUrdu: 'Gharaj Chamak ke sath Toofan',
    labelUrdu: 'گرج چمک کا طوفان',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    bgColorDay: 'from-amber-600/25 via-purple-700/30 to-slate-900/45',
    bgColorNight: 'from-purple-950 via-slate-950 to-black',
    gradientDay: 'from-amber-400 to-purple-600',
    gradientNight: 'from-purple-500 to-amber-400',
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Slight Hail',
    labelRomanUrdu: 'Toofan aur Halke Olay',
    labelUrdu: 'طوفان اور ہلکے اولے',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    bgColorDay: 'from-violet-700/35 via-purple-800/30 to-slate-900/50',
    bgColorNight: 'from-violet-950 via-slate-950 to-black',
    gradientDay: 'from-violet-400 to-purple-600',
    gradientNight: 'from-violet-500 to-amber-500',
  },
  99: {
    code: 99,
    label: 'Thunderstorm with Heavy Hail',
    labelRomanUrdu: 'Shadeed Toofan aur Olay',
    labelUrdu: 'شدید طوفان اور اولے',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    bgColorDay: 'from-red-800/35 via-purple-900/40 to-slate-950/60',
    bgColorNight: 'from-red-950 via-purple-950 to-black',
    gradientDay: 'from-red-500 to-purple-700',
    gradientNight: 'from-red-600 to-purple-900',
  },
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return (
    WEATHER_CODES[code] || {
      code,
      label: 'Partly Cloudy',
      labelRomanUrdu: 'Juzwi Badal',
      labelUrdu: 'جزوی بادل',
      iconName: 'Cloud',
      category: 'cloudy',
      bgColorDay: 'from-blue-500/20 via-slate-400/15 to-cyan-600/20',
      bgColorNight: 'from-slate-900 via-slate-800 to-indigo-950',
      gradientDay: 'from-blue-400 to-slate-400',
      gradientNight: 'from-slate-400 to-indigo-400',
    }
  );
}

// Convert Celsius to Fahrenheit
export function convertTemp(celsius: number, unit: 'metric' | 'imperial'): number {
  if (unit === 'imperial') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

// Format wind speed
export function convertWindSpeed(kmh: number, unit: 'metric' | 'imperial'): { value: number; unitLabel: string } {
  if (unit === 'imperial') {
    return { value: Math.round(kmh * 0.621371), unitLabel: 'mph' };
  }
  return { value: Math.round(kmh), unitLabel: 'km/h' };
}

// Format pressure
export function convertPressure(hPa: number, unit: 'metric' | 'imperial'): { value: string; unitLabel: string } {
  if (unit === 'imperial') {
    return { value: (hPa * 0.02953).toFixed(2), unitLabel: 'inHg' };
  }
  return { value: Math.round(hPa).toString(), unitLabel: 'hPa' };
}

// Wind direction degrees to compass cardinal
export function degreesToCardinal(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

// AQI severity levels and recommendations
export function getAQILevel(aqi: number): {
  level: string;
  levelUrdu: string;
  levelRomanUrdu: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
  advice: string;
} {
  if (aqi <= 50) {
    return {
      level: 'Good',
      levelUrdu: 'بہترین',
      levelRomanUrdu: 'Behtareen / Umda',
      color: '#10b981', // emerald-500
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      description: 'Air quality is satisfactory and poses little or no risk.',
      advice: 'Ideal weather for outdoor activities, sports, and fresh air.',
    };
  } else if (aqi <= 100) {
    return {
      level: 'Moderate',
      levelUrdu: 'معتدل',
      levelRomanUrdu: 'Moutadil',
      color: '#f59e0b', // amber-500
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      description: 'Air quality is acceptable; unusually sensitive people should consider limiting prolonged outdoor exertion.',
      advice: 'Comfortable for most people. Sensitive individuals may take short breaks.',
    };
  } else if (aqi <= 150) {
    return {
      level: 'Unhealthy for Sensitive Groups',
      levelUrdu: 'حساس افراد کے لیے مضر',
      levelRomanUrdu: 'Hassaas Afrad ke liye Nuqsandah',
      color: '#f97316', // orange-500
      textColor: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      description: 'Members of sensitive groups may experience health effects.',
      advice: 'People with asthma or heart conditions should reduce heavy outdoor exertion.',
    };
  } else if (aqi <= 200) {
    return {
      level: 'Unhealthy',
      levelUrdu: 'مضر صحت',
      levelRomanUrdu: 'Nuqsandah / Kharab',
      color: '#ef4444', // red-500
      textColor: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      description: 'Everyone may begin to experience health effects; sensitive groups may experience more serious effects.',
      advice: 'Wear an N95 mask outside, keep windows closed, run air purifier.',
    };
  } else if (aqi <= 300) {
    return {
      level: 'Very Unhealthy',
      levelUrdu: 'بہت زیادہ مضر صحت',
      levelRomanUrdu: 'Bohot Zyada Kharab',
      color: '#a855f7', // purple-500
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      description: 'Health alert: The risk of health effects is increased for everyone.',
      advice: 'Avoid all outdoor physical activity. Stay indoors with sealed windows.',
    };
  } else {
    return {
      level: 'Hazardous',
      levelUrdu: 'انتہائی خطرناک',
      levelRomanUrdu: 'Khatarnaak',
      color: '#881337', // rose-950 / deep maroon
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/20',
      borderColor: 'border-rose-500/40',
      description: 'Health warning of emergency conditions: Everyone is more likely to be affected.',
      advice: 'Emergency precautions needed. Remain inside at all times.',
    };
  }
}

// UV Index severity levels
export function getUVLevel(uv: number): {
  level: string;
  levelUrdu: string;
  levelRomanUrdu: string;
  color: string;
  textColor: string;
  advice: string;
} {
  if (uv <= 2) {
    return {
      level: 'Low',
      levelUrdu: 'کم',
      levelRomanUrdu: 'Kam',
      color: '#10b981',
      textColor: 'text-emerald-400',
      advice: 'Minimal danger from sun rays. Sunscreen optional.',
    };
  } else if (uv <= 5) {
    return {
      level: 'Moderate',
      levelUrdu: 'درمیانہ',
      levelRomanUrdu: 'Darmiyana',
      color: '#f59e0b',
      textColor: 'text-amber-400',
      advice: 'Wear sunglasses, hat, and SPF 30+ sunscreen around midday.',
    };
  } else if (uv <= 7) {
    return {
      level: 'High',
      levelUrdu: 'زیادہ',
      levelRomanUrdu: 'Zyada',
      color: '#f97316',
      textColor: 'text-orange-400',
      advice: 'Protection essential. Seek shade during peak midday hours.',
    };
  } else if (uv <= 10) {
    return {
      level: 'Very High',
      levelUrdu: 'بہت زیادہ',
      levelRomanUrdu: 'Bohot Zyada',
      color: '#ef4444',
      textColor: 'text-red-400',
      advice: 'Extra precaution: Unprotected skin can burn quickly. Use SPF 50+.',
    };
  } else {
    return {
      level: 'Extreme',
      levelUrdu: 'انتہائی شدید',
      levelRomanUrdu: 'Intehayi Shadeed',
      color: '#a855f7',
      textColor: 'text-purple-400',
      advice: 'Avoid sun exposure between 10 AM and 4 PM. Skin can burn in minutes.',
    };
  }
}
