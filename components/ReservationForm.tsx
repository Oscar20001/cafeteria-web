'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ReservationForm() {
  return (
    <section id="reservas" className="py-24 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-[#1f1f1f] shadow-2xl"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif"
            >
              Reserva tu Mesa
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-stone-300 mb-8 max-w-2xl mx-auto font-light"
            >
              Asegura tu lugar para desayunos, comidas, cenas o una tarde de café.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col items-center gap-6"
            >
              <p className="text-stone-400 text-sm md:text-base">
                Elige la fecha, hora y número de personas para tu visita.
              </p>

              {/* TODO: Conectar con la página real de reservas cuando esté lista */}
              <Link 
                href="/reservas" 
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full hover:from-amber-500 hover:to-amber-600 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:-translate-y-1"
              >
                <span className="mr-2">Ir a Reservar</span>
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
