'use client';

import { Heart } from 'lucide-react';
import { useMemo } from 'react';

interface HeartData {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
  delay: number;
  opacity: number;
  duration: number;
  rotation: number;
}

export default function FloatingHearts() {
  const hearts = useMemo<HeartData[]>(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      
      return {
        id: i,
        startX,
        startY,
        endX: startX + (Math.random() - 0.5) * 40, // Pohyb ±20%
        endY: startY + (Math.random() - 0.5) * 40,
        size: 20 + Math.random() * 30, // 20-50px
        delay: Math.random() * 20, // 0-20s
        opacity: 0.1 + Math.random() * 0.2, // 0.1-0.3
        duration: 10 + Math.random() * 15, // 10-25s
        rotation: Math.random() * 360,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.startX}%`,
            top: `${heart.startY}%`,
            animation: `floatRandom-${heart.id} ${heart.duration}s ease-in-out infinite`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          <Heart
            size={heart.size}
            className="text-red-600 fill-red-600"
            style={{
              opacity: heart.opacity,
              filter: 'blur(1px)',
              transform: `rotate(${heart.rotation}deg)`,
            }}
          />
          <style jsx>{`
            @keyframes floatRandom-${heart.id} {
              0%, 100% {
                transform: translate(0, 0) rotate(${heart.rotation}deg) scale(1);
                opacity: ${heart.opacity};
              }
              25% {
                transform: translate(${(heart.endX - heart.startX) * 0.5}vw, ${(heart.endY - heart.startY) * 0.5}vh) rotate(${heart.rotation + 45}deg) scale(1.1);
                opacity: ${heart.opacity * 1.5};
              }
              50% {
                transform: translate(${heart.endX - heart.startX}vw, ${heart.endY - heart.startY}vh) rotate(${heart.rotation + 90}deg) scale(1.2);
                opacity: ${heart.opacity};
              }
              75% {
                transform: translate(${(heart.endX - heart.startX) * 0.5}vw, ${-(heart.endY - heart.startY) * 0.3}vh) rotate(${heart.rotation + 135}deg) scale(1.1);
                opacity: ${heart.opacity * 1.5};
              }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
