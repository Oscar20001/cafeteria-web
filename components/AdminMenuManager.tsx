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
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Por favor selecciona un archivo PDF' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('menuId', selectedMenu);

    try {
      const res = await fetch('/api/heyzine/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al subir el menú');
      }

      setMessage({ 
        type: 'success', 
        text: `Menú actualizado correctamente. URL: ${data.menu.heyzineUrl}` 
      });
      setFile(null);
      // Reset file input manually if needed
      const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

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
            className="w-full p-2 border border-stone-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
          >
            {MENU_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Subir PDF del Menú
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full p-2 border border-stone-300 rounded-md text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
          />
          <p className="text-xs text-stone-500 mt-1">Solo archivos PDF.</p>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className={`w-full py-3 px-4 rounded-md text-white font-bold transition-colors ${
            loading || !file
              ? 'bg-stone-400 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          {loading ? 'Subiendo a Heyzine...' : 'Actualizar Menú'}
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
