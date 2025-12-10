'use client';

import { Phone, MapPin, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-none outline-none relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-6 font-serif text-amber-500">Café Alejandría</h3>
            <p className="text-stone-400 mb-6 leading-relaxed">
              Algo Diferente. Una experiencia única en cada taza, preparada con pasión y los mejores granos.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-stone-400 hover:text-amber-500 transition-colors"><Facebook /></a>
              <a href="#" className="text-stone-400 hover:text-amber-500 transition-colors"><Instagram /></a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-serif text-amber-100">Contáctanos</h3>
            <div className="flex flex-col items-center md:items-start space-y-4">
              <div className="flex items-center space-x-3 text-stone-300">
                <div className="bg-stone-900 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-amber-500" />
                </div>
                <a href="tel:+529621896327" className="hover:text-white transition-colors font-medium">962 189 6327</a>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-serif text-amber-100">Ubicación</h3>
            <div className="flex items-start justify-center md:justify-start space-x-3 text-stone-300">
              <div className="bg-stone-900 p-2 rounded-full mt-1">
                <MapPin className="h-5 w-5 text-amber-500 flex-shrink-0" />
              </div>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=14.892521168591774,-92.250983076492" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors text-sm leading-relaxed text-left"
              >
                Av. Las Palmas, Los Ciruelos esquina,<br/>
                Los Laureles II, 30780<br/>
                Tapachula de Córdova y Ordóñez, Chis.
              </a>
            </div>
          </div>

        </div>

        <div className="pt-12 text-center text-stone-600 text-sm border-none">
          <p>© 2025 Café Alejandría. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
