import React, { useEffect, useRef } from 'react';

interface WeatherBackgroundCanvasProps {
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  isDay: boolean;
}

export const WeatherBackgroundCanvas: React.FC<WeatherBackgroundCanvasProps> = ({ category, isDay }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle setup based on category
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      alphaSpeed: number;
      length?: number;
    }

    const particles: Particle[] = [];
    const count =
      category === 'rain' || category === 'drizzle'
        ? 120
        : category === 'snow'
        ? 80
        : category === 'thunderstorm'
        ? 140
        : isDay
        ? 35 // sun motes / floating light
        : 65; // night stars

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx:
          category === 'snow'
            ? (Math.random() - 0.5) * 1.2
            : category === 'rain' || category === 'thunderstorm'
            ? -1.5 + (Math.random() - 0.5)
            : (Math.random() - 0.5) * 0.4,
        vy:
          category === 'rain'
            ? 12 + Math.random() * 8
            : category === 'drizzle'
            ? 5 + Math.random() * 4
            : category === 'thunderstorm'
            ? 16 + Math.random() * 10
            : category === 'snow'
            ? 1 + Math.random() * 2
            : (Math.random() - 0.5) * 0.3,
        size:
          category === 'rain' || category === 'drizzle' || category === 'thunderstorm'
            ? Math.random() * 1.5 + 0.8
            : category === 'snow'
            ? Math.random() * 3 + 1.2
            : Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        alphaSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        length: category === 'rain' ? 14 + Math.random() * 12 : category === 'thunderstorm' ? 22 + Math.random() * 16 : 8,
      });
    }

    let lightningTimer = 0;
    let lightningOpacity = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Thunderstorm random lightning flash
      if (category === 'thunderstorm') {
        lightningTimer++;
        if (lightningTimer > 180 && Math.random() < 0.03) {
          lightningOpacity = 0.35 + Math.random() * 0.3;
          lightningTimer = 0;
        }
        if (lightningOpacity > 0.01) {
          ctx.fillStyle = `rgba(224, 231, 255, ${lightningOpacity})`;
          ctx.fillRect(0, 0, width, height);
          lightningOpacity *= 0.84;
        }
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Twinkle
        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.85 || p.alpha < 0.15) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // Wrap around boundaries
        if (category === 'rain' || category === 'drizzle' || category === 'thunderstorm' || category === 'snow') {
          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * (width + 100);
          }
          if (p.x < -20) p.x = width + 20;
        } else {
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.save();
        if (category === 'rain' || category === 'drizzle' || category === 'thunderstorm') {
          ctx.strokeStyle = `rgba(186, 230, 253, ${p.alpha * 0.6})`;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + (p.length || 10));
          ctx.stroke();
        } else if (category === 'snow') {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.75})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (!isDay) {
          // Stars at night
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Floating golden/warm light motes in day
          ctx.fillStyle = `rgba(254, 240, 138, ${p.alpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [category, isDay]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full z-0 opacity-80"
    />
  );
};
