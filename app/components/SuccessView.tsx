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
    // Google Calendar link (jednodušší než .ics)
    const event = {
      title: 'valentýnské rande',
      description: 'jupí, bude randíčko!',
      location: '',
      startDate: '20260214T180000',
      endDate: '20260214T230000',
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.startDate}/${event.endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
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
              <div className="relative bg-[#DC2626] p-6 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="text-3xl font-bold text-center">
                  jupí, bude randíčko
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                {/* Lyrics Display */}
                <div className="bg-zinc-50 rounded-xl p-6">
                  <h3 className="text-center text-2xl font-bold mb-6 text-zinc-900">navždy mým malým špinavým tajemstvím</h3>
                  <LyricsSyncDisplay currentTime={currentTime} />
                </div>

                {/* Love Message */}
                <h3 className="text-center text-2xl font-bold text-zinc-900">miluju tě, bby</h3>

                {/* Calendar Button */}
                <motion.button
                  onClick={handleAddToCalendar}
                  className="w-full px-6 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar size={24} />
                  <span>přidat do kalendáře, ať nezapomeneš</span>
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
