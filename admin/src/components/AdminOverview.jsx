import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ChefHat } from 'lucide-react';

const AdminOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await adminAPI.getStats();
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Revenue', value: stats?.totalRevenue ? `₹${stats.totalRevenue}` : '₹0', icon: <DollarSign size={24} />, color: 'bg-green-50 text-green-600', trend: '+12.5%' },
        { label: 'Today\'s Orders', value: stats?.totalOrders || '0', icon: <ShoppingBag size={24} />, color: 'bg-[#ff9f0d]/10 text-[#ff9f0d]', trend: '+8%' },
        { label: 'Active Dishes', value: stats?.totalMenuItems || '0', icon: <ChefHat size={24} />, color: 'bg-blue-50 text-blue-600', trend: 'Steady' },
        { label: 'Dining Community', value: stats?.totalUsers || '0', icon: <Users size={24} />, color: 'bg-purple-50 text-purple-600', trend: '+18%' },
    ];

    if (loading) return (
        <div className="space-y-12 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[1,2,3,4].map(i => <div key={i} className="h-44 bg-white rounded-[32px] border border-stone-50"></div>)}
            </div>
            <div className="h-96 bg-white rounded-[40px] border border-stone-50"></div>
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="font-display text-5xl md:text-6xl font-bold mb-3 tracking-tighter text-[#1a1a1a]">SYSTEM <span className="text-[#E56E0C]">OVERVIEW</span></h1>
                    <p className="font-body text-[11px] text-stone-400 font-black uppercase tracking-[0.3em]">Real-time snapshots of Bites performance</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white border border-stone-100 px-8 py-4 rounded-[24px] flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_theme(colors.green.500)]" />
                        <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">Kitchen Live</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-[40px] border border-stone-50 shadow-[0_20px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-8">
                            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${stat.color.replace('bg-[#ff9f0d]/10', 'bg-[#E56E0C]/10').replace('text-[#ff9f0d]', 'text-[#E56E0C]')} shadow-inner`}>
                                {stat.icon}
                            </div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                                {stat.trend}
                            </div>
                        </div>
                        <p className="font-body text-[9px] uppercase tracking-[0.3em] text-stone-400 font-black mb-2">{stat.label}</p>
                        <h2 className="font-display text-4xl font-bold tracking-tighter text-[#1a1a1a]">{stat.value}</h2>
                        
                        <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 text-[#1a1a1a]">
                            {React.cloneElement(stat.icon, { size: 140 })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-12 rounded-[50px] border border-stone-50 shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-12 gap-6">
                        <div>
                            <h3 className="font-display text-3xl font-bold tracking-tight text-[#1a1a1a]">KITCHEN HEAT</h3>
                            <p className="font-body text-[10px] text-stone-400 font-black uppercase tracking-[0.2em] mt-1">Standard service cycle performance</p>
                        </div>
                        <div className="flex gap-3">
                             {['M', 'W', 'F'].map((day, i) => (
                                 <span key={day} className={`w-12 h-12 rounded-[20px] flex items-center justify-center text-[10px] font-black transition-all ${i === 1 ? 'bg-[#E56E0C] text-white shadow-xl shadow-orange-500/30 scale-110' : 'bg-[#FCF8F1] text-stone-400 hover:bg-stone-100'}`}>
                                    {day}
                                 </span>
                             ))}
                        </div>
                    </div>
                    <div className="h-72 flex items-end justify-between gap-3 md:gap-5">
                        {[40, 60, 45, 90, 65, 80, 50, 70, 85, 95, 60, 75].map((h, i) => (
                            <div key={i} className="flex-1 bg-[#FCF8F1] rounded-2xl relative group overflow-hidden">
                                <div 
                                    className={`absolute bottom-0 w-full rounded-2xl transition-all duration-700 group-hover:bg-[#E56E0C] group-hover:shadow-[0_0_20px_rgba(255,77,41,0.4)] ${i === 9 ? 'bg-[#E56E0C]' : 'bg-[#1a1a1a]'}`}
                                    style={{ height: `${h}%` }}
                                ></div>
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#1a1a1a] text-white text-[9px] font-black px-3 py-2 rounded-xl shadow-xl z-20 pointer-events-none">
                                    {h}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#1a1a1a] p-12 rounded-[50px] text-white relative flex flex-col justify-between overflow-hidden shadow-2xl shadow-stone-900/20 group">
                    <div className="absolute top-0 right-0 p-10 opacity-10 text-[#E56E0C] group-hover:scale-110 transition-transform duration-1000">
                        <ChefHat size={200} strokeWidth={1} />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-[#E56E0C]/10 rounded-[20px] flex items-center justify-center mb-8 border border-[#E56E0C]/20">
                            <TrendingUp size={28} className="text-[#E56E0C]" />
                        </div>
                        <h3 className="font-display text-4xl font-bold mb-6 leading-none tracking-tight">INSIGHT <br/> <span className="text-[#E56E0C]">REPORT</span></h3>
                        <p className="font-body text-[11px] text-stone-400 font-bold leading-relaxed mb-10 max-w-[200px] uppercase tracking-wide">
                            Premium markers are driving 40% higher retention. We recommend highlighting seasonal artisanal specials.
                        </p>
                    </div>
                    
                    <button className="relative z-10 w-full bg-[#E56E0C] text-white py-6 rounded-[32px] font-display text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white hover:text-[#1a1a1a] transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-4 group/btn">
                        Download Analytics
                        <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
