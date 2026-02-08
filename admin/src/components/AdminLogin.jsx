import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(credentials.username, credentials.password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-10 bg-[#FDFBF7]">
            <div className="w-full max-w-xl animate-scale-in">
                <div className="text-center mb-16 space-y-6">
                    <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto shadow-2xl text-white transform hover:scale-110 transition-transform duration-500">
                        <span className="font-display font-bold text-2xl">CI</span>
                    </div>
                    <div>
                        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-[#1a1a1a] mb-2">
                            Admin <span className="text-[#E56E0C]">Portal</span>
                        </h1>
                        <p className="font-body text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-1">
                            Cream Island Management
                        </p>
                    </div>
                </div>

                <div className="bg-white p-12 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.05)] rounded-[60px] border border-stone-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-[#1a1a1a] group-hover:scale-110 transition-transform duration-1000">
                        <Lock size={200} />
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-2xl flex items-center gap-4 border border-red-100">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] ml-4">
                                Username
                            </label>
                            <div className="relative group/input">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within/input:text-[#1a1a1a] transition-colors">
                                    <User size={20} />
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-[#f7f5f0] border-none rounded-full py-5 pl-16 pr-8 font-body text-sm font-semibold text-[#1a1a1a] placeholder:text-stone-300 focus:ring-2 focus:ring-[#1a1a1a] transition-all"
                                    placeholder="Enter username"
                                    value={credentials.username}
                                    onChange={e => setCredentials({...credentials, username: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] ml-4">
                                Password
                            </label>
                            <div className="relative group/input">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within/input:text-[#1a1a1a] transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    className="w-full bg-[#f7f5f0] border-none rounded-full py-5 pl-16 pr-8 font-body text-sm font-semibold text-[#1a1a1a] placeholder:text-stone-300 focus:ring-2 focus:ring-[#1a1a1a] transition-all"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={e => setCredentials({...credentials, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#1a1a1a] text-white py-6 rounded-full font-body text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#333] transition-all flex items-center justify-center gap-4 shadow-xl hover-lift active:scale-95 disabled:opacity-50 group/btn mt-8"
                        >
                            {loading ? 'Verifying...' : 'Login'}
                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
                
                <div className="text-center mt-12 opacity-30">
                     <p className="font-display font-bold text-lg text-stone-400">Cream Island</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

