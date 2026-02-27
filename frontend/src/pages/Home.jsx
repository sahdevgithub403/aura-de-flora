import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MenuCard from "../components/menu/MenuCard";
import ScrollReveal from "../components/ScrollReveal";
import { getMenuItemsAPI } from "../services/api";
import { Link } from "react-router-dom";

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    getMenuItemsAPI().then((res) => {
      if (res.data && Array.isArray(res.data)) {
        setFeaturedItems(res.data.slice(0, 4));
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-12 px-4 md:px-0 min-h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12 md:gap-24">
          {/* Text Content */}
          <ScrollReveal
            variant="fade-up"
            className="w-full md:w-1/2 text-center md:text-left px-6 md:pl-12 order-2 md:order-1"
          >
            <span className="font-body text-xs text-stone-500 uppercase tracking-[0.3em] block mb-6">
              Est. 2026 • Fine Dining Experience
            </span>

            <h2 className="font-display text-5xl md:text-8xl text-[#1a1a1a] leading-[0.9] mb-8 font-extrabold">
              Culinary <br />
              <span className="font-medium text-stone-500">Mastery</span>
            </h2>

            <p className="font-body text-sm md:text-base text-stone-600 leading-relaxed max-w-md mx-auto md:mx-0 mb-10">
              Welcome to The Grand Bistro. Where timeless techniques meet the
              finest locally-sourced ingredients to create a symphony of
              unforgettable flavors.
            </p>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <Link
                to="/menu"
                className="bg-[#1a1a1a] text-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-stone-800 hover:scale-105 transition-all w-full md:w-auto font-body font-bold shadow-lg text-center"
              >
                View Menu
              </Link>
              <a
                href="#reserve"
                className="font-body text-xs uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition-opacity"
              >
                Reserve a Table
              </a>
            </div>
          </ScrollReveal>

          {/* Hero Image */}
          <ScrollReveal
            variant="slide-right"
            delay={200}
            className="w-full md:w-1/2 h-[50vh] md:h-[85vh] order-1 md:order-2 px-4 md:pr-12"
          >
            <div className="w-full h-full relative arch-mask overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80"
                alt="Exquisite Restaurant Dish"
                className="w-full h-full object-cover animate-ken-burns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

              <ScrollReveal
                variant="fade-up"
                delay={800}
                className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 text-white hidden md:block animate-float"
              >
                <p className="font-display text-2xl">"Taste of Perfection"</p>
                <div className="flex text-[#D4AF37] mt-2 gap-1">
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* --- FEATURES CIRCLES --- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            {
              title: "Fresh Ingredients",
              icon: "🥬",
              img: "https://images.unsplash.com/photo-1596423735880-5f2a689b903e?auto=format&fit=crop&w=400&q=60",
            },
            {
              title: "Chef Crafted",
              icon: "👨‍🍳",
              img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=60",
            },
            {
              title: "Farm to Table",
              icon: "🌿",
              img: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=400&q=60",
            },
          ].map((item, idx) => (
            <ScrollReveal
              key={idx}
              variant="fade-up"
              stagger={150}
              index={idx}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-48 h-48 rounded-full border border-stone-200 flex items-center justify-center mb-6 group-hover:border-stone-400 transition-colors relative overflow-hidden shadow-lg group-hover:scale-105 duration-500">
                <img
                  src={item.img}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                  alt={item.title}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
              </div>
              <h3 className="font-body text-xs uppercase tracking-widest text-stone-500 group-hover:text-black transition-colors transform group-hover:translate-y-1 duration-300">
                {item.title}
              </h3>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* --- MENU HIGHLIGHTS --- */}
      <section className="py-24 px-6 bg-[#FDFBF7]" id="menu-highlights">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="flex justify-between items-end mb-16 border-b border-stone-200 pb-6">
            <h2 className="font-display text-5xl md:text-6xl text-[#1a1a1a] font-bold">
              MENU{" "}
              <span className="text-stone-300 font-light text-4xl px-2">/</span>{" "}
              <span className="font-medium text-stone-500">essence</span>
            </h2>
            <Link
              to="/menu"
              className="font-body text-xs uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition-opacity"
            >
              Full Menu
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map((item, idx) => (
              <ScrollReveal
                key={item.id}
                variant="fade-up"
                stagger={100}
                index={idx}
                className="w-full h-full"
              >
                <MenuCard item={item} isHighlight={true} index={idx} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section
        className="relative py-32 px-4 bg-[#1a1a1a] text-white overflow-hidden"
        id="testimonials"
      >
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center animate-ken-burns"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black opacity-90"></div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          <ScrollReveal variant="fade-down">
            <span className="font-body text-xs text-[#D4AF37] uppercase tracking-[0.3em] block mb-6 px-4 py-2 border border-[#D4AF37]/30 rounded-full">
              What Our Guests Say
            </span>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={200}>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-20 font-bold">
              FINE{" "}
              <span className="text-stone-500 font-normal italic text-4xl md:text-6xl px-2">
                /
              </span>{" "}
              <span className="italic text-stone-300 font-normal">dining</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
            {[
              {
                name: "Sarah J.",
                role: "Food Critic",
                text: "The Truffle Risotto is simply out of this world. Best in the city!",
                rating: 5,
              },
              {
                name: "Michael T.",
                role: "Regular Guest",
                text: "An elegant atmosphere paired with truly exquisite culinary creations. Highly recommended.",
                rating: 5,
              },
              {
                name: "Elena R.",
                role: "Chef",
                text: "You can taste the quality of the ingredients in every single bite. Pure perfection.",
                rating: 5,
              },
            ].map((review, idx) => (
              <ScrollReveal
                key={idx}
                variant="fade-up"
                stagger={200}
                index={idx}
                className="bg-white/5 backdrop-blur-md p-10 rounded-2xl border border-white/10 hover:border-[#E56E0C]/50 transition-colors group h-full"
              >
                <div className="flex justify-center text-[#D4AF37] mb-6 gap-1 group-hover:scale-110 transition-transform">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="font-body text-stone-300 mb-8 leading-relaxed italic">
                  "{review.text}"
                </p>
                <div className="border-t border-white/10 pt-6">
                  <h4 className="font-display text-xl text-white font-bold">
                    {review.name}
                  </h4>
                  <p className="text-stone-500 text-xs uppercase tracking-widest mt-1">
                    {review.role}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal variant="fade-up" delay={400} className="mt-20">
            <Link
              to="/menu"
              className="bg-white text-black px-10 py-4 text-xs uppercase tracking-widest hover:bg-[#E56E0C] hover:text-white transition-all font-bold shadow-lg rounded-full inline-block"
            >
              Start Your Order
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
