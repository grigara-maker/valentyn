'use client';

import { Heart } from 'lucide-react';
import { useMemo } from 'react';

interface HeartData {
  id: number;
  left: string;
  size: number;
  delay: number;
  opacity: number;
  duration: number;
}

export default function FloatingHearts() {
  const hearts = useMemo<HeartData[]>(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 20 + Math.random() * 30, // 20-50px
      delay: Math.random() * 20, // 0-20s
      opacity: 0.1 + Math.random() * 0.2, // 0.1-0.3
      duration: 15 + Math.random() * 10, // 15-25s
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-0"
          style={{
            left: heart.left,
            animation: `floatUp ${heart.duration}s linear infinite`,
            animationDelay: `${heart.delay}s`,
            // @ts-ignore
            '--target-opacity': heart.opacity,
          }}
        >
          <Heart
            size={heart.size}
            className="text-red-600 fill-red-600"
            style={{
              opacity: heart.opacity,
              filter: 'blur(1px)',
            }}
          />
        </div>
      ))}
    </div>
  );
}
