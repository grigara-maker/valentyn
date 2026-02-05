'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, X, Music } from 'lucide-react';
import LyricsSyncDisplay from './LyricsSyncDisplay';

interface SuccessViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessView({ isOpen, onClose }: SuccessViewProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Spustit konfety
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#DC2626', '#EF4444', '#FF0000', '#FFFFFF', '#FFB6C1'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#DC2626', '#EF4444', '#FF0000', '#FFFFFF', '#FFB6C1'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      // Přehrát hudbu
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.log('Audio autoplay blocked:', err);
        });
      }
    } else {
      // Zastavit hudbu při zavření
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    let animationFrameId: number;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      animationFrameId = requestAnimationFrame(updateTime);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(updateTime);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying]);

  const handleAddToCalendar = () => {
    // Vytvoření iCalendar (.ics) souboru
    const event = {
      title: 'Valentýnské Rande ❤️',
      description: 'Hurá, bude mi ctí! Nezapomeň na Dirty Little Secret.',
      location: 'TBD',
      startDate: new Date('2026-02-14T18:00:00'),
      endDate: new Date('2026-02-14T23:00:00'),
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Valentýn//WebApp//CZ
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@valentyn-app
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(event.startDate)}
DTEND:${formatICSDate(event.endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'valentyn-rande.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatICSDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-red-600 to-pink-600 p-6 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="text-3xl font-bold text-center">
                  Hurááá! 🎉❤️
                </h2>
                <p className="text-center mt-2 text-white/90">
                  Budu moc rád, že budeme spolu! 💕
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                {/* Lyrics Display */}
                <div className="bg-zinc-50 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Music className="text-red-600" size={24} />
                    <h3 className="font-semibold text-lg">Naše písnička</h3>
                  </div>
                  <LyricsSyncDisplay currentTime={currentTime} />
                </div>

                {/* Calendar Button */}
                <motion.button
                  onClick={handleAddToCalendar}
                  className="w-full px-6 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar size={24} />
                  <span>Přidat do kalendáře (14. února 18:00)</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            src="/music/dirty-little-secret.mp3"
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
}
