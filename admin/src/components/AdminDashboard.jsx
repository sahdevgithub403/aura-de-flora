import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, 
  ShoppingBag, 
  PlusCircle, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Menu as MenuIcon,
  X,
  Truck,
  UtensilsCrossed
} from 'lucide-react';
import AdminOverview from './AdminOverview';
import AdminMenu from './AdminMenu';
import AdminOrders from './AdminOrders';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'orders', label: 'Orders', icon: <Truck size={20} /> },
        { id: 'menu', label: 'Menu', icon: <UtensilsCrossed size={20} /> },
        { id: 'stats', label: 'Stats', icon: <BarChart3 size={20} /> },
    ];

    return (
        <div className="flex min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-display">
            {/* Sidebar */}
            <aside className={`fixed md:sticky top-0 h-screen transition-all duration-500 z-50 ${sidebarOpen ? 'w-80 p-6' : 'w-0 -translate-x-full md:w-32 md:translate-x-0 md:p-6'} overflow-hidden`}>
                <div className="h-full bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[40px] flex flex-col p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col gap-2 mb-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#E56E0C] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
                                <span className="font-bold text-sm">CI</span>
                            </div>
                            {sidebarOpen && <h2 className="font-display font-bold text-xl tracking-tight text-[#1a1a1a]">ADMIN <span className="text-[#E56E0C] text-4xl leading-none">.</span></h2>}
                        </div>
                        {sidebarOpen && <p className="font-body text-[9px] uppercase tracking-[0.3em] text-stone-400 pl-1 mt-1">Control Panel</p>}
                    </div>

                    <nav className="flex-1 space-y-3 relative z-10">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-ful transition-all group ${
                                    activeTab === item.id 
                                    ? 'bg-[#1a1a1a] text-white shadow-xl hover-lift' 
                                    : 'text-stone-400 hover:bg-white hover:text-[#E56E0C] hover:shadow-lg'
                                } rounded-full`}
                            >
                                <span className={`flex-shrink-0 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-[#E56E0C]' : ''}`}>
                                    {item.icon}
                                </span>
                                {sidebarOpen && <span className="font-body text-xs font-bold uppercase tracking-widest">{item.label}</span>}
                                {activeTab === item.id && sidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E56E0C]" />}
                            </button>
                        ))}
                    </nav>

                    <button 
                        onClick={logout}
                        className="relative z-10 flex items-center gap-4 p-4 text-stone-400 hover:text-red-500 transition-all mt-auto font-body text-xs font-bold uppercase tracking-widest group hover:bg-red-50 rounded-full"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Topbar */}
                <header className="h-32 flex items-center justify-between px-12 sticky top-0 z-40 bg-gradient-to-b from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent backdrop-blur-sm">
                    <div className="flex items-center gap-8">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-12 h-12 flex items-center justify-center bg-white hover:bg-[#E56E0C] hover:text-white rounded-full transition-all text-stone-800 shadow-sm border border-stone-100 group">
                            {sidebarOpen ? <X size={20} className="group-hover:rotate-90 transition-transform"/> : <MenuIcon size={20} />}
                        </button>
                        <div>
                            <h3 className="font-display text-4xl font-bold capitalize tracking-tight text-[#1a1a1a]">{activeTab}</h3>
                            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#E56E0C]">System Active</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 group cursor-pointer pl-6 pr-2 py-2 bg-white rounded-full border border-stone-100 shadow-sm hover:shadow-xl transition-all hover-lift">
                        <div className="text-right hidden sm:block">
                            <p className="font-display font-bold text-sm text-[#1a1a1a]">{user?.fullName || 'Manager'}</p>
                            <p className="font-body text-[9px] uppercase tracking-[0.2em] text-stone-400">Cream Island</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center font-display font-bold text-lg text-[#E56E0C] shadow-lg group-hover:rotate-12 transition-transform">
                            {user?.fullName?.charAt(0) || 'M'}
                        </div>
                    </div>
                </header>

                <div className="px-12 pb-12 w-full max-w-[1600px] mx-auto animate-fade-in-up">
                    {activeTab === 'overview' && <AdminOverview />}
                    {activeTab === 'menu' && <AdminMenu />}
                    {activeTab === 'orders' && <AdminOrders />}
                    {activeTab === 'stats' && (
                        <div className="p-24 text-center bg-white border border-stone-50 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.05)]">
                            <div className="w-24 h-24 bg-[#E56E0C]/5 rounded-full flex items-center justify-center mx-auto mb-10 text-[#E56E0C]">
                                <BarChart3 size={40}/>
                            </div>
                            <h2 className="font-display text-4xl font-bold mb-6 tracking-tight text-[#1a1a1a]">ANALYTICS</h2>
                            <p className="font-body text-xs text-stone-400 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                                Data calibrating...
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

