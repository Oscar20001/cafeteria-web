'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Phone, Mail, LogOut, CheckCircle, XCircle, AlertCircle, BarChart, ShoppingBag, Trash2, FileText, TrendingUp, MessageSquare, Crown, Utensils, X } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AdminMenuManager from '@/components/AdminMenuManager';

interface Reservation {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  type?: string; // Added type
  comments?: string; // Added comments
  status: 'Pendiente' | 'Confirmado' | 'Cancelado';
  createdAt: string;
}

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  orderType: 'pickup' | 'dine-in';
  pickupTime: string;
  paymentMethod: 'cash' | 'paypal';
  items: {
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  total: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  createdAt: string;
}

interface Stats {
  daily: number;
  weekly: number;
  monthly: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<'waiter' | 'ceo' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'reservations' | 'orders'>('reservations');
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Order Filters
  const [orderFilter, setOrderFilter] = useState<'today' | 'week' | 'month'>('today');

  // Comment Modal State
  const [selectedComment, setSelectedComment] = useState<{ name: string; comment: string } | null>(null);

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setUser(storedUser as 'waiter' | 'ceo');
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchReservations();
      fetchOrders();
      if (user === 'ceo') {
        fetchStats();
      }
    }
  }, [user]);

  // Polling for real-time updates (every 30 seconds)
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetchOrders();
      fetchReservations();
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // CEO Login (Strict - Password Only)
    if (password === 'AlejandraCoffe') {
      setUser('ceo');
      localStorage.setItem('adminUser', 'ceo');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleWaiterLogin = () => {
    setUser('waiter');
    localStorage.setItem('adminUser', 'waiter');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
    setReservations([]);
    setOrders([]);
    setStats(null);
    setFetchError('');
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reservations', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) setReservations(data.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateReservationStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) fetchReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este pedido?')) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Filter Logic
  const getFilteredOrders = () => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      if (orderFilter === 'today') {
        return orderDate.toDateString() === now.toDateString();
      } else if (orderFilter === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= oneWeekAgo;
      } else if (orderFilter === 'month') {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredOrders = getFilteredOrders();

  // Analytics: Most Sold Product
  const getMostSoldProduct = () => {
    const productCounts: Record<string, number> = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
      });
    });
    const sorted = Object.entries(productCounts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0] : null;
  };

  const mostSold = getMostSoldProduct();

  // PDF Generation
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Reporte de Pedidos - ${orderFilter.toUpperCase()}`, 14, 15);
    
    const tableData = filteredOrders.map(order => [
      new Date(order.createdAt).toLocaleDateString(),
      order.customerName,
      order.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
      `$${order.total}`,
      order.status
    ]);

    autoTable(doc, {
      head: [['Fecha', 'Cliente', 'Items', 'Total', 'Estado']],
      body: tableData,
      startY: 20,
    });

    doc.save(`reporte-pedidos-${orderFilter}.pdf`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2 font-serif text-stone-800">Café Alejandría</h1>
          <p className="text-center text-stone-500 mb-8">Panel de Administración</p>
          
          {/* Waiter Quick Access */}
          <div className="mb-8 pb-8 border-b border-stone-200">
            <h2 className="text-lg font-semibold text-stone-700 mb-4 text-center">Acceso Camareros</h2>
            <button
              onClick={handleWaiterLogin}
              className="w-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              <Users className="h-5 w-5 mr-2" />
              Entrar como Camarero
            </button>
          </div>

          {/* CEO Login */}
          <div>
            <h2 className="text-lg font-semibold text-stone-700 mb-4 text-center">Acceso CEO</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Entrar como CEO
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-stone-100 p-4 md:p-8 relative overflow-x-hidden before:content-none after:content-none"
      style={{ 
        backgroundColor: '#f5f5f4',
        backgroundImage: 'none',
        border: 'none',
        outline: 'none'
      }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${user === 'ceo' ? 'bg-amber-100' : 'bg-stone-200'}`}>
              {user === 'ceo' ? (
                <Crown className="h-8 w-8 text-amber-600" />
              ) : (
                <Utensils className="h-8 w-8 text-stone-600" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stone-800 font-serif">
                {user === 'ceo' ? 'Panel de Control (CEO)' : 'Panel de Camareros'}
              </h1>
              <p className="text-stone-500">Bienvenido, {user === 'ceo' ? 'Alejandra' : 'Equipo'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg text-stone-700 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Cerrar Sesión
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-stone-200 pb-1">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'reservations' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Reservas
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'orders' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Pedidos Rápidos
          </button>
          {user === 'ceo' && (
            <button
              onClick={() => setActiveTab('menu')}
              className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'menu' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Menú Digital
            </button>
          )}
        </div>

        {/* MENU MANAGER VIEW */}
        {activeTab === 'menu' && user === 'ceo' && (
          <AdminMenuManager />
        )}

        {/* RESERVATIONS VIEW */}
        {activeTab === 'reservations' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-stone-200">
              <h2 className="text-xl font-semibold text-stone-700">Gestión de Reservas</h2>
            </div>
            
             <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-stone-600 uppercase text-sm font-semibold">
                    <tr>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Fecha y Hora</th>
                      <th className="px-6 py-4">Personas / Tipo</th>
                      <th className="px-6 py-4">Contacto</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {reservations.map((res) => (
                      <tr key={res._id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-stone-900">{res.name}</div>
                          <div className="text-sm text-stone-500">{new Date(res.createdAt).toLocaleDateString()}</div>
                          {res.comments && (
                            <button
                              onClick={() => setSelectedComment({ name: res.name, comment: res.comments! })}
                              className="mt-2 flex items-center text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
                            >
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Ver nota completa
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-stone-700 mb-1">
                            <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                            {new Date(res.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-stone-700">
                            <Clock className="h-4 w-4 mr-2 text-amber-500" />
                            {formatTime(res.time)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-stone-700 mb-1">
                            <Users className="h-4 w-4 mr-2 text-amber-500" />
                            {res.guests} Personas
                          </div>
                          <div className="flex items-center text-stone-600 text-sm">
                            <span className="bg-stone-200 px-2 py-0.5 rounded text-xs font-medium">
                              {res.type || 'General'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-stone-600 mb-1">
                            <Mail className="h-4 w-4 mr-2 text-stone-400" />
                            <span className="text-sm">{res.email}</span>
                          </div>
                          <div className="flex items-center text-stone-600">
                            <Phone className="h-4 w-4 mr-2 text-stone-400" />
                            <span className="text-sm">{res.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${res.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 
                              res.status === 'Cancelado' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {res.status || 'Pendiente'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button onClick={() => updateReservationStatus(res._id, 'Confirmado')} className="p-1 text-green-600 hover:bg-green-50 rounded"><CheckCircle className="h-5 w-5" /></button>
                            <button onClick={() => updateReservationStatus(res._id, 'Pendiente')} className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"><AlertCircle className="h-5 w-5" /></button>
                            <button onClick={() => updateReservationStatus(res._id, 'Cancelado')} className="p-1 text-red-600 hover:bg-red-50 rounded"><XCircle className="h-5 w-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile View for Reservations */}
              <div className="md:hidden space-y-4 p-4">
                {reservations.map((res) => (
                  <div key={res._id} className="bg-stone-50 p-4 rounded-lg border border-stone-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-stone-900">{res.name}</h3>
                        <p className="text-xs text-stone-500">{new Date(res.date).toLocaleDateString()} - {formatTime(res.time)}</p>
                        <p className="text-xs text-stone-600 mt-1">
                          {res.guests} pers. • <span className="font-medium">{res.type || 'General'}</span>
                        </p>
                        {res.comments && (
                          <button
                            onClick={() => setSelectedComment({ name: res.name, comment: res.comments! })}
                            className="mt-2 flex items-center text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Ver nota
                          </button>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${res.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{res.status}</span>
                    </div>
                    <div className="flex justify-end space-x-2 mt-2">
                        <button onClick={() => updateReservationStatus(res._id, 'Confirmado')} className="text-green-600 text-sm font-medium">Confirmar</button>
                        <button onClick={() => updateReservationStatus(res._id, 'Cancelado')} className="text-red-600 text-sm font-medium">Cancelar</button>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        )}

        {/* ORDERS VIEW */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Analytics & Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-stone-600 font-medium">Filtrar por:</span>
                <select 
                  value={orderFilter} 
                  onChange={(e) => setOrderFilter(e.target.value as any)}
                  className="bg-stone-100 border-none rounded-lg px-3 py-1 text-stone-800 font-medium focus:ring-2 focus:ring-amber-500"
                >
                  <option value="today">Hoy</option>
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mes</option>
                </select>
              </div>

              {mostSold && (
                <div className="flex items-center bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
                  <TrendingUp className="h-5 w-5 text-amber-600 mr-2" />
                  <div>
                    <p className="text-xs text-amber-600 font-bold uppercase">Más Vendido</p>
                    <p className="text-stone-800 font-bold">{mostSold[0]} ({mostSold[1]} uds)</p>
                  </div>
                </div>
              )}

              {user === 'ceo' && (
                <button 
                  onClick={downloadPDF}
                  className="flex items-center px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors shadow-lg"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Descargar Reporte PDF
                </button>
              )}
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-stone-600 uppercase text-sm font-semibold">
                    <tr>
                      <th className="px-6 py-4">Pedido</th>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Items</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-mono text-xs text-stone-400 mb-1">#{order._id.slice(-6)}</div>
                          <div className="text-sm font-medium text-stone-800 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> {order.pickupTime}
                          </div>
                          <div className="text-xs text-stone-500">{order.orderType === 'pickup' ? 'Para llevar' : 'Comer aquí'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-stone-900">{order.customerName}</div>
                          <div className="text-sm text-stone-500">{order.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-stone-600 max-w-xs">
                            {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-stone-800">${order.total}</div>
                          <div className="text-xs text-stone-500 capitalize">{order.paymentMethod}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${order.status === 'completed' || order.status === 'paid' ? 'bg-green-100 text-green-800' : 
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {order.status === 'paid' ? 'Pagado' : order.status === 'pending' ? 'Pendiente' : order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="text-xs border border-stone-300 rounded px-2 py-1 outline-none focus:border-amber-500"
                            >
                              <option value="pending">Pendiente</option>
                              <option value="completed">Completado</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                            {user === 'ceo' && (
                              <button 
                                onClick={() => deleteOrder(order._id)}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Eliminar Pedido"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View for Orders */}
              <div className="md:hidden space-y-4 p-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="bg-stone-50 p-4 rounded-lg border border-stone-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-stone-900">{order.customerName}</h3>
                        <p className="text-xs text-stone-500">#{order._id.slice(-6)} • {order.pickupTime}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="mb-3 text-sm text-stone-700 bg-white p-2 rounded border border-stone-100">
                       {order.items.map((item, idx) => (
                         <div key={idx} className="flex justify-between">
                           <span>{item.quantity}x {item.name}</span>
                           <span>${item.subtotal}</span>
                         </div>
                       ))}
                       <div className="border-t border-stone-100 mt-2 pt-1 flex justify-between font-bold">
                         <span>Total</span>
                         <span>${order.total}</span>
                       </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-200">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="text-sm border border-stone-300 rounded px-2 py-1 outline-none bg-white"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="completed">Completado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                      {user === 'ceo' && (
                        <button onClick={() => deleteOrder(order._id)} className="text-red-500 p-1">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comment Modal */}
      {selectedComment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedComment(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <MessageSquare className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-800">Nota de Reserva</h3>
                <p className="text-sm text-stone-500">Cliente: {selectedComment.name}</p>
              </div>
            </div>
            
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 text-stone-700 leading-relaxed">
              "{selectedComment.comment}"
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedComment(null)}
                className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
