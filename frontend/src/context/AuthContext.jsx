import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  loginAPI,
  googleLoginAPI,
  signupAPI,
  setAuthErrorHandler,
  isTokenExpired,
  isAuthenticated as checkIsAuthenticated,
  clearAuthData,
} from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Logout function - clears state and localStorage
   */
  const logout = useCallback((reason = "User-initiated") => {
    console.warn(`Logout triggered. Reason: ${reason}`);
    setUser(null);
    clearAuthData();
  }, []);

  const updateUser = useCallback((userData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...userData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  /**
   * Handle authentication errors from axios interceptors
   * This is called when 401/403 is received or token expires
   */
  const handleAuthError = useCallback(
    (message) => {
      console.warn("Auth error received in context:", message);
      logout(`Auth interceptor: ${message}`);
    },
    [logout],
  );

  /**
   * Check if user session is valid (token exists and not expired)
   * Use this before making protected API calls
   */
  const isSessionValid = useCallback(() => {
    return checkIsAuthenticated();
  }, []);

  /**
   * Validate session and redirect to login if invalid
   * Returns true if session is valid, false otherwise
   */
  const validateSession = useCallback(() => {
    if (!checkIsAuthenticated()) {
      logout();
      return false;
    }
    return true;
  }, [logout]);

  useEffect(() => {
    // Wire up the auth error handler for axios interceptors
    setAuthErrorHandler(handleAuthError);

    // Check localStorage for persisted session
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        clearAuthData();
      }
    }

    setLoading(false);

    // Cleanup handler on unmount
    return () => {
      setAuthErrorHandler(null);
    };
  }, [handleAuthError]);

  const login = async (email, password) => {
    try {
      const response = await loginAPI(email, password);
      const data = response.data;

      // Handle both possible token field names from backend
      const jwt = data.token || data.accessToken;

      if (!jwt) {
        console.error("Login failed: No token received from server");
        return false;
      }

      // Handle role as string ("USER") or array (["ROLE_USER"])
      let userRole = data.role;
      if (!userRole && data.roles) {
        userRole = Array.isArray(data.roles)
          ? data.roles[0]?.replace("ROLE_", "")
          : data.roles;
      }

      const userData = {
        id: data.id,
        name: data.fullName || data.username || email,
        email: data.email || email,
        username: data.username,
        role: userRole || "USER",
      };

      // Save to state and localStorage
      setUser(userData);
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await signupAPI(name, email, password);

      // Auto login or redirect to login (Assuming backend returns success message)
      if (response.status === 200) {
        return await login(email, password);
      }
      return false;
    } catch (error) {
      console.error("Signup failed", error);
      return false;
    }
  };

  const googleLogin = async (idToken) => {
    try {
      const response = await googleLoginAPI(idToken);
      const data = response.data;
      const jwt = data.token || data.accessToken;

      if (!jwt) {
        console.error("Google login failed: No token received");
        return false;
      }

      const userData = {
        id: data.id,
        name: data.fullName || data.username || data.email,
        email: data.email,
        username: data.username,
        role: data.role || "USER",
      };

      setUser(userData);
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error(
        "Google login error:",
        error.response?.data || error.message,
      );
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        googleLogin,
        logout,
        loading,
        updateUser,
        isSessionValid,
        validateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
