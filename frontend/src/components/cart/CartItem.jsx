import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

const CartItem = ({ item }) => {
  const { updateQty, removeFromCart } = useCart();

  return (
    <div className="flex items-start gap-4 animate-fade-in-up">
      <div className="w-16 h-16 bg-stone-100 rounded-sm overflow-hidden shadow-sm">
        {item.image || item.imageUrl ? (
          <img
            src={item.imageUrl || item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <Plus size={16} />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-display text-xl mb-1 font-bold">{item.name}</h4>
        <p className="font-body text-xs text-stone-500 mb-2">₹{item.price}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateQty(item.id, -1)}
            className="w-6 h-6 border border-stone-200 rounded-full flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-colors"
          >
            <Minus size={12} />
          </button>
          <span className="font-body text-xs w-4 text-center">{item.qty}</span>
          <button
            onClick={() => updateQty(item.id, 1)}
            className="w-6 h-6 border border-stone-200 rounded-full flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
      <div className="font-body text-sm font-semibold">
        ₹{item.price * item.qty}
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-stone-300 hover:text-red-500 ml-2 hover:scale-110 transition-transform"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default CartItem;
