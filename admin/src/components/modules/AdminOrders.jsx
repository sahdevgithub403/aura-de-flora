import React, { useState, useEffect } from "react";
import { orderAPI } from "../../services/api";
import { Search, Loader2, Eye, X, RefreshCw } from "lucide-react";
import websocketService from "../../services/websocket";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.getAllOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error("Orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    websocketService.connect();
    const unsubscribe = websocketService.subscribe(
      "/topic/orders",
      (newOrder) => {
        setOrders((prevOrders) => {
          const orderExists = prevOrders.find((o) => o.id === newOrder.id);
          if (orderExists) {
            return prevOrders.map((o) => (o.id === newOrder.id ? newOrder : o));
          } else {
            return [newOrder, ...prevOrders];
          }
        });
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      // Status update will be received via WebSocket, but update locally for instant feedback
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Status update failed");
    } finally {
      setUpdating(null);
    }
  };

  const statusMap = {
    pending: { label: "Pending", class: "bg-amber-50 text-amber-600" },
    confirmed: { label: "Confirmed", class: "bg-blue-50 text-blue-600" },
    preparing: { label: "Preparing", class: "bg-indigo-50 text-indigo-600" },
    ready: { label: "Ready", class: "bg-cyan-50 text-cyan-600" },
    delivered: { label: "Delivered", class: "bg-emerald-50 text-emerald-600" },
    cancelled: { label: "Cancelled", class: "bg-rose-50 text-rose-600" },
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "all" || order.status.toLowerCase() === filter.toLowerCase();
    const customerName =
      order.user?.fullName || order.user?.username || "Guest";
    const matchesSearch =
      order.id?.toString().includes(searchQuery) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-slate-300" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex gap-2 flex-wrap">
          {[
            "all",
            "PENDING",
            "CONFIRMED",
            "PREPARING",
            "READY",
            "DELIVERED",
            "CANCELLED",
          ].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${filter === f ? "bg-orange-600 text-white shadow-sm" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
            >
              {f === "all" ? "All Orders" : f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-64"
            />
          </div>
          <button
            onClick={fetchOrders}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-semibold text-slate-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900 leading-none">
                    {order.user?.fullName || order.user?.username || "Guest"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {order.phoneNumber || order.user?.phoneNumber || "N/A"}
                  </p>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(order.orderDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">
                  ₹{order.totalAmount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusMap[order.status.toLowerCase()]?.class || "bg-slate-100 text-slate-500"}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">
                Order Details #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    Customer Information
                  </label>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedOrder.user?.fullName ||
                      selectedOrder.user?.username ||
                      "Guest"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedOrder.phoneNumber ||
                      selectedOrder.user?.phoneNumber ||
                      selectedOrder.user?.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    Delivery Address
                  </label>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    {selectedOrder.deliveryAddress || "Counter Pickup"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  Order Manifest
                </label>
                <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-200 overflow-hidden">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.menuItem?.name || "Deleted Item"}
                        </p>
                        <p className="text-xs text-slate-400">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold text-slate-700">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="p-4 bg-white flex justify-between items-center font-bold text-lg">
                    <span className="text-slate-500">Total Settlement</span>
                    <span className="text-orange-600">
                      ₹{selectedOrder.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter block mb-3">
                  Update Order Status
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    "PENDING",
                    "CONFIRMED",
                    "PREPARING",
                    "READY",
                    "DELIVERED",
                    "CANCELLED",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedOrder.id, s)}
                      disabled={updating === selectedOrder.id}
                      className={`py-2 rounded-lg text-[10px] font-bold transition-all border ${selectedOrder.status.toUpperCase() === s ? "bg-orange-600 border-orange-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
