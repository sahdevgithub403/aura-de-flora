
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignupForm = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await signup(formData.name, formData.email, formData.password);
        if (success) {
            navigate('/');
        } else {
            setError('Signup failed. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-md p-8 relative shadow-2xl animate-scale-in border-t-4 border-black bg-[#FDFBF7]">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold mb-2">Join the Club</h2>
              <p className="font-body text-xs text-stone-500 uppercase tracking-widest">
                Create a new account
              </p>
            </div>

            {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1 animate-fade-in-up">
                  <label className="font-body text-[10px] uppercase tracking-widest text-stone-400">Full Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-b border-stone-300 py-2 text-black focus:outline-none focus:border-black font-body text-sm bg-transparent" placeholder="John Doe" />
                </div>
              <div className="space-y-1 animate-fade-in-up delay-100">
                <label className="font-body text-[10px] uppercase tracking-widest text-stone-400">Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-b border-stone-300 py-2 text-black focus:outline-none focus:border-black font-body text-sm bg-transparent" placeholder="name@example.com" />
              </div>
              <div className="space-y-1 animate-fade-in-up delay-200">
                <label className="font-body text-[10px] uppercase tracking-widest text-stone-400">Password</label>
                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border-b border-stone-300 py-2 text-black focus:outline-none focus:border-black font-body text-sm bg-transparent" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-black text-white py-4 font-body text-xs uppercase tracking-[0.2em] hover:bg-stone-800 transition-colors mt-4 animate-fade-in-up delay-300">
                Create Account
              </button>
            </form>
            <div className="mt-6 text-center animate-fade-in-up delay-300">
              <Link to="/login" className="font-body text-xs text-stone-500 hover:text-black border-b border-transparent hover:border-black pb-0.5 transition-all">
                Already have an account? Sign In
              </Link>
            </div>
      </div>
    );
};

export default SignupForm;
