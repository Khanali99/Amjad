import React from 'react';
import {
  Sun,
  SunMedium,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Moon,
  CloudMoon,
} from 'lucide-react';
import { getWeatherInfo } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = true,
  className = 'w-6 h-6',
  size,
}) => {
  const info = getWeatherInfo(code);

  if (!isDay && (code === 0 || code === 1)) {
    return <Moon className={className} size={size} />;
  }
  if (!isDay && code === 2) {
    return <CloudMoon className={className} size={size} />;
  }

  switch (info.iconName) {
    case 'Sun':
      return <Sun className={className} size={size} />;
    case 'SunMedium':
      return <SunMedium className={className} size={size} />;
    case 'CloudSun':
      return <CloudSun className={className} size={size} />;
    case 'Cloud':
      return <Cloud className={className} size={size} />;
    case 'CloudFog':
      return <CloudFog className={className} size={size} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={className} size={size} />;
    case 'CloudRain':
      return <CloudRain className={className} size={size} />;
    case 'CloudSnow':
      return <CloudSnow className={className} size={size} />;
    case 'CloudLightning':
      return <CloudLightning className={className} size={size} />;
    default:
      return <Sun className={className} size={size} />;
  }
};
