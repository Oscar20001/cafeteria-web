'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, User, Mail } from 'lucide-react';

export default function LoyaltyCard() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // For registration
  const [userData, setUserData] = useState<{ name: string; email: string; points: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'check' | 'register'>('check');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setUserData(null);

    try {
      if (mode === 'check') {
        const res = await fetch(`/api/loyalty?email=${email}`);
        const data = await res.json();
        if (data.success && data.data) {
          setUserData(data.data);
        } else {
          setMessage('Usuario no encontrado. ¿Deseas registrarte?');
        }
      } else {
        // Register mode
        const res = await fetch('/api/loyalty', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, action: 'register' }),
        });
        const data = await res.json();
        if (data.success) {
          setUserData(data.data);
          setMessage('¡Registro exitoso!');
          setMode('check');
        } else {
          setMessage(data.error || 'Error al registrar');
        }
      }
    } catch (error) {
      console.error(error);
      setMessage('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="loyalty" 
      className="py-20 bg-stone-900 text-white relative z-10 overflow-hidden"
      style={{ 
        marginBottom: '-1px', 
        paddingBottom: '80px', 
        borderBottomLeftRadius: 0, 
        borderBottomRightRadius: 0,
        clipPath: 'none',
        backgroundColor: '#1c1917', // Force solid color
        backgroundImage: 'none'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 font-serif text-amber-500">Programa de Lealtad</h2>
            <p className="text-stone-300 mb-8 text-lg">
              Acumula puntos en cada visita y canjéalos por recompensas exclusivas. 
              ¡Porque tu preferencia merece ser premiada!
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Star className="text-amber-500" />
                <span>1 punto por cada $10 de compra</span>
              </li>
              <li className="flex items-center space-x-3">
                <Gift className="text-amber-500" />
                <span>Bebida gratis al acumular 100 puntos</span>
              </li>
            </ul>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-stone-800 p-8 rounded-2xl border border-stone-700 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">{mode === 'check' ? 'Consulta tus Puntos' : 'Únete al Programa'}</h3>
              <button 
                onClick={() => { setMode(mode === 'check' ? 'register' : 'check'); setMessage(''); setUserData(null); }}
                className="text-sm text-amber-500 hover:text-amber-400 underline"
              >
                {mode === 'check' ? 'Registrarse' : 'Consultar'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-stone-700 border border-stone-600 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu Nombre"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-stone-400 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-stone-700 border border-stone-600 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-[1.02]"
              >
                {loading ? 'Procesando...' : (mode === 'check' ? 'Verificar Saldo' : 'Registrarse')}
              </button>
            </form>

            {message && (
              <p className="mt-4 text-center text-amber-400 text-sm">{message}</p>
            )}

            {userData && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 bg-stone-700/50 rounded-xl border border-stone-600"
              >
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-stone-600">
                  <div className="bg-amber-500/20 p-2 rounded-full">
                    <User className="text-amber-500 h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-400">Bienvenido/a</p>
                    <p className="font-bold text-lg">{userData.name}</p>
                  </div>
                </div>
                
                <div className="text-center py-2">
                  <p className="text-stone-400 text-sm uppercase tracking-wider mb-1">Tienes acumulados</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-5xl font-bold text-amber-500">{userData.points}</span>
                    <span className="text-xl text-stone-300">pts</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-600 flex items-center justify-center space-x-2 text-sm text-stone-400">
                  <Mail className="h-4 w-4" />
                  <span>{userData.email}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
