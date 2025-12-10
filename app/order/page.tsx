'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Clock, CreditCard, Banknote, CheckCircle } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Link from 'next/link';

// Sample Product Data
const PRODUCTS = [
  { id: 1, name: 'Capuchino', price: 45, description: 'Espresso con leche vaporizada y espuma.', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=60' },
  { id: 2, name: 'Latte', price: 50, description: 'Espresso suave con mucha leche caliente.', image: 'https://images.unsplash.com/photo-1570968992193-d6ea06651afb?auto=format&fit=crop&w=500&q=60' },
  { id: 3, name: 'Espresso', price: 35, description: 'Café intenso y puro.', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=60' },
  { id: 4, name: 'Frappé Moka', price: 60, description: 'Café frío con chocolate y crema batida.', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=60' }, // Placeholder reused
  { id: 5, name: 'Pastel de Chocolate', price: 55, description: 'Rebanada de pastel casero.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=60' },
  { id: 6, name: 'Croissant', price: 40, description: 'Horneado diariamente, mantequilla pura.', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=60' },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function OrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'pickup',
    time: '15 min',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'paypal'>('cash');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [orderId, setOrderId] = useState('');

  // Cart Logic
  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Order Submission
  const handleOrderSubmit = async (paymentDetails?: any) => {
    setOrderStatus('processing');
    
    const orderData = {
      customerName: formData.name,
      phone: formData.phone,
      orderType: formData.type,
      pickupTime: formData.time,
      paymentMethod: paymentMethod,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      total: total,
      status: paymentMethod === 'paypal' ? 'paid' : 'pending',
      paymentDetails: paymentDetails || null
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setOrderStatus('success');
        setOrderId(data.data._id);
        setCart([]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
      setOrderStatus('error');
    }
  };

  if (orderStatus === 'success') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-stone-800 mb-4 font-serif">¡Pedido Recibido!</h2>
          <p className="text-stone-600 mb-6">
            Gracias {formData.name}, tu pedido ha sido confirmado.
            {paymentMethod === 'cash' ? ' Pagarás al recoger.' : ' El pago ha sido procesado.'}
          </p>
          <div className="bg-stone-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-stone-500">ID de Pedido</p>
            <p className="font-mono font-bold text-stone-800">{orderId}</p>
            <p className="text-sm text-stone-500 mt-2">Tiempo estimado</p>
            <p className="font-bold text-stone-800">{formData.time}</p>
          </div>
          <Link href="/" className="block w-full bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700 transition-colors">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <header className="bg-black text-white py-6 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold font-serif text-amber-500">Café Alejandría</Link>
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6 text-stone-300" />
            <span className="bg-amber-600 text-xs font-bold px-2 py-1 rounded-full">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Product Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-stone-800 font-serif">Menú Rápido</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PRODUCTS.map(product => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-100 hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-stone-200 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-stone-800">{product.name}</h3>
                    <span className="text-amber-600 font-bold text-lg">${product.price}</span>
                  </div>
                  <p className="text-stone-500 text-sm mb-4">{product.description}</p>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-stone-900 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agregar</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cart & Checkout Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-amber-600" />
              Tu Pedido
            </h2>

            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="text-center py-8 text-stone-400 border-b border-stone-100 mb-6">
                Tu carrito está vacío
              </div>
            ) : (
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-medium text-stone-800">{item.name}</h4>
                      <p className="text-sm text-stone-500">${item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center bg-stone-100 rounded-lg">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-amber-600"><Minus className="h-4 w-4" /></button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-amber-600"><Plus className="h-4 w-4" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center text-xl font-bold text-stone-800 mb-8 pt-4 border-t border-stone-100">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {/* Checkout Form */}
            <form onSubmit={(e) => { e.preventDefault(); if(paymentMethod === 'cash') handleOrderSubmit(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Teléfono</label>
                <input 
                  type="tel" 
                  required 
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Tipo</label>
                  <select 
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="pickup">Para llevar</option>
                    <option value="dine-in">Comer aquí</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Tiempo</label>
                  <select 
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                  >
                    <option value="10 min">10 min</option>
                    <option value="15 min">15 min</option>
                    <option value="20 min">20 min</option>
                    <option value="30 min">30 min</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-4">
                <label className="block text-sm font-medium text-stone-700 mb-3">Método de Pago</label>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      paymentMethod === 'cash' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    <Banknote className="h-6 w-6 mb-1" />
                    <span className="text-sm font-medium">Efectivo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    <CreditCard className="h-6 w-6 mb-1" />
                    <span className="text-sm font-medium">Tarjeta / PayPal</span>
                  </button>
                </div>
              </div>

              {/* Submit Button / PayPal */}
              {cart.length > 0 && formData.name && formData.phone ? (
                paymentMethod === 'cash' ? (
                  <button 
                    type="submit"
                    disabled={orderStatus === 'processing'}
                    className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-stone-800 transition-colors disabled:opacity-50"
                  >
                    {orderStatus === 'processing' ? 'Procesando...' : `Confirmar Pedido ($${total})`}
                  </button>
                ) : (
                  <div className="relative z-0">
                    <PayPalScriptProvider options={{ clientId: "test" }}>
                      <PayPalButtons 
                        style={{ layout: "vertical" }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [{
                              amount: { value: total.toString(), currency_code: "USD" }
                            }]
                          });
                        }}
                        onApprove={async (data, actions) => {
                          if (actions.order) {
                            const details = await actions.order.capture();
                            handleOrderSubmit(details);
                          }
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                )
              ) : (
                <div className="text-center text-sm text-stone-400 bg-stone-100 py-3 rounded-lg">
                  Completa tus datos y agrega productos para continuar
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
