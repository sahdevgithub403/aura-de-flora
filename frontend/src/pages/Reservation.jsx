import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Calendar, Clock, Users, MessageSquare } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Reservation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    partySize: 2,
    specialRequest: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to book a table");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reservations", formData);
      setSuccess(true);
      // Reset form or redirect
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      toast.error("Failed to book table. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center text-center p-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
          <Calendar size={40} />
        </div>
        <h2 className="font-display text-3xl font-bold mb-2">
          Request Received!
        </h2>
        <p className="text-stone-500 mb-6">
          We have received your reservation request. <br />
          Check your profile for confirmation status.
        </p>
        <button
          onClick={() => navigate("/profile")}
          className="text-orange-600 font-bold hover:underline"
        >
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-[#1a1a1a] mb-2">
              Book a Table
            </h1>
            <p className="text-stone-500 text-sm">
              Reserve your spot for a fine dining experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  size={18}
                />
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                  Time
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                    size={18}
                  />
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                  Guests
                </label>
                <div className="relative">
                  <Users
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                    size={18}
                  />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.partySize}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        partySize: parseInt(e.target.value),
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                Special Request
              </label>
              <div className="relative">
                <MessageSquare
                  className="absolute left-3 top-4 text-stone-400"
                  size={18}
                />
                <textarea
                  rows="3"
                  value={formData.specialRequest}
                  onChange={(e) =>
                    setFormData({ ...formData, specialRequest: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
                  placeholder="Anniversary, Birthday, etc."
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-display font-medium uppercase tracking-wider hover:bg-[#E56E0C] transition-colors shadow-lg disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Confirm Reservation"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Reservation;
