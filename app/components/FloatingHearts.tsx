'use client';

import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface HeartData {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export default function FloatingHearts() {
  const hearts = useMemo<HeartData[]>(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 15 + Math.random() * 25,
      opacity: 0.15 + Math.random() * 0.25,
      duration: 8 + Math.random() * 12,
      delay: 0, // Žádný delay - létají hned
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => {
        // Náhodný směr pohybu
        const moveX = (Math.random() - 0.5) * 100;
        const moveY = (Math.random() - 0.5) * 100;
        const rotate = Math.random() * 360;

        return (
          <motion.div
            key={heart.id}
            className="absolute"
            initial={{
              x: `${heart.x}vw`,
              y: `${heart.y}vh`,
              rotate: 0,
              scale: 1,
            }}
            animate={{
              x: [`${heart.x}vw`, `${heart.x + moveX}vw`, `${heart.x}vw`],
              y: [`${heart.y}vh`, `${heart.y + moveY}vh`, `${heart.y}vh`],
              rotate: [0, rotate, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: 'easeInOut',
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
          </motion.div>
        );
      })}
    </div>
  );
}
