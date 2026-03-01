import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes/AppRoutes";
import CartDrawer from "./components/cart/CartDrawer";
import StatusBanner from "./components/layout/StatusBanner";

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <CartProvider>
            <div
              className="antialiased min-h-screen flex flex-col transition-all duration-300"
              style={{ paddingTop: "var(--status-banner-height, 0px)" }}
            >
              <StatusBanner />
              <AppRoutes />
              <CartDrawer />
            </div>
          </CartProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Router>
  );
}

export default App;
