
import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import DashboardCard from '../ui/DashboardCard';
import { adminAPI, orderAPI } from '../../services/api';

const AdminOverview = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        avgOrderValue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // Parallel fetch for better performance
            const [statsRes, ordersRes] = await Promise.all([
                adminAPI.getStats(),
                orderAPI.getAllOrders()
            ]);

            const statsData = statsRes.data;
            setStats({
                totalRevenue: statsData.totalRevenue || 0,
                totalOrders: statsData.totalOrdersToday || 0, 
                pendingOrders: statsData.pendingOrders || 0,
                avgOrderValue: statsData.totalOrdersToday > 0 ? (statsData.totalRevenue / statsData.totalOrdersToday).toFixed(0) : 0
            });

            // Sort orders by date descending and take top 5
            const sortedOrders = ordersRes.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            setRecentOrders(sortedOrders.slice(0, 5));
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const statCards = [
        { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: 'up', trendValue: '12.5%' }, // Trend logic would require historical data
        { title: 'Orders Today', value: stats.totalOrders, icon: ShoppingBag, trend: 'up', trendValue: '5.2%' },
        { title: 'Pending Orders', value: stats.pendingOrders, icon: Users, trend: stats.pendingOrders > 5 ? 'down' : 'up', trendValue: 'Active' },
        { title: 'Avg. Order Value', value: `₹${stats.avgOrderValue}`, icon: TrendingUp, trend: 'up', trendValue: 'Stable' },
    ];

  return (
    <div className="space-y-8 animate-fade-in-up">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="font-display text-3xl font-bold text-[#1a1a1a] mb-1">Dashboard</h2>
                <p className="font-body text-xs uppercase tracking-widest text-stone-500">Real-time store overview</p>
            </div>
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
                <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">{loading ? 'Updating...' : 'Live'}</span>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, idx) => (
                <div key={idx} style={{ animationDelay: `${idx * 100}ms` }} className="animate-fade-in-up">
                    <DashboardCard {...stat} />
                </div>
            ))}
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-stone-100 hidden md:block animate-fade-in-up delay-200">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-display text-xl font-bold">Revenue Analytics</h3>
                    <button className="text-xs font-bold text-[#E56E0C] uppercase tracking-widest hover:underline">View Report</button>
                </div>
                {/* Placeholder Chart - Real implementation would require Chart.js or Recharts */}
                <div className="h-64 flex items-end justify-between gap-2 px-2 border-b border-stone-100 pb-4">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                        <div key={i} className="group relative w-full h-full flex items-end">
                            <div className="w-full bg-[#1a1a1a] opacity-10 group-hover:opacity-100 group-hover:bg-[#E56E0C] transition-all duration-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 animate-fade-in-up delay-300">
                <h3 className="font-display text-xl font-bold mb-6">Recent Activity</h3>
                 <div className="space-y-6">
                    {recentOrders.length > 0 ? (
                        recentOrders.map((order, i) => (
                            <div key={order.id} className="flex items-center gap-4 pb-4 border-b border-stone-50 last:border-0 last:pb-0 group cursor-pointer">
                                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-xs font-bold text-stone-600 group-hover:bg-[#1a1a1a] group-hover:text-white transition-colors">
                                    {order.user ? order.user.name.charAt(0) : 'U'}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-body text-sm font-bold group-hover:text-[#E56E0C] transition-colors">{order.user ? order.user.name : 'Unknown User'}</h4>
                                    <p className="text-xs text-stone-500">Placed order #{order.id}</p>
                                </div>
                                <span className="text-[10px] font-bold text-stone-400">
                                    {new Date(order.orderDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-stone-400 text-sm italic">No recent orders found.</p>
                    )}
                 </div>
            </div>
        </div>

    </div>
  );
};

export default AdminOverview;
