'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function RunawayButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Pomalejší animace - nižší stiffness a vyšší damping
  const springConfig = { stiffness: 100, damping: 15 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const safeZone = 80; // Menší vzdálenost - drží se blíž myši
  const escapeForce = 60; // Menší síla odskoku pro pomalejší pohyb

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Vypočítat vzdálenost
      const deltaX = buttonCenterX - mouseX;
      const deltaY = buttonCenterY - mouseY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Utíká jen když je myš blízko
      if (distance < safeZone) {
        setIsHovering(true);
        
        // Normalizovaný vektor úniku
        const directionX = deltaX / distance;
        const directionY = deltaY / distance;

        // Vypočítat novou pozici - menší skoky
        let newX = x.get() + directionX * escapeForce;
        let newY = y.get() + directionY * escapeForce;

        // Boundary handling - zajistit, že tlačítko zůstane na obrazovce
        const padding = 50;
        const maxX = window.innerWidth / 2 - rect.width / 2 - padding;
        const maxY = window.innerHeight / 2 - rect.height / 2 - padding;

        newX = Math.max(-maxX, Math.min(maxX, newX));
        newY = Math.max(-maxY, Math.min(maxY, newY));

        x.set(newX);
        y.set(newY);
      } else if (distance > safeZone + 50) {
        setIsHovering(false);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!buttonRef.current) return;
      
      const touch = e.touches[0];
      const rect = buttonRef.current.getBoundingClientRect();
      
      const touchX = touch.clientX;
      const touchY = touch.clientY;
      
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      
      const deltaX = buttonCenterX - touchX;
      const deltaY = buttonCenterY - touchY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance < safeZone + 30) {
        const directionX = deltaX / distance;
        const directionY = deltaY / distance;
        
        let newX = x.get() + directionX * escapeForce;
        let newY = y.get() + directionY * escapeForce;
        
        const padding = 50;
        const maxX = window.innerWidth / 2 - rect.width / 2 - padding;
        const maxY = window.innerHeight / 2 - rect.height / 2 - padding;
        
        newX = Math.max(-maxX, Math.min(maxX, newX));
        newY = Math.max(-maxY, Math.min(maxY, newY));
        
        x.set(newX);
        y.set(newY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [x, y]);

  return (
    <motion.button
      ref={buttonRef}
      style={{ x: xSpring, y: ySpring }}
      className="px-8 py-3 bg-zinc-200 text-zinc-700 rounded-full font-semibold hover:bg-zinc-300 transition-colors cursor-pointer"
    >
      Ne
    </motion.button>
  );
}
