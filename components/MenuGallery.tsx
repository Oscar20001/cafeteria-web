'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// 🔴 AQUÍ SE CONFIGURAN LAS IMÁGENES DEL MENÚ
// Cuando tengas las URLs reales o los archivos en la carpeta public/, actualiza esta lista.
const menuItems = Array.from({ length: 11 }).map((_, i) => ({
  id: i + 1,
  title: `Platillo ${i + 1}`,
  // 🔴 REEMPLAZA ESTA URL CON LA RUTA DE TU IMAGEN (ej: "/images/menu-1.jpg")
  image: `https://placehold.co/600x800/png?text=Menu+Item+${i + 1}`, 
}));

export default function MenuGallery() {
  return (
    <section id="menu" className="py-20 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-800 mb-4 font-serif">Nuestro Menú</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Descubre nuestra selección de platillos y bebidas preparados con los mejores ingredientes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl shadow-lg aspect-[3/4]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized // For external placeholder images
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <h3 className="text-white text-xl font-bold">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
