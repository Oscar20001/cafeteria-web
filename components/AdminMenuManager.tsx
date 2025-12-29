'use client';

import { useState } from 'react';

const MENU_OPTIONS = [
  { id: 'desayunos', label: 'Desayunos' },
  { id: 'comidas', label: 'Comidas' },
  { id: 'bebidas-calientes', label: 'Bebidas Calientes' },
  { id: 'bebidas-frias', label: 'Bebidas Frías' },
  { id: 'postres', label: 'Postres' },
  { id: 'promociones', label: 'Promociones' },
];

export default function AdminMenuManager() {
  const [selectedMenu, setSelectedMenu] = useState(MENU_OPTIONS[0].id);
  const [heyzineUrl, setHeyzineUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heyzineUrl.trim()) {
      setMessage({ type: 'error', text: 'Por favor pega el enlace del flipbook de Heyzine.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      // Aquí deberías guardar el enlace en la base de datos, por ejemplo:
      // await fetch('/api/menus/update', { method: 'POST', body: JSON.stringify({ menuId: selectedMenu, heyzineUrl }) })
      setMessage({ type: 'success', text: 'Enlace guardado correctamente.' });
      setHeyzineUrl('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-stone-800">Gestor de Menús (Heyzine)</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Selecciona el Menú a actualizar
          </label>
          <select
            value={selectedMenu}
            onChange={(e) => setSelectedMenu(e.target.value)}
            className="w-full p-2 border border-stone-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-black"
          >
            {MENU_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Pega el enlace del flipbook de Heyzine
          </label>
          <input
            type="url"
            value={heyzineUrl}
            onChange={e => setHeyzineUrl(e.target.value)}
            placeholder="https://heyzine.com/flipbook/tu-enlace"
            className="w-full p-2 border border-stone-300 rounded-md text-stone-600"
            required
          />
          <p className="text-xs text-stone-500 mt-1">Pega aquí el enlace generado en heyzine.com</p>
        </div>
            required
          />
          <p className="text-xs text-stone-500 mt-1">Pega aquí el enlace generado en heyzine.com</p>
        </div>

        <button
          type="submit"
          disabled={loading || !heyzineUrl.trim()}
          className={`w-full py-3 px-4 rounded-md text-white font-bold transition-colors ${
            loading || !heyzineUrl.trim()
              ? 'bg-stone-400 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          {loading ? 'Guardando...' : 'Actualizar Menú'}
        </button>

        {message && (
          <div
            className={`p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
