'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';
import { MenuConfig, MenuKey } from '@/types/menu';

const STATIC_MENU_ITEMS: { id: MenuKey; title: string; image: string }[] = [
  { id: 'desayunos', title: 'Desayunos', image: 'https://placehold.co/600x800/png?text=Desayunos' },
  { id: 'comidas', title: 'Comidas', image: 'https://placehold.co/600x800/png?text=Comidas' },
  { id: 'bebidasCalientes', title: 'Bebidas Calientes', image: 'https://placehold.co/600x800/png?text=Bebidas+Calientes' },
  { id: 'bebidasFrias', title: 'Bebidas Frías', image: 'https://placehold.co/600x800/png?text=Bebidas+Frias' },
  { id: 'postres', title: 'Postres', image: 'https://placehold.co/600x800/png?text=Postres' },
  { id: 'promociones', title: 'Promociones', image: 'https://placehold.co/600x800/png?text=Promociones' },
];

export default function MenuGallery() {
  const [menuConfigs, setMenuConfigs] = useState<MenuConfig[]>([]);
  const [selectedMenuUrl, setSelectedMenuUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch('/api/menu-config');
        if (res.ok) {
          const data = await res.json();
          setMenuConfigs(data);
        }
      } catch (error) {
        console.error('Error loading menus:', error);
      }
    };
    fetchMenus();
  }, []);

  const handleCardClick = (key: MenuKey) => {
    const config = menuConfigs.find(c => c.key === key);
    
    if (config && config.heyzineUrl) {
      setSelectedMenuUrl(config.heyzineUrl);
    } else {
      alert('Este menú aún no está configurado.');
    }
  };

  return (
    <section id="menu" className="py-20 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-800 mb-4 font-serif">Nuestro Menú</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Descubre nuestra selección de platillos y bebidas preparados con los mejores ingredientes.
            Haz clic en una tarjeta para ver el menú interactivo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {STATIC_MENU_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => handleCardClick(item.id)}
              className="group relative overflow-hidden rounded-xl shadow-lg aspect-[3/4] cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <h3 className="text-white text-xl font-bold">{item.title}</h3>
                <p className="text-amber-400 text-sm ml-2 mb-1">(Ver Menú)</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal for Heyzine Flipbook */}
      <AnimatePresence>
        {selectedMenuUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedMenuUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl h-[85vh] bg-white rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMenuUrl(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <iframe
                src={selectedMenuUrl}
                className="w-full h-full border-0"
                allowFullScreen
                title="Menú Interactivo"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
