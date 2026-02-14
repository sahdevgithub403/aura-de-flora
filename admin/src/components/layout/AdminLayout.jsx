import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import websocketService from "../../services/websocket";
import { toast, Toaster } from "react-hot-toast";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  LogOut,
  Bell,
  Search,
  Menu,
  User as UserIcon,
  Calendar,
  X,
} from "lucide-react";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change on mobile
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    websocketService.connect();
    const unsubscribe = websocketService.subscribe("/topic/orders", (order) => {
      // Only notify if it's a new order (status PENDING)
      if (order.status === "PENDING") {
        const customerName =
          order.user?.fullName || order.user?.username || "a Guest";
        toast.success(`New order from ${customerName}!`, {
          duration: 6000,
          position: "top-right",
          icon: "🛍️",
        });

        // Play a subtle sound if possible or other notification
        try {
          const audio = new Audio("/notification.mp3"); // Assuming file exists or fails gracefully
          audio.play().catch(() => {});
        } catch (e) {}
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/menu", label: "Menu Items", icon: UtensilsCrossed },
    { path: "/orders", label: "Orders", icon: ShoppingCart },
    { path: "/reservations", label: "Reservations", icon: Calendar },
  ];

  const currentPath = location.pathname.split("/")[1] || "dashboard";
  const pageTitle = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      <Toaster />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:w-64 md:flex flex-col
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <span className="font-bold text-slate-800 tracking-tight text-xl">
            CREAM ADMIN
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                ${
                  isActive
                    ? "bg-orange-50 text-orange-600 font-semibold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={20}
                    className={
                      isActive
                        ? "text-orange-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm md:shadow-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors md:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-slate-800 tracking-tight">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-700 leading-none">
                  {user?.username || "Admin"}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Administrator
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200 shadow-sm">
                <UserIcon size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
