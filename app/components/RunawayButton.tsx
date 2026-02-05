'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const teasingMessages = [
  'mě nechytíš',
  'snaž se dál',
  'haha',
  'noobe',
  'skill issue',
  'kašli na to bro',
];

export default function RunawayButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('ne');
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Optimalizovaná animace pro lepší výkon
  const springConfig = { stiffness: 300, damping: 25, bounce: 0 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const escapeDistance = 15; // ~0.25cm před kurzorem

  // Easter egg - náhodné hlášky na pozadí
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const showEasterEgg = () => {
      // 40% šance že se zobrazí hláška
      if (Math.random() < 0.4) {
        const randomMsg = teasingMessages[Math.floor(Math.random() * teasingMessages.length)];
        setCurrentMessage(randomMsg);
        
        // Po 2.5 sekundách zpět na "ne"
        setTimeout(() => {
          setCurrentMessage('ne');
        }, 2500);
      }
      
      // Naplánovat další kontrolu za 10-15 sekund
      scheduleNext();
    };

    const scheduleNext = () => {
      const minInterval = 10000; // 10s
      const maxInterval = 15000; // 15s
      const randomInterval = minInterval + Math.random() * (maxInterval - minInterval);
      
      timeoutId = setTimeout(showEasterEgg, randomInterval);
    };
    
    // Začít první kontrolu
    scheduleNext();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Kontrola, zda je kurzor PŘÍMO nad tlačítkem
      const isOverButton = 
        mouseX >= rect.left && 
        mouseX <= rect.right && 
        mouseY >= rect.top && 
        mouseY <= rect.bottom;

      if (isOverButton) {
        setIsHovering(true);
        
        // Vypočítat směr pohybu myši
        const mouseDeltaX = mouseX - lastMousePos.current.x;
        const mouseDeltaY = mouseY - lastMousePos.current.y;
        const mouseMoveDistance = Math.sqrt(mouseDeltaX * mouseDeltaX + mouseDeltaY * mouseDeltaY);
        
        if (mouseMoveDistance > 0) {
          // Normalizovaný směr pohybu myši
          const directionX = mouseDeltaX / mouseMoveDistance;
          const directionY = mouseDeltaY / mouseMoveDistance;
          
          // Tlačítko se posune STEJNÝM směrem jako myš, těsně před ní
          const newX = x.get() + directionX * escapeDistance;
          const newY = y.get() + directionY * escapeDistance;
          
          // Boundary handling
          const padding = 50;
          const maxX = window.innerWidth / 2 - rect.width / 2 - padding;
          const maxY = window.innerHeight / 2 - rect.height / 2 - padding;
          
          x.set(Math.max(-maxX, Math.min(maxX, newX)));
          y.set(Math.max(-maxY, Math.min(maxY, newY)));
        }
      } else {
        setIsHovering(false);
      }

      // Uložit poslední pozici myši
      lastMousePos.current = { x: mouseX, y: mouseY };
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!buttonRef.current) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const rect = buttonRef.current.getBoundingClientRect();
      
      const touchX = touch.clientX;
      const touchY = touch.clientY;
      
      const isOverButton = 
        touchX >= rect.left && 
        touchX <= rect.right && 
        touchY >= rect.top && 
        touchY <= rect.bottom;
      
      if (isOverButton) {
        // Posun náhodným směrem při dotyku
        const randomAngle = Math.random() * Math.PI * 2;
        const moveX = Math.cos(randomAngle) * escapeDistance * 2;
        const moveY = Math.sin(randomAngle) * escapeDistance * 2;
        
        x.set(x.get() + moveX);
        y.set(y.get() + moveY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [x, y]);

  return (
    <motion.button
      ref={buttonRef}
      style={{ x: xSpring, y: ySpring, willChange: 'transform' }}
      className="px-8 py-3 bg-zinc-200 text-zinc-700 rounded-full font-semibold transition-colors cursor-pointer select-none min-w-[120px]"
    >
      {currentMessage}
    </motion.button>
  );
}
