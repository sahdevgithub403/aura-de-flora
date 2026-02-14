import React, { useState, useEffect } from "react";
import { reservationAPI } from "../../services/api";
import { Check, X, Clock, Users, Calendar } from "lucide-react";
import websocketService from "../../services/websocket";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const response = await reservationAPI.getAllReservations();
      // Sort by date/time desc (newest first)
      const sorted = (response.data || []).sort((a, b) => {
        return (
          new Date(b.date + "T" + b.time) - new Date(a.date + "T" + a.time)
        );
      });
      setReservations(sorted);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();

    websocketService.connect();
    const unsubscribe = websocketService.subscribe(
      "/topic/reservations",
      (updatedRes) => {
        setReservations((prev) => {
          const exists = prev.find((r) => r.id === updatedRes.id);
          if (exists) {
            return prev.map((r) => (r.id === updatedRes.id ? updatedRes : r));
          } else {
            return [updatedRes, ...prev];
          }
        });
      },
    );

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await reservationAPI.updateReservationStatus(id, status);
      // No need to manually update state, WebSocket will do it
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading && reservations.length === 0) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Table Reservations</h2>

      <div className="grid gap-4">
        {reservations.map((res) => (
          <div
            key={res.id}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-lg text-slate-800">
                  {res.user?.name || res.user?.username || "Guest"}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    res.status === "CONFIRMED" || res.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-700"
                      : res.status === "REJECTED" || res.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {res.status}
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {res.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {res.time}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  {res.partySize} Guests
                </div>
              </div>
              {res.specialRequest && (
                <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                  Note: {res.specialRequest}
                </p>
              )}
            </div>

            {res.status === "PENDING" && (
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(res.id, "CONFIRMED")}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  <Check size={18} /> Confirm
                </button>
                <button
                  onClick={() => updateStatus(res.id, "REJECTED")}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  <X size={18} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {reservations.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            No reservations found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;
