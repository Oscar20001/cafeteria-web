'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al reservar');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: 2 });
    } catch (error) {
      setStatus('error');
      const msg = (error as Error).message;
      if (msg === 'Failed to fetch') {
        setErrorMessage('Error de conexión. Asegúrate de que el servidor está funcionando.');
      } else {
        setErrorMessage(msg);
      }
    }
  };

  return (
    <section id="reservations" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-stone-800 mb-4 font-serif">Reserva tu Mesa</h2>
          <p className="text-stone-600">Asegura tu lugar para una experiencia inolvidable.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-stone-50 p-8 rounded-2xl shadow-xl border border-stone-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Personas</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Fecha</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Hora</label>
                <input
                  type="time"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Procesando...' : 'Confirmar Reserva'}
            </button>

            {status === 'success' && (
              <div className="p-4 bg-green-100 text-green-700 rounded-lg text-center">
                ¡Reserva confirmada con éxito! Te esperamos.
              </div>
            )}
            {status === 'error' && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
                {errorMessage || 'Hubo un error al procesar tu reserva. Por favor intenta de nuevo.'}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
