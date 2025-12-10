'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Award, Smile, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoyaltyPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de envío a backend
    // TODO: Conectar con backend real o base de datos aquí
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLoading(false);
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#F5F5DC]"> {/* Fondo crema/beige cálido */}
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-stone-800 font-serif mb-4">
              Programa de Lealtad
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Únete a la familia de Cafetería Alejandría y disfruta de recompensas exclusivas en cada visita.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Columna Izquierda: Beneficios e Ilustraciones */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white p-6 rounded-2xl shadow-md flex items-start space-x-4 border border-stone-100">
              <div className="bg-amber-100 p-3 rounded-full">
                <Coffee className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Acumula Puntos</h3>
                <p className="text-stone-600">
                  Gana puntos por cada café, postre o platillo que disfrutes con nosotros.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md flex items-start space-x-4 border border-stone-100">
              <div className="bg-amber-100 p-3 rounded-full">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Premios Exclusivos</h3>
                <p className="text-stone-600">
                  Canjea tus puntos por bebidas gratis, descuentos especiales y sorpresas de cumpleaños.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md flex items-start space-x-4 border border-stone-100">
              <div className="bg-amber-100 p-3 rounded-full">
                <Smile className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Comunidad Feliz</h3>
                <p className="text-stone-600">
                  Sé parte de nuestra comunidad de amantes del café y recibe invitaciones a eventos de cata.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Columna Derecha: Formulario de Registro */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-stone-200 relative overflow-hidden">
              {/* Decoración sutil */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 z-0" />
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-stone-800 mb-6 font-serif">
                  Regístrate Ahora
                </h2>

                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">¡Registro Exitoso!</h3>
                    <p className="text-green-700 leading-relaxed">
                      Gracias por registrarte en Cafetería Alejandría. Con este registro podrás usar tu número de teléfono y, cada vez que hagas una compra, recibirás un premio especial.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="mt-6 text-sm text-green-600 font-semibold hover:text-green-800 underline"
                    >
                      Registrar a otra persona
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej. Juan Pérez"
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-stone-50"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ej. juan@email.com"
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-stone-50"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">
                        Número de Teléfono
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ej. 55 1234 5678"
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-stone-50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg transform transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                      {loading ? 'Procesando...' : 'Unirme al Programa'}
                    </button>
                    
                    <p className="text-xs text-center text-stone-500 mt-4">
                      Al registrarte aceptas recibir notificaciones sobre tus puntos y promociones de Cafetería Alejandría.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
