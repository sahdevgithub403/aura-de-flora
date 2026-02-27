
import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);

    setIsCartOpen(false);
    navigate('/checkout'); // Direct to Checkout
  };

  return (
    <div 
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
    >
        <div 
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
        >
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-[#FDFBF7]">
            <h2 className="font-display text-2xl font-bold">Your Selection</h2>
            <button onClick={() => setIsCartOpen(false)}><X size={20} className="text-stone-400 hover:text-black hover:rotate-90 transition-transform" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4 animate-fade-in-up">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p className="font-body text-xs uppercase tracking-widest">Cart is empty</p>
                    <Link to="/menu" onClick={() => setIsCartOpen(false)} className="text-black border-b border-black pb-1 font-body hover:opacity-60">Browse Menu</Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {cart.map(item => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>

        {cart.length > 0 && (
            <div className="p-6 bg-[#FDFBF7] border-t border-stone-100 animate-fade-in-up">
                <div className="flex justify-between items-center mb-6 font-display text-xl font-bold">
                    <span>Total</span>
                    <span>₹{cartTotal}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 font-body text-xs uppercase tracking-[0.2em] hover:bg-stone-800 transition-colors shadow-lg active:scale-[0.98]"
                >

                    Checkout
                </button>
            </div>
        )}
        </div>
    </div>
  );
};

export default CartDrawer;
