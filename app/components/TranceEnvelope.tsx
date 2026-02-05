'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import RunawayButton from './RunawayButton';

interface TranceEnvelopeProps {
  onAccept: () => void;
}

export default function TranceEnvelope({ onAccept }: TranceEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="relative">
        {/* Obálka */}
        <motion.div
          className="relative cursor-pointer"
          onClick={() => !isOpen && setIsOpen(true)}
          animate={
            isOpen
              ? { scale: 0.8, y: 1000, opacity: 0 }
              : {
                  scale: [1, 1.05, 1],
                  y: 0,
                  opacity: 1,
                }
          }
          transition={
            isOpen
              ? { duration: 1, ease: 'easeIn', delay: 0.5 }
              : {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
          style={{
            filter: isOpen
              ? 'none'
              : 'drop-shadow(0 0 30px rgba(220, 38, 38, 0.6))',
          }}
        >
          {/* SVG Obálka */}
          <svg
            width="300"
            height="200"
            viewBox="0 0 300 200"
            className="relative z-10"
          >
            {/* Zadní strana */}
            <rect x="25" y="50" width="250" height="150" fill="#DC2626" />

            {/* Přední tělo */}
            <path d="M25 50 L150 125 L275 50 L275 200 L25 200 Z" fill="#EF4444" />

            {/* Horní chlopeň */}
            <motion.path
              d="M25 50 L150 125 L275 50 Z"
              fill="#DC2626"
              initial={{ rotateX: 0 }}
              animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{
                transformOrigin: '150px 50px',
                transformStyle: 'preserve-3d',
              }}
            />

            {/* Okraje pro hloubku */}
            <line
              x1="25"
              y1="50"
              x2="150"
              y2="125"
              stroke="#B91C1C"
              strokeWidth="2"
            />
            <line
              x1="275"
              y1="50"
              x2="150"
              y2="125"
              stroke="#B91C1C"
              strokeWidth="2"
            />
          </svg>
        </motion.div>

        {/* Papír s otázkou */}
        <motion.div
          className={`${isOpen ? 'fixed' : 'absolute'} ${isOpen ? 'top-1/2 left-1/2' : 'top-0 left-1/2'} -translate-x-1/2 ${isOpen ? '-translate-y-1/2' : ''} bg-white rounded-lg shadow-2xl p-8 w-[280px] md:w-[320px]`}
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={
            isOpen
              ? { y: 0, opacity: 1, scale: 1, zIndex: 50 }
              : { y: 100, opacity: 0, scale: 0.8, zIndex: 5 }
          }
          transition={{ 
            duration: 0.6, 
            delay: isOpen ? 0.3 : 0, 
            ease: 'easeOut',
            type: 'spring',
            stiffness: 200,
            damping: 20
          }}
          style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        >
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-zinc-900">
              bby, budeš mou valentýnkou? 💕
            </h1>

            <div className="flex flex-row gap-3 justify-center items-center">
              <motion.button
                onClick={onAccept}
                className="px-8 py-3 bg-[#DC2626] text-white rounded-full font-semibold hover:bg-[#B91C1C] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ano
              </motion.button>

              <RunawayButton />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
