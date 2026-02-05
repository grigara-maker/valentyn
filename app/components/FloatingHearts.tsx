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
    // Generovat srdíčka s lepší distribucí po celé obrazovce
    const heartCount = 35;
    const hearts: HeartData[] = [];
    
    // Vytvořit mřížku pro rovnoměrnější rozmístění
    const rows = 7;
    const cols = 5;
    
    for (let i = 0; i < heartCount; i++) {
      if (i < rows * cols) {
        // První srdíčka rozmístit v mřížce
        const row = Math.floor(i / cols);
        const col = i % cols;
        const baseX = (col / cols) * 100;
        const baseY = (row / rows) * 100;
        
        hearts.push({
          id: i,
          x: baseX + Math.random() * (100 / cols),
          y: baseY + Math.random() * (100 / rows),
          size: 15 + Math.random() * 25,
          opacity: 0.15 + Math.random() * 0.25,
          duration: 10 + Math.random() * 10,
          moveX: (Math.random() - 0.5) * 60,
          moveY: (Math.random() - 0.5) * 60,
          rotate: Math.random() * 360,
        });
      }
    }
    
    return hearts;
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
