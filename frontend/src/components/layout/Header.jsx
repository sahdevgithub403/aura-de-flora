import React from "react";
import { Menu as MenuIcon, User, LogOut, ShoppingBag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  return (
    <header
      className="fixed left-0 w-full z-40 bg-[#FDFBF7]/80 backdrop-blur-md py-6 transition-all duration-300 border-b border-stone-100"
      style={{ top: "var(--status-banner-height, 0px)" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-6">
          {/* Logo moved to left */}
          <Link to="/">
            <h1 className="font-display text-2xl font-bold tracking-wide cursor-pointer hover:scale-105 transition-transform">
              KABAB ISLAND
            </h1>
          </Link>
        </div>

        {/* Center Space or Nav Items if needed */}
        <div className="hidden md:flex flex-1 justify-center">
          {/* Can place additional nav links here */}
        </div>

        <div className="flex items-center gap-6 text-xs uppercase tracking-widest font-body">
          {!user && (
            <Link
              to="/login"
              className="flex items-center gap-2 hover:opacity-60 transition-opacity hover-lift p-2 rounded-full"
            >
              <User size={18} />
              <span className="hidden md:inline">Login</span>
            </Link>
          )}

          <Link
            to="/menu"
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-body hover:opacity-60 transition-opacity hover-lift p-2 rounded-full"
          >
            <MenuIcon size={16} /> Menu
          </Link>

          <Link
            to="/reservation"
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-body hover:opacity-60 transition-opacity hover-lift p-2 rounded-full"
          >
            Book Table
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 hover:opacity-60 transition-opacity relative hover-lift p-2 rounded-full"
          >
            <ShoppingBag size={18} />
            <span className="hidden md:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-[9px] flex items-center justify-center rounded-full animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>
          {/* Note: The 'Book Table' link scrolls to #reserve. On home page it works, on other pages it should redirect to home#reserve or keep it simple. */}

          {user && (
            <Link
              to="/profile"
              className="hidden md:flex items-center gap-2 px-5 py-2 border border-black rounded-full hover:bg-black hover:text-white transition-all hover-lift"
            >
              <User size={16} />
              <span>{user?.name?.split(" ")[0] || "User"}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
