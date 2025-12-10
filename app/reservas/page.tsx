'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Calendar, Clock, Users, MessageSquare, User, Mail, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ReservationsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    type: 'Desayuno',
    comments: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al reservar');
      }

      setStatus('success');
      setFormData({ 
        name: '', email: '', phone: '', date: '', time: '', guests: 2, type: 'Desayuno', comments: '' 
      });
    } catch (error) {
      setStatus('error');
      setErrorMessage('Hubo un error al procesar tu reserva. Por favor intenta de nuevo.');
    }
  };

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <Navbar />
      
      <div className="pt-24 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Columna Izquierda: Información */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 pt-8"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-amber-500/10 p-4 rounded-full">
                <Coffee className="h-10 w-10 text-amber-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-serif text-white">
                Reserva tu Mesa
              </h1>
            </div>

            <div className="space-y-6 text-stone-300 text-lg leading-relaxed">
              <p className="font-light text-xl text-white">
                Asegura tu lugar para desayunos, comidas, cenas o una tarde de café en <span className="text-amber-500 font-serif">Café Alejandría</span>.
              </p>
              <p>
                Disfruta de un ambiente relajado y elegante. Ya sea para una reunión de negocios, una cita romántica o simplemente para disfrutar de un buen libro acompañado del mejor café de la ciudad.
              </p>
              <ul className="space-y-4 mt-8">
                <li className="flex items-center space-x-3">
                  <Calendar className="text-amber-500 h-5 w-5" />
                  <span>Elige la fecha perfecta para tu visita.</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Clock className="text-amber-500 h-5 w-5" />
                  <span>Horarios flexibles desde las 7:30 AM.</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Users className="text-amber-500 h-5 w-5" />
                  <span>Mesas disponibles para grupos pequeños y grandes.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Columna Derecha: Formulario */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#1a1a1a] p-6 md:p-8 rounded-2xl shadow-2xl border border-stone-800"
          >
            <h2 className="text-2xl font-bold mb-6 text-amber-500 font-serif">Detalles de la Reserva</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-stone-400 mb-1">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-stone-500" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#252525] border border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-white transition-all placeholder-stone-600"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Contacto Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-stone-500" />
                    <input
                      type="tel"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#252525] border border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white"
                      placeholder="962..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-stone-500" />
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#252525] border border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Fecha y Hora Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-[#252525] border border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white [color-scheme:dark]"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">Hora</label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-3 bg-[#252525] border border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white [color-scheme:dark]"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              {/* Personas y Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">Personas</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    className="w-full px-4 py-3 bg-[#252525] border border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">Tipo de Visita</label>
                  <select
                    className="w-full px-4 py-3 bg-[#252525] border border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option>Desayuno</option>
                    <option>Comida</option>
                    <option>Cena</option>
                    <option>Café / Postre</option>
                    <option>Evento Especial</option>
                  </select>
                </div>
              </div>

              {/* Comentarios */}
              <div>
                <label className="block text-sm font-medium text-stone-400 mb-1">Comentarios o Peticiones Especiales</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-stone-500" />
                  <textarea
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 bg-[#252525] border border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white resize-none"
                    placeholder="¿Alguna alergia o preferencia?"
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {status === 'loading' ? 'Procesando...' : 'Confirmar Reserva'}
              </button>

              <p className="text-xs text-center text-stone-500 mt-4">
                Nos pondremos en contacto contigo para confirmar tu reservación.
              </p>

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-900/30 border border-green-800 text-green-400 rounded-lg text-center"
                >
                  ¡Solicitud enviada! Te contactaremos pronto.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-center"
                >
                  {errorMessage}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
