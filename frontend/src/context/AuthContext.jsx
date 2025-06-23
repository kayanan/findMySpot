// src/context/AuthContext.jsx

import PropTypes from "prop-types";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // optional: to show logout notification

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null, // Will store the entire user object
    privilegeList: [],
  });
  const [loading, setLoading] = useState(true);

  // Reference to store the idle timeout ID
  // const idleTimeoutId = useRef(null);

  // Helper function: fetch full user from /auth/profile
  const fetchFullUser = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API_URL}/v1/user/profile`,
      {
        withCredentials: true,
      }
    );
    return data.user;
  };

  // LOGIN
  const login = async (credentials) => {
    try {
      // 1) Log in (which sets an HTTP-only cookie with the token)
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/v1/auth/login`,
        credentials,
        { withCredentials: true }
      );
      // 2) Now fetch the full user from /auth/profile
      const user = await fetchFullUser();
      // 3) Update auth state
      setAuthState({
        isAuthenticated: true,
        user,
        privilegeList: user.privilegeList || [],
        
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      // rethrow the full error so error.response.status stays available
      throw error;
    }
  };

  // LOGOUT
  const logout = async (manual = false) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setAuthState({
        isAuthenticated: false,
        user: null,
        privilegeList: [],
      });
      navigate("/login");
      if (manual) {
        toast.success("You have been logged out successfully", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.info("You have been logged out due to inactivity", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  // VALIDATE TOKEN: check if the user is still logged in, then fetch user
  const validateToken = async () => {
    try {
      const tokenResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/validate-token`,
        {
          withCredentials: true,
        }
      );
      const user = await fetchFullUser();
  
   
      setAuthState({
        isAuthenticated: true,
        user,
        privilegeList: user.privilegeList || [],
      });
    } catch (error) {
      console.error(
        "Token validation failed:",
        error.message || error.response?.data
      );
      setAuthState({
        isAuthenticated: false,
        user: null,
        privilegeList: [],
      });
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };
  
  // (Optional) Refresh privileges
  const updatePrivileges = async () => {
    try {
      const user = await fetchFullUser();
      setAuthState((prev) => ({
        ...prev,
        user,
        privilegeList: user.privilegeList || [],
      }));
      console.log("Privileges updated:", user.privilegeList);
    } catch (error) {
      console.error(
        "Failed to update privileges:",
        error.message || error.response?.data
      );
    }
  };

  // Set up auto logout after 30 minutes of inactivity when user is authenticated
  // useEffect(() => {
  //   if (authState.isAuthenticated) {
  //     // List of events that indicate user activity
  //     const events = [
  //       "mousemove",
  //       "mousedown",
  //       "keydown",
  //       "scroll",
  //       "touchstart",
  //     ];

  //     const resetIdleTimer = () => {
  //       if (idleTimeoutId.current) {
  //         clearTimeout(idleTimeoutId.current);
  //       }
  //       // Set the idle timer for 30 minutes (1800000 ms)
  //       idleTimeoutId.current = setTimeout(() => {
  //         logout();
  //       }, 30 * 60 * 1000);
  //     };

  //     // Register the event listeners for each event
  //     events.forEach((event) => {
  //       window.addEventListener(event, resetIdleTimer);
  //     });
  //     // Initialize the timer on mount
  //     resetIdleTimer();

  //     // Cleanup event listeners and timer on unmount or when authState changes
  //     return () => {
  //       events.forEach((event) => {
  //         window.removeEventListener(event, resetIdleTimer);
  //       });
  //       if (idleTimeoutId.current) {
  //         clearTimeout(idleTimeoutId.current);
  //       }
  //     };
  //   }
  // }, [authState.isAuthenticated]);

  // On mount, validate token
  useEffect(() => {
    validateToken();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ authState, login, logout, updatePrivileges }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
