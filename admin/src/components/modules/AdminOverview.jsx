import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { adminAPI } from "../../services/api";
import websocketService from "../../services/websocket";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalOrdersToday: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    revenueChange: "+0%",
    ordersChange: "+0%",
    pendingChange: "0%",
    avgChange: "+0%",
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [restaurantStatus, setRestaurantStatus] = useState({
    isOpen: true,
    statusMessage: "",
    estimatedWaitTime: "30-45 mins",
  });

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
    fetchRestaurantStatus();

    websocketService.connect();

    // Subscribe to stats updates
    const unsubscribeStats = websocketService.subscribe(
      "/topic/admin/stats",
      (newStats) => {
        setStats((prev) => ({ ...prev, ...newStats }));
      },
    );

    // Subscribe to NEW orders to update recent list
    const unsubscribeOrders = websocketService.subscribe(
      "/topic/orders",
      (newOrder) => {
        setRecentOrders((prev) => [newOrder, ...prev.slice(0, 4)]);
        // Also refresh stats when a new order arrives
        fetchStats();
      },
    );

    const unsubscribeStatus = websocketService.subscribe(
      "/topic/restaurant-status",
      (newStatus) => setRestaurantStatus(newStatus),
    );

    return () => {
      unsubscribeStats?.();
      unsubscribeOrders?.();
      unsubscribeStatus?.();
    };
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      if (response.data) {
        setStats((prev) => ({ ...prev, ...response.data }));
      }
    } catch (err) {
      console.error("Dashboard stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await adminAPI.getRecentOrders(5);
      setRecentOrders(response.data || []);
    } catch (err) {
      console.error("Recent orders error:", err);
    }
  };

  const fetchRestaurantStatus = async () => {
    try {
      const res = await adminAPI.getRestaurantStatus();
      setRestaurantStatus(res.data);
    } catch (err) {
      console.error("Status fetch error", err);
    }
  };

  const toggleStatus = async () => {
    try {
      const newStatus = {
        ...restaurantStatus,
        isOpen: !restaurantStatus.isOpen,
      };
      const res = await adminAPI.updateRestaurantStatus(newStatus);
      setRestaurantStatus(res.data);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    isPositive,
    prefix = "",
  }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">
          <Icon size={20} />
        </div>
        <div
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
        >
          {change}
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">
          {prefix}
          {typeof value === "number"
            ? Math.round(value).toLocaleString()
            : value}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${restaurantStatus.isOpen ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}
          >
            {restaurantStatus.isOpen ? (
              <TrendingUp size={24} />
            ) : (
              <Layers size={24} />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Restaurant Status</h3>
            <p className="text-sm text-slate-500">
              Currently:{" "}
              <span
                className={`font-bold ${restaurantStatus.isOpen ? "text-emerald-600" : "text-red-600"}`}
              >
                {restaurantStatus.isOpen ? "OPEN" : "CLOSED"}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={toggleStatus}
          className={`px-6 py-2 rounded-lg font-bold text-sm text-white transition-colors ${restaurantStatus.isOpen ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}`}
        >
          {restaurantStatus.isOpen ? "Close Restaurant" : "Open Restaurant"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          change={stats.revenueChange}
          icon={DollarSign}
          isPositive={true}
          prefix="₹"
        />
        <StatCard
          title="Orders Today"
          value={stats.totalOrdersToday}
          change={stats.ordersChange}
          icon={ShoppingBag}
          isPositive={true}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          change={stats.pendingChange}
          icon={Layers}
          isPositive={false}
        />
        <StatCard
          title="Avg. Order Value"
          value={stats.avgOrderValue}
          change={stats.avgChange}
          icon={TrendingUp}
          isPositive={true}
          prefix="₹"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-[400px]">
          <h4 className="text-base font-semibold text-slate-800 mb-8">
            Sales Overview
          </h4>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[40, 65, 45, 80, 55, 95, 70, 85, 60, 40, 75, 55].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-orange-100 rounded-t-sm hover:bg-orange-200 transition-colors cursor-pointer"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between px-4 mt-4 text-[10px] text-slate-400 font-medium">
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h4 className="text-base font-semibold text-slate-800 mb-6 flex justify-between items-center">
            Recent Activity
            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">
              Live
            </span>
          </h4>
          <div className="space-y-6">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                    <ShoppingBag size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      Order #{order.id}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(order.orderDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    ₹{order.totalAmount}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-sm italic">
                No recent orders
              </div>
            )}
          </div>
          <Link
            to="/orders"
            className="block text-center w-full mt-8 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
          >
            View All Activity
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
