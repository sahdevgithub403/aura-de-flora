import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Menu from "../pages/Menu";
import Cart from "../pages/Cart";
import ProtectedRoute from "../components/ProtectedRoute";
import Checkout from "../pages/Checkout";
import Profile from "../pages/Profile";
import Reservation from "../pages/Reservation";
import ScrollRevealDemo from "../components/ScrollRevealDemo";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/demo" element={<ScrollRevealDemo />} />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
    </Routes>
  );
};

export default AppRoutes;
