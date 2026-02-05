'use client';

import { useEffect, useRef } from 'react';

interface LyricLine {
  time: number;
  text: string;
}

// POZNÁMKA: Z důvodu autorských práv je zde pouze ukázková struktura.
// Uživatel si musí doplnit plný text písně "Dirty Little Secret" 
// od The All-American Rejects s přesnými časovými značkami.
const lyrics: LyricLine[] = [
  { time: 0, text: '[Instrumental Intro]' },
  { time: 14.5, text: 'Let me know that I\'ve done wrong' },
  { time: 18.2, text: 'When I\'ve known this all along' },
  { time: 21.5, text: 'I go around a time or two' },
  { time: 26.0, text: 'Just to waste my time with you' },
  { time: 29.5, text: 'Tell me all that you\'ve thrown away' },
  { time: 33.0, text: 'Find out games you don\'t wanna play' },
  { time: 36.8, text: 'You are the only one that needs to know' },
  { time: 40.5, text: 'I\'ll keep you my dirty little secret' },
  { time: 44.5, text: 'Don\'t tell anyone or you\'ll be just another regret' },
  { time: 51.5, text: 'My dirty little secret' },
  { time: 53.0, text: 'Who has to know?' },
  // ... pokračování textu písně
  { time: 181, text: '♪ ♪ ♪' }, // konec písně
];

interface LyricsSyncDisplayProps {
  currentTime: number;
}

export default function LyricsSyncDisplay({ currentTime }: LyricsSyncDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Offset pro synchronizaci (lyrics jsou o 5s napřed, takže odečteme 5s)
  const adjustedTime = currentTime - 5;

  // Najít aktuální řádek
  const currentLineIndex = lyrics.findIndex((line, index) => {
    const nextLine = lyrics[index + 1];
    return (
      adjustedTime >= line.time &&
      (!nextLine || adjustedTime < nextLine.time)
    );
  });

  useEffect(() => {
    // Auto-scroll k aktivnímu řádku
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLineIndex]);

  // Zobrazit jen 3 řádky: předchozí, aktuální, následující
  const visibleLines = [
    currentLineIndex - 1,
    currentLineIndex,
    currentLineIndex + 1,
  ].filter(idx => idx >= 0 && idx < lyrics.length);

  return (
    <div
      ref={containerRef}
      className="h-32 overflow-hidden space-y-3 text-center flex flex-col justify-center"
    >
      {visibleLines.map((index) => {
        const line = lyrics[index];
        const isActive = index === currentLineIndex;
        const isPast = index < currentLineIndex;

        return (
          <div
            key={index}
            ref={isActive ? activeLineRef : null}
            className={`transition-all duration-500 ${
              isActive
                ? 'text-red-600 text-2xl font-bold opacity-100'
                : isPast
                ? 'text-zinc-400 text-sm opacity-40'
                : 'text-zinc-600 text-sm opacity-40'
            }`}
          >
            {line.text}
          </div>
        );
      })}
    </div>
  );
}
