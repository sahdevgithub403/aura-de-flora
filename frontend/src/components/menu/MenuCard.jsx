import React from "react";
import { Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";

const MenuCard = ({
  item,
  isHighlight = false,
  index = 0,
  isVisible = true,
}) => {
  const { addToCart } = useCart();
  const fallbackImage =
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500";
  const image = item.imageUrl || fallbackImage;
  const description = item.description || item.desc || "";

  if (isHighlight) {
    return (
      <div
        className={`group cursor-pointer ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        style={{ animationDelay: `${index * 100}ms` }}
        onClick={() => addToCart(item)}
      >
        <div
          className={`mb-6 overflow-hidden relative bg-stone-100 shadow-md hover-lift transition-all duration-500 ${index % 2 === 0 ? "aspect-[3/4]" : "aspect-square rounded-full"}`}
        >
          <img
            src={image}
            alt={item.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 filter saturate-[0.85] group-hover:saturate-100"
          />
          <div className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 shadow-lg z-10 hover:bg-black hover:text-white">
            <Plus size={16} />
          </div>
        </div>
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-body text-sm font-semibold uppercase tracking-wider group-hover:text-[#E56E0C] transition-colors">
            {item.name}
          </h3>
          <span className="font-display text-lg italic text-stone-500">
            ₹{item.price}
          </span>
        </div>
        <p className="font-display text-lg text-stone-400 leading-none group-hover:text-stone-600 transition-colors line-clamp-2">
          {description}
        </p>
      </div>
    );
  }

  // Full Menu List Item
  return (
    <div
      className="flex gap-4 md:gap-6 items-start group border-b border-stone-100 pb-6 hover:border-stone-300 transition-colors animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden shadow-sm hover-lift">
        <img
          src={image}
          alt={item.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="font-display text-xl md:text-2xl text-[#1a1a1a] font-semibold group-hover:text-[#E56E0C] transition-colors leading-tight">
            {item.name}
          </h4>
          {item.isVeg !== undefined && (
            <span
              className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${item.isVeg ? "border-green-600 text-green-600" : "border-red-600 text-red-600"}`}
            >
              {item.isVeg ? "VEG" : "NON-VEG"}
            </span>
          )}
        </div>
        <p className="font-body text-xs text-stone-500 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="flex flex-col items-end gap-3 self-center">
        <span className="font-body text-sm font-semibold whitespace-nowrap">
          ₹{item.price}
        </span>
        <button
          onClick={() => addToCart(item)}
          className="text-xs uppercase tracking-widest border border-stone-300 px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition-colors font-body active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={item.available === false}
        >
          {item.available === false ? "SOLD OUT" : "ADD"}
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
