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

  // Offset pro synchronizaci (lyrics jsou o 2s napřed, takže odečteme 2s)
  const adjustedTime = currentTime - 2;

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
  const prevLine = currentLineIndex > 0 ? lyrics[currentLineIndex - 1] : null;
  const currentLine = lyrics[currentLineIndex];
  const nextLine = currentLineIndex < lyrics.length - 1 ? lyrics[currentLineIndex + 1] : null;

  return (
    <div
      ref={containerRef}
      className="relative h-40 overflow-hidden text-center"
    >
      {/* Předchozí řádek */}
      {prevLine && (
        <div className="absolute top-2 left-0 right-0 transition-all duration-500 text-zinc-400 text-sm opacity-40">
          {prevLine.text}
        </div>
      )}
      
      {/* Aktuální řádek */}
      {currentLine && (
        <div 
          ref={activeLineRef}
          className="absolute top-1/2 -translate-y-1/2 left-0 right-0 transition-all duration-500 text-red-600 text-2xl font-bold opacity-100"
        >
          {currentLine.text}
        </div>
      )}
      
      {/* Následující řádek */}
      {nextLine && (
        <div className="absolute bottom-2 left-0 right-0 transition-all duration-500 text-zinc-600 text-sm opacity-40">
          {nextLine.text}
        </div>
      )}
    </div>
  );
}
