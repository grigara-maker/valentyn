'use client';

import { useState } from 'react';
import FloatingHearts from './components/FloatingHearts';
import TranceEnvelope from './components/TranceEnvelope';
import SuccessView from './components/SuccessView';

export default function Home() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Ambientní pozadí s plovoucími srdíčky */}
      <FloatingHearts />

      {/* Hlavní obsah - obálka */}
      <div className="relative z-10">
        <TranceEnvelope onAccept={() => setShowSuccess(true)} />
      </div>

      {/* Modal s oslavou */}
      <SuccessView 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)} 
      />
    </div>
  );
}
