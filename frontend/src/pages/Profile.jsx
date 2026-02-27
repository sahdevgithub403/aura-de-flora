import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Package,
  LogOut,
  MapPin,
  ChevronRight,
  Loader2,
  Calendar,
  Edit2,
  Save,
} from "lucide-react";
import api, { getProfileAPI, updateProfileAPI } from "../services/api";
import websocketService from "../services/websocket";
import { toast, Toaster } from "react-hot-toast";

const Profile = () => {
  const { user, logout, loading, updateUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const hasSyncedUser = useRef(false);

  const fetchData = async () => {
    try {
      const [orderRes, reservationRes, profileRes] = await Promise.all([
        api.get("/orders/my"),
        api.get("/reservations/my"),
        getProfileAPI(),
      ]);
      setOrders(orderRes.data || []);
      setReservations(reservationRes.data || []);
      setProfileData(profileRes.data);
      setNewAddress(profileRes.data?.address || "");

      // Sync auth context ONCE (prevents re-render loop)
      if (!hasSyncedUser.current) {
        hasSyncedUser.current = true;
        updateUser({
          name: profileRes.data?.fullName,
          email: profileRes.data?.email,
        });
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();

      websocketService.connect();

      const unsubscribeOrders = websocketService.subscribe(
        `/topic/order-status/${user.id}`,
        (updatedOrder) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
          );
          toast.success(`Order #${updatedOrder.id}: ${updatedOrder.status}`);
        },
      );

      const unsubscribeReservations = websocketService.subscribe(
        `/topic/reservation-updates/${user.id}`,
        (updatedRes) => {
          setReservations((prev) =>
            prev.map((r) => (r.id === updatedRes.id ? updatedRes : r)),
          );
          toast.success(
            `Reservation for ${updatedRes.date}: ${updatedRes.status}`,
          );
        },
      );

      return () => {
        unsubscribeOrders?.();
        unsubscribeReservations?.();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleUpdateAddress = async () => {
    try {
      await api.put("/user/profile", { address: newAddress });
      setProfileData((prev) => ({ ...prev, address: newAddress }));
      setIsEditingAddress(false);
      toast.success("Address updated successfully!");
    } catch (err) {
      toast.error("Failed to update address");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading || loadingData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="animate-spin text-[#E56E0C]" />
      </div>
    );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 px-6 pb-20">
      <Toaster />
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 pb-8">
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-stone-400 hover:text-[#1a1a1a] mb-4 text-xs uppercase tracking-widest font-bold transition-colors"
            >
              <ChevronRight size={14} className="rotate-180" /> Back to Home
            </Link>
            <h1 className="font-display text-4xl font-bold text-[#1a1a1a] mb-2">
              My Profile
            </h1>
            <p className="font-body text-sm text-stone-500 uppercase tracking-widest">
              Welcome back, {profileData?.fullName || user.name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition-colors font-body text-xs uppercase tracking-widest font-bold"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 h-fit space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">
                    {profileData?.fullName || user.name}
                  </h3>
                  <p className="text-stone-500 text-sm">
                    {profileData?.email || user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-50">
                <div className="text-center p-4 bg-stone-50 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">
                    Total Orders
                  </p>
                  <p className="font-display text-2xl font-bold">
                    {profileData?.totalOrders || orders.length}
                  </p>
                </div>
                <div className="text-center p-4 bg-stone-50 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">
                    Reservations
                  </p>
                  <p className="font-display text-2xl font-bold">
                    {reservations.length}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-50 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-2">
                    <MapPin size={12} /> Delivery Address
                  </p>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-[10px] font-bold text-[#E56E0C] hover:underline flex items-center gap-1"
                  >
                    {isEditingAddress ? (
                      "Cancel"
                    ) : (
                      <>
                        <Edit2 size={10} /> Edit
                      </>
                    )}
                  </button>
                </div>

                {isEditingAddress ? (
                  <div className="space-y-3">
                    <textarea
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full text-sm font-body p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#E56E0C]"
                      placeholder="Enter your delivery address..."
                      rows={3}
                    />
                    <button
                      onClick={handleUpdateAddress}
                      className="w-full bg-[#1a1a1a] text-white py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <Save size={14} /> Save Address
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-stone-600 leading-relaxed italic">
                    {profileData?.address ||
                      "No address saved. Click edit to add one."}
                  </p>
                )}
              </div>
            </div>

            {/* Reservations List */}
            <div>
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-[#E56E0C]" /> My
                Reservations
              </h3>
              {reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm">
                          {res.date} @ {res.time}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                            res.status === "CONFIRMED"
                              ? "bg-green-100 text-green-700"
                              : res.status === "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        {res.partySize} Guests
                      </p>
                      {res.specialRequest && (
                        <p className="text-xs text-stone-400 mt-1 italic">
                          "{res.specialRequest}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-white rounded-xl border border-dashed border-stone-200 text-stone-400 text-sm">
                  No reservations found.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COL: Order History (Existing Code) */}
          <div className="lg:col-span-2 space-y-6">
            {/* ... Existing Orders Code ... */}
            <h2 className="font-display text-2xl font-bold text-[#1a1a1a]">
              Recent Orders
            </h2>
            {/* ... mapped orders ... */}
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-6 rounded-xl border border-stone-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-body text-xs font-bold bg-stone-100 px-2 py-1 rounded text-stone-600">
                            Order #{order.id}
                          </span>
                          <span
                            className={`font-body text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded ${
                              order.status === "DELIVERED"
                                ? "bg-green-100 text-green-700"
                                : order.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-stone-100 text-stone-500"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-stone-400 text-xs">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="font-display text-lg font-bold">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                    {/* Items */}
                    <div className="space-y-2 border-t border-stone-100 pt-3">
                      {order.orderItems?.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-stone-600">
                            {item.quantity}x {item.menuItem?.name}
                          </span>
                          <span>₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-stone-100 border-dashed">
                <Package size={32} className="mx-auto text-stone-300 mb-3" />
                <p className="font-display text-stone-400">
                  No orders placed yet.
                </p>
                <Link
                  to="/menu"
                  className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-[#E56E0C] hover:underline"
                >
                  Browse Menu
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
