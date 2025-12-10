'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// Configuración de la galería
const GALLERY_IMAGES = [
  { id: 1, src: '/images/gallery/1.jpg', alt: 'Ambiente de la cafetería' },
  { id: 2, src: '/images/gallery/2.jpg', alt: 'Nuestros postres' },
  { id: 3, src: '/images/gallery/3.jpg', alt: 'Preparación de café' },
  { id: 4, src: '/images/gallery/4.jpg', alt: 'Detalles del local' },
  { id: 5, src: '/images/gallery/5.jpg', alt: 'Eventos especiales' },
  { id: 6, src: '/images/gallery/6.jpg', alt: 'Terraza' },
];

// Duplicamos las imágenes varias veces para asegurar un scroll infinito fluido
const MARQUEE_IMAGES = [...GALLERY_IMAGES, ...GALLERY_IMAGES, ...GALLERY_IMAGES];

export default function Gallery() {
  return (
    <section className="py-24 bg-stone-950 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-amber-500">
            Galería de Momentos
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto text-lg">
            Un vistazo a la experiencia Café Alejandría.
          </p>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full flex overflow-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{
            x: ['0%', '-33.33%'], // Move one third (since we tripled the array)
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40, // Velocidad del scroll (más alto = más lento)
              ease: "linear",
            },
          }}
        >
          {MARQUEE_IMAGES.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="relative w-[300px] h-[400px] md:w-[350px] md:h-[450px] flex-shrink-0 rounded-2xl overflow-hidden group cursor-pointer"
            >
               {/* Placeholder visual */}
               <div className="absolute inset-0 bg-stone-900 flex items-center justify-center text-stone-700 font-serif text-2xl">
                <span>Foto {item.id}</span>
              </div>

              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                onError={(e) => {
                   (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              
              {/* Overlay Gradient & Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-2">Café Alejandría</p>
                  <h3 className="text-white font-serif text-2xl">{item.alt}</h3>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Gradient Edges for smooth fade */}
      <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-stone-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-stone-950 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
