'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface HotDrinksMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HotDrinksMenu({ isOpen, onClose }: HotDrinksMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-6xl h-[85vh] bg-white rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <iframe
              src="https://heyzine.com/flip-book/41ae9eb188.html"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              title="Menú de Bebidas Calientes"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
