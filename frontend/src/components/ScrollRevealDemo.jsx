import React from "react";
import ScrollReveal from "./ScrollReveal";
import { Star } from "lucide-react";

const ScrollRevealDemo = () => {
  return (
    <div className="min-h-screen bg-stone-50 p-8 space-y-24 overflow-hidden">
      {/* 1. Hero Section Animation */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <ScrollReveal variant="fade-down" delay={0} duration={1000}>
          <span className="text-xs font-bold tracking-[0.3em] text-stone-400 uppercase">
            Introducing
          </span>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={200} duration={1000}>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-stone-900">
            Scroll Reveal
          </h1>
        </ScrollReveal>

        <ScrollReveal variant="fade-in" delay={400} duration={1200}>
          <p className="max-w-lg mx-auto text-stone-600 font-body">
            A performant, modular, and reusable animation system for React.
            Built with IntersectionObserver and Tailwind CSS.
          </p>
        </ScrollReveal>
      </section>

      {/* 2. Grid Card Animation (Staggered) */}
      <section className="max-w-6xl mx-auto">
        <ScrollReveal variant="fade-up" className="mb-12 text-center">
          <h2 className="text-4xl font-display font-bold mb-4">
            Staggered Grid
          </h2>
          <p className="text-stone-500">
            Each card delays slightly based on its index.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <ScrollReveal
              key={index}
              variant="fade-up"
              stagger={100} // 100ms delay per item
              index={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-stone-100"
            >
              <div className="h-12 w-12 bg-stone-900 rounded-full mb-6 flex items-center justify-center text-white">
                <Star size={20} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold mb-2">Card {item}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                This element animates with a {index * 100}ms delay relative to
                the start.
              </p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 3. Section Fade-In Left/Right */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <ScrollReveal variant="slide-right" duration={1000}>
          <div className="aspect-square bg-stone-200 rounded-2xl overflow-hidden relative group">
            <img
              src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
              alt="Demo"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          <ScrollReveal variant="slide-left" delay={200}>
            <h2 className="text-5xl font-display font-bold">Smooth Entry</h2>
          </ScrollReveal>

          <ScrollReveal variant="slide-left" delay={300}>
            <p className="text-stone-600 leading-relaxed text-lg">
              Directional control allows elements to slide in from left, right,
              top, or bottom. Perfect for storytelling layouts.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={400}>
            <button className="bg-stone-900 text-white px-8 py-3 rounded-full hover:bg-stone-700 transition-colors uppercase tracking-wider text-xs font-bold">
              Learn More
            </button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default ScrollRevealDemo;
