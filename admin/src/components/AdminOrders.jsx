import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { Package, MapPin, Phone, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await orderAPI.getAllOrders();
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await orderAPI.updateOrderStatus(id, { status });
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'CONFIRMED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'SHIPPED': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'DELIVERED': return 'bg-green-50 text-green-600 border-green-100';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-stone-50 text-stone-600 border-stone-100';
        }
    };

    return (
        <div className="space-y-12 animate-fade-in-up">
            <header>
                <h2 className="font-display text-5xl md:text-6xl font-bold mb-3 tracking-tighter text-[#1a1a1a]">ORDER <span className="text-[#E56E0C]">PIPELINE</span></h2>
                <p className="font-body text-[11px] text-stone-400 font-black uppercase tracking-[0.3em] ml-1">Managing active guest requests in real-time</p>
            </header>

            <div className="grid grid-cols-1 gap-10">
                {orders.length === 0 && !loading && (
                    <div className="p-40 text-center bg-white rounded-[50px] border border-stone-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col items-center gap-8">
                        <div className="w-24 h-24 bg-[#FCF8F1] rounded-3xl flex items-center justify-center text-stone-300">
                            <ShoppingBag size={48} />
                        </div>
                        <div>
                            <h3 className="font-display text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">Kitchen Quiet</h3>
                            <p className="font-body text-xs text-stone-400 font-black uppercase tracking-[0.3em]">Waiting for new guest requests</p>
                        </div>
                    </div>
                )}

                {orders.map((order) => (
                    <div key={order.id} className="bg-white p-12 rounded-[50px] border border-stone-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all flex flex-col lg:flex-row gap-16 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.02] text-[#1a1a1a] pointer-events-none">
                            <Package size={240} />
                        </div>

                        <div className="flex-1 space-y-12 relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-body text-[10px] uppercase tracking-[0.3em] text-stone-400 font-black mb-1">Order ID</p>
                                    <h3 className="font-display text-4xl font-bold tracking-tighter text-[#1a1a1a]">#ORD-{order.id.toString().padStart(6, '0')}</h3>
                                </div>
                                <span className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-black border flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                    {order.orderStatus}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[#E56E0C]"><MapPin size={18} strokeWidth={2.5} /> <span className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400">Delivery Address</span></div>
                                    <p className="font-body text-sm text-[#1a1a1a] font-bold leading-relaxed">{order.deliveryAddress || 'Pick-up from Store'}</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[#E56E0C]"><Clock size={18} strokeWidth={2.5} /> <span className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400">Received At</span></div>
                                    <p className="font-display text-sm text-[#1a1a1a] font-bold">{new Date(order.orderDate).toLocaleString()}</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[#E56E0C]"><Phone size={18} strokeWidth={2.5} /> <span className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400">Guest Contact</span></div>
                                    <p className="font-display text-sm font-bold text-[#1a1a1a]">{order.contactNumber || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="pt-12 border-t border-stone-100">
                                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-stone-400 font-black mb-8">Items Manifest</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-6 bg-[#FCF8F1] rounded-[24px] group/item hover:bg-[#E56E0C]/5 transition-colors">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-display font-bold text-sm text-[#E56E0C] shadow-sm group-hover/item:bg-[#E56E0C] group-hover/item:text-white transition-all scale-100 group-hover/item:scale-110">{item.quantity}x</div>
                                                <span className="font-display text-lg font-bold text-[#1a1a1a] tracking-tight">{item.menuItem.name}</span>
                                            </div>
                                            <span className="font-display text-sm font-bold text-stone-400">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-96 bg-[#FCF8F1] p-10 rounded-[40px] flex flex-col justify-between border border-stone-50 relative z-10 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
                            <div>
                                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-stone-400 font-black mb-3">Total Payable</p>
                                <p className="font-display text-6xl font-bold tracking-tighter text-[#E56E0C] leading-none">₹{order.totalAmount}</p>
                            </div>

                            <div className="space-y-4 pt-16">
                                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-stone-400 font-black mb-6">Operational Actions</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                                        className="bg-white border-2 border-transparent hover:border-[#E56E0C] p-5 rounded-[24px] flex flex-col items-center justify-center gap-2 font-display text-[9px] uppercase font-bold tracking-widest text-stone-500 hover:text-[#E56E0C] transition-all shadow-sm"
                                    >
                                        <CheckCircle size={20} />
                                        Confirm
                                    </button>
                                    <button 
                                        onClick={() => handleStatusUpdate(order.id, 'SHIPPED')}
                                        className="bg-white border-2 border-transparent hover:border-[#E56E0C] p-5 rounded-[24px] flex flex-col items-center justify-center gap-2 font-display text-[9px] uppercase font-bold tracking-widest text-stone-500 hover:text-[#E56E0C] transition-all shadow-sm"
                                    >
                                       <Truck size={20} />
                                        Ship
                                    </button>
                                </div>
                                <button 
                                    onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                                    className="w-full bg-[#1a1a1a] text-white p-6 rounded-[28px] flex items-center justify-center gap-4 font-display text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#E56E0C] transition-all shadow-xl shadow-stone-200 active:scale-95 border-2 border-[#1a1a1a] hover:border-[#E56E0C]"
                                >
                                    <CheckCircle size={16} /> Mark Delivered
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                    className="w-full py-4 font-display text-[9px] uppercase font-bold text-stone-300 hover:text-red-500 transition-colors flex items-center justify-center gap-2 group/cancel"
                                >
                                    <XCircle size={14} className="group-hover/cancel:scale-110 transition-transform" /> Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;

