
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CartItem from '../components/cart/CartItem';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';


const Cart = () => {
    const { cart, cartTotal, clearCart } = useCart();
    
    // Calculate total including tax (5% mock)
    const tax = Math.round(cartTotal * 0.05);
    const finalTotal = cartTotal + tax;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-sans selection:bg-black selection:text-white flex flex-col">
        <Header />
        
        <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-20 animate-fade-in-up">
            <h1 className="font-display text-4xl font-bold mb-10">Your Cart</h1>
            
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-stone-400 space-y-6">
                    <ShoppingBag size={64} strokeWidth={1} />
                    <p className="font-body text-sm uppercase tracking-widest">Your cart is currently empty.</p>
                    <Link to="/menu" className="bg-[#1a1a1a] text-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-[#E56E0C] transition-colors font-body font-bold rounded-lg shadow-lg">
                        Browse Menu
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="flex-1 space-y-6">
                        <div className="space-y-6">
                            {cart.map(item => (
                                 <div key={item.id} className="border-b border-stone-200 pb-6 last:border-0">
                                    <CartItem item={item} />
                                 </div>
                             ))}
                        </div>
                         <button onClick={clearCart} className="text-xs text-red-500 underline uppercase tracking-widest hover:text-red-700 font-bold">Clear All Items</button>
                    </div>
                    
                    <div className="w-full md:w-80 h-fit sticky top-32">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                            <h3 className="font-display text-2xl font-bold mb-6">Summary</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between font-body text-sm text-stone-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold">₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between font-body text-sm text-stone-600">
                                    <span>Taxes (5%)</span>
                                    <span className="font-bold">₹{tax}</span>
                                </div>
                                <div className="pt-4 border-t border-dashed border-stone-200 flex justify-between font-display text-xl font-bold text-[#1a1a1a]">
                                    <span>Total</span>
                                    <span>₹{finalTotal}</span>
                                </div>
                            </div>
                            <Link to="/checkout" className="w-full block text-center bg-[#1a1a1a] text-white py-4 rounded-xl font-display font-medium uppercase tracking-wider hover:bg-[#E56E0C] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300">
                                Proceed to Checkout
                            </Link>
                        </div>
                        <p className="text-center text-[10px] text-stone-400 mt-4 uppercase tracking-widest">Secure Checkout</p>
                    </div>
                </div>
            )}
        </div>

        <Footer />
    </div>
  );
};

export default Cart;
