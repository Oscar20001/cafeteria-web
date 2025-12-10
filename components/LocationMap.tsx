'use client';

import { MapPin, Phone, Clock } from 'lucide-react';

export default function LocationMap() {
  return (
    <section 
      className="py-20 relative z-0 overflow-hidden"
      style={{ 
        marginTop: '-1px', 
        paddingTop: '80px', 
        borderTopLeftRadius: 0, 
        borderTopRightRadius: 0,
        borderTop: 'none',
        backgroundImage: "url('/images/gallery/Local De Visitanos cafe.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/75 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 font-serif text-white">Nuestra Ubicación</h2>
          <p className="text-stone-200 max-w-2xl mx-auto">
            Visítanos y disfruta del mejor café en un ambiente relajado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 bg-stone-900 rounded-2xl shadow-xl overflow-hidden">
          {/* Contact Info */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-stone-900 text-white">
            <h3 className="text-2xl font-bold mb-8 font-serif text-amber-500">Información de Contacto</h3>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-stone-800 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Dirección</h4>
                  <p className="text-stone-300 leading-relaxed">
                    Av. Las Palmas, Los Ciruelos esquina,<br />
                    Los Laureles II, 30780<br />
                    Tapachula de Córdova y Ordóñez, Chis.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-stone-800 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Teléfono</h4>
                  <p className="text-stone-300">
                    <a href="tel:+529621896327" className="hover:text-amber-500 transition-colors">
                      962 189 6327
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-stone-800 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Horario</h4>
                  <ul className="text-stone-300 text-sm space-y-1">
                    <li className="flex justify-between w-48"><span>Lunes:</span> <span>7:30 AM - 10:30 PM</span></li>
                    <li className="flex justify-between w-48"><span>Martes:</span> <span>7:30 AM - 10:30 PM</span></li>
                    <li className="flex justify-between w-48"><span>Miércoles:</span> <span>7:30 AM - 10:30 PM</span></li>
                    <li className="flex justify-between w-48"><span>Jueves:</span> <span>7:30 AM - 10:30 PM</span></li>
                    <li className="flex justify-between w-48"><span>Viernes:</span> <span>7:30 AM - 10:30 PM</span></li>
                    <li className="flex justify-between w-48"><span>Sábado:</span> <span>7:30 AM - 10:30 PM</span></li>
                    <li className="flex justify-between w-48"><span>Domingo:</span> <span>7:30 AM - 10:30 PM</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-[400px] md:h-auto w-full relative">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              src="https://maps.google.com/maps?q=14.892521168591774,-92.250983076492&hl=es&z=16&output=embed"
              className="absolute inset-0 w-full h-full"
              title="Ubicación Café Alejandría"
              aria-label="Mapa de ubicación de Café Alejandría"
            >
            </iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
