import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Star, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { getMenuItemsAPI } from "../services/api";
import MenuCard from "../components/menu/MenuCard";
import { useCart } from "../context/CartContext";
import websocketService from "../services/websocket";

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cartCount, setIsCartOpen } = useCart();

  const fetchMenu = async () => {
    try {
      const res = await getMenuItemsAPI();
      if (res.data && Array.isArray(res.data)) {
        setMenuItems(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();

    websocketService.connect();
    const unsubscribe = websocketService.subscribe("/topic/menu", () => {
      fetchMenu();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getFilteredItems = () => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterType === "all"
          ? true
          : filterType === "veg"
            ? item.isVeg
            : !item.isVeg;
      return matchesSearch && matchesFilter;
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-sans selection:bg-black selection:text-white flex flex-col overflow-y">
      {/* Header */}
      <div className="p-6 md:p-10 flex justify-between items-center border-b border-stone-200 bg-[#FDFBF7] sticky top-0 z-30">
        <Link
          to="/"
          className="flex items-center gap-2 font-body text-xs uppercase tracking-widest hover:opacity-60 transition-transform hover:-translate-x-1"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h2 className="font-display text-3xl md:text-4xl text-[#1a1a1a] font-bold">
          OUR MENU
        </h2>
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 font-body text-xs uppercase tracking-widest hover:opacity-60"
        >
          Cart ({cartCount}) <ShoppingBag size={16} />
        </button>
      </div>

      <div className="flex-1 p-6 md:p-16 bg-[#FDFBF7]">
        <div className="max-w-5xl mx-auto animate-fade-in-up">
          {/* SEARCH CONTROL */}
          <div className="flex flex-col items-center justify-center mb-12 gap-8">
            <div className="relative group w-full max-w-md">
              <input
                type="text"
                placeholder="Search our menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-stone-300 py-3 pl-4 pr-10 focus:outline-none focus:border-black font-display italic placeholder:text-stone-300 text-xl transition-colors text-center"
              />
              <Search
                size={20}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 group-hover:text-black transition-colors"
                style={{ right: "10px" }} // inline style to ensure position if tailwind fails slightly
              />
            </div>

            {/* FILTER BUTTONS */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setFilterType("all")}
                className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all border ${
                  filterType === "all"
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-transparent text-stone-400 border-stone-200 hover:border-stone-400 hover:text-stone-600"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("veg")}
                className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all border ${
                  filterType === "veg"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-transparent text-stone-400 border-stone-200 hover:border-emerald-600 hover:text-emerald-600"
                }`}
              >
                Veg
              </button>
              <button
                onClick={() => setFilterType("non-veg")}
                className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all border ${
                  filterType === "non-veg"
                    ? "bg-red-600 text-white border-red-600 shadow-md"
                    : "bg-transparent text-stone-400 border-stone-200 hover:border-red-600 hover:text-red-600"
                }`}
              >
                Non-Veg
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-stone-400">
              Loading menu...
            </div>
          ) : (
            <div className="space-y-12">
              {getFilteredItems().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                  {getFilteredItems().map((item, index) => (
                    <MenuCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-stone-300">
                  <p className="font-display text-2xl italic">
                    No items found.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-20 flex justify-center text-stone-300 animate-pulse">
            <Star size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
