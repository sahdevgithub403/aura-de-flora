import React, { useState, useEffect } from "react";
import axios from "axios";
import websocketService from "../../services/websocket";
import { AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

const StatusBanner = () => {
  const [status, setStatus] = useState({
    isOpen: true,
    statusMessage: "",
    estimatedWaitTime: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/restaurant-status`);
      setStatus(response.data);
    } catch (err) {
      console.error("Failed to fetch restaurant status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    websocketService.connect();
    const unsubscribe = websocketService.subscribe(
      "/topic/restaurant-status",
      (newStatus) => {
        setStatus(newStatus);
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!loading && !status.isOpen) {
      root.style.setProperty("--status-banner-height", "56px");
    } else {
      root.style.setProperty("--status-banner-height", "0px");
    }
  }, [loading, status.isOpen]);

  if (loading || status.isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-14 bg-red-600 text-white px-4 py-3 shadow-lg z-[60] flex items-center justify-center animate-slide-down">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <AlertCircle size={20} className="flex-shrink-0" />
        <div className="text-center">
          <p className="font-bold text-sm uppercase tracking-wider">
            Restaurant is Currently Closed
          </p>
          {status.statusMessage && (
            <p className="text-xs opacity-90 mt-1">{status.statusMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusBanner;
