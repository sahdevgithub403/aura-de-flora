
import React from 'react';
import { ArrowRight, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0f0f0f] text-white pt-20 pb-10 px-6 border-t border-white/5 relative overflow-hidden">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start mb-20 relative z-10">
            <div className="mb-10 md:mb-0">
               <h2 className="font-display text-4xl mb-2 font-bold">Cream Island</h2>
               <p className="font-body text-xs text-stone-500 uppercase tracking-wider">Artisanal Frozen Treats</p>
               <button 
                 onClick={() => window.scrollTo(0,0)}
                 className="mt-8 px-6 py-3 border border-stone-700 rounded-full text-xs uppercase tracking-widest hover:border-white transition-colors flex items-center gap-2 font-body hover-lift"
               >
                 Back to Top <ArrowRight size={14} />
               </button>
            </div>
            <div className="grid grid-cols-2 md:flex gap-12 md:gap-24 font-body text-[10px] uppercase tracking-[0.2em] text-stone-400">
               <div className="space-y-4 flex flex-col">
                  <span className="text-white mb-2">Navigation</span>
                  <a href="#" className="hover:text-white transition-colors">Intro</a>
                  <a href="#" className="hover:text-white transition-colors">About</a>
                  <a href="/menu" className="hover:text-white transition-colors">Menu</a>
                  <a href="#" className="hover:text-white transition-colors">Contact</a>
               </div>
               <div className="space-y-4 flex flex-col">
                  <span className="text-white mb-2">Contact</span>
                  <a href="#" className="hover:text-white transition-colors">+91 98765 43210</a>
                  <a href="#" className="hover:text-white transition-colors">hello@creamisland.com</a>
                  <a href="#" className="hover:text-white transition-colors">Bhubaneswar, Odisha</a>
               </div>
            </div>
         </div>
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-10 relative z-10">
            <div className="flex gap-6 mb-6 md:mb-0">
               <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-colors hover-lift"><Facebook size={14} /></a>
               <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-colors hover-lift"><Instagram size={14} /></a>
               <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-colors hover-lift"><Twitter size={14} /></a>
            </div>
            <p className="font-body text-[10px] text-stone-600 uppercase tracking-widest">
               © 2026 Cream Island. All Rights Reserved.
            </p>
         </div>
         <div className="absolute bottom-0 left-0 w-full pointer-events-none opacity-[0.05] flex justify-center overflow-hidden z-0 select-none">
            <span className="text-[20vw] font-display leading-none whitespace-nowrap text-white font-bold animate-pulse">CREAM ISLAND</span>
         </div>
      </footer>
  );
};

export default Footer;
