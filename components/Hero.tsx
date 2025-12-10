'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HERO_VIDEOS = [
  '/videos/cafe-hero-1.mp4',
  '/videos/cafe-hero-2.0.mp4',
  '/videos/cafe-hero-4.mp4'
];

export default function Hero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-stone-900">
      {/* Video Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-black/50 z-10" /> {/* Overlay */}
        
        {isMounted && (
          <video
            key={currentVideoIndex}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="object-cover w-full h-full absolute top-0 left-0"
            poster="/images/hero-poster.jpg"
          >
            <source src={HERO_VIDEOS[currentVideoIndex]} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-5xl md:text-8xl font-bold mb-2 pb-6 font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 drop-shadow-lg leading-tight"
        >
          Café Alejandría
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className="text-xl md:text-3xl mb-8 max-w-2xl font-light italic text-stone-200"
        >
          Algo Diferente. Una experiencia única en cada taza.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <a 
            href="/order" 
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-xl text-lg border border-amber-400/30"
          >
            Haz tu Pedido Rápido
          </a>
          <a 
            href="/reservas" 
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-xl text-lg border border-amber-400/30"
          >
            Reserva Tu Mesa
          </a>
        </motion.div>
      </div>
    </div>
  );
}
