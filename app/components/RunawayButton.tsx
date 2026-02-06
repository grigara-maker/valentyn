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
  const [isActive, setIsActive] = useState(false); // Imunita prvních 3s
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Optimalizovaná animace pro lepší výkon
  const springConfig = { stiffness: 300, damping: 25, bounce: 0 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const escapeDistance = 15; // ~0.25cm před kurzorem
  const activationRadius = 80; // Tlačítko začne utíkat až když je myš blíž než 80px

  // Aktivovat tlačítko po 3 sekundách (čas pro vyjetí papíru)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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

      // Vypočítat vzdálenost myši od středu tlačítka
      const distanceX = mouseX - buttonCenterX;
      const distanceY = mouseY - buttonCenterY;
      const distanceFromButton = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      // Tlačítko začne utíkat POUZE když je myš dostatečně blízko A je aktivní
      if (isActive && distanceFromButton < activationRadius) {
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
          let newX = x.get() + directionX * escapeDistance;
          let newY = y.get() + directionY * escapeDistance;
          
          // Boundary handling - zajistit že tlačítko zůstane na obrazovce
          const padding = 20;
          
          // Vypočítat budoucí absolutní pozici tlačítka
          const futureLeft = rect.left + (newX - x.get());
          const futureRight = rect.right + (newX - x.get());
          const futureTop = rect.top + (newY - y.get());
          const futureBottom = rect.bottom + (newY - y.get());
          
          // Omezit horizontální pohyb
          if (futureLeft < padding) {
            newX = x.get() + (padding - rect.left);
          } else if (futureRight > window.innerWidth - padding) {
            newX = x.get() + (window.innerWidth - padding - rect.right);
          }
          
          // Omezit vertikální pohyb
          if (futureTop < padding) {
            newY = y.get() + (padding - rect.top);
          } else if (futureBottom > window.innerHeight - padding) {
            newY = y.get() + (window.innerHeight - padding - rect.bottom);
          }
          
          x.set(newX);
          y.set(newY);
        }
      } else {
        setIsHovering(false);
      }

      // Uložit poslední pozici myši
      lastMousePos.current = { x: mouseX, y: mouseY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [x, y, isActive]);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!buttonRef.current || !isActive) return; // Ignorovat kliknutí, pokud není aktivní
    
    const rect = buttonRef.current.getBoundingClientRect();
    
    // Posun náhodným směrem při kliknutí
    const randomAngle = Math.random() * Math.PI * 2;
    let moveX = Math.cos(randomAngle) * escapeDistance * 3;
    let moveY = Math.sin(randomAngle) * escapeDistance * 3;
    
    let newX = x.get() + moveX;
    let newY = y.get() + moveY;
    
    // Boundary handling
    const padding = 20;
    const futureLeft = rect.left + moveX;
    const futureRight = rect.right + moveX;
    const futureTop = rect.top + moveY;
    const futureBottom = rect.bottom + moveY;
    
    // Omezit horizontální pohyb
    if (futureLeft < padding) {
      newX = x.get() + (padding - rect.left);
    } else if (futureRight > window.innerWidth - padding) {
      newX = x.get() + (window.innerWidth - padding - rect.right);
    }
    
    // Omezit vertikální pohyb
    if (futureTop < padding) {
      newY = y.get() + (padding - rect.top);
    } else if (futureBottom > window.innerHeight - padding) {
      newY = y.get() + (window.innerHeight - padding - rect.bottom);
    }
    
    x.set(newX);
    y.set(newY);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      onTouchEnd={handleClick}
      style={{ x: xSpring, y: ySpring, willChange: 'transform' }}
      className="px-6 md:px-8 py-2 md:py-3 bg-zinc-200 text-zinc-700 rounded-full font-semibold transition-colors cursor-pointer select-none min-w-[100px] md:min-w-[120px] text-sm md:text-base"
    >
      {currentMessage}
    </motion.button>
  );
}
