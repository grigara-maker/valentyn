'use client';

import { Heart } from 'lucide-react';
import { useMemo } from 'react';

interface HeartData {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  moveX: number;
  moveY: number;
  rotate: number;
}

export default function FloatingHearts() {
  const hearts = useMemo<HeartData[]>(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 15 + Math.random() * 25,
      opacity: 0.15 + Math.random() * 0.25,
      duration: 10 + Math.random() * 10,
      moveX: (Math.random() - 0.5) * 80,
      moveY: (Math.random() - 0.5) * 80,
      rotate: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            animation: `float-heart-${heart.id} ${heart.duration}s ease-in-out infinite`,
            willChange: 'transform',
          }}
        >
          <Heart
            size={heart.size}
            className="text-red-600 fill-red-600"
            style={{
              opacity: heart.opacity,
              filter: 'blur(0.5px)',
            }}
          />
          <style jsx>{`
            @keyframes float-heart-${heart.id} {
              0%, 100% {
                transform: translate(0, 0) rotate(0deg) scale(1);
              }
              50% {
                transform: translate(${heart.moveX}px, ${heart.moveY}px) rotate(${heart.rotate}deg) scale(1.15);
              }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
