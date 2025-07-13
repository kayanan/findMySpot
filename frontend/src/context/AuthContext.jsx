
// src/context/AuthContext.jsx

import PropTypes from "prop-types";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    privilegeList: [],
    loginAs: false,
  });

  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_APP_URL}/v1/user/profile/${userId}`,
      { withCredentials: true }
    );
    return data.user;
  };

  const login = async ({ username, password }) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_URL}/v1/auth/login`,
        { email: username, password },
        { withCredentials: true }
      );
      const baseUser = {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roles: data.roles,
        mobileNumber: data?.mobileNumber || "",
        parkingAreaId: data?.parkingAreaId || "",
      };
      if (data.roles.length > 1) {
        setAuthState({
          isAuthenticated: false,
          user: baseUser,
          privilegeList: data.roles,
          loginAs: false,
        });
        navigate("/login-as", { state: { roles: data.roles } });
      } else {
        localStorage.setItem('loginAs', true);
        localStorage.setItem('privilege', data.roles[0]);
        setAuthState({
          isAuthenticated: true,
          user: baseUser,
          privilegeList: data.roles,
          loginAs: true,
          privilege: data.roles[0],
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async (manual = false) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_URL}/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem('loginAs');
    localStorage.removeItem('privilege');
    setAuthState({
      isAuthenticated: false,
      user: null,
      privilegeList: [],
      loginAs: false,
    });

    navigate("/login");

    toast[manual ? "success" : "info"](
      manual ? "You have been logged out." : "Logged out due to inactivity.",
      { position: "top-center", autoClose: 3000 }
    );
  };

  const validateToken = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_APP_URL}/v1/user/current`,
        { withCredentials: true }
      );
      const loginAs = localStorage.getItem('loginAs');
      const baseUser = {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roles: data.roles,
        mobileNumber: data?.mobileNumber || "",
      };

      setAuthState({
        isAuthenticated: loginAs ? true : false,
        user: baseUser,
        privilegeList: data.roles,
        loginAs: loginAs ? true : false,
        privilege:  localStorage.getItem('privilege') || null,
      });
    } catch (error) {
      console.error("Token validation failed:", error);
      localStorage.removeItem('loginAs');
      localStorage.removeItem('privilege');
      setAuthState({
        isAuthenticated: false,
        user: null,
        privilegeList: [],
        loginAs: false,
      });
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const loginAs = (role) => {
    localStorage.setItem('loginAs', true);
    localStorage.setItem('privilege', role);
    setAuthState((prev) => ({
      ...prev,
      privilege: role,
      isAuthenticated: true,
      loginAs: true,
    }));
    navigate("/dashboard");
  };

  const updatePrivileges = async () => {
    try {
      const user = await fetchUserProfile(authState.user?.userId);
      setAuthState((prev) => ({
        ...prev,
        user,
        privilegeList: user.privilegeList || [],
      }));
      console.log("Privileges updated.");
    } catch (error) {
      console.error("Privilege update failed:", error);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ authState, login, logout, updatePrivileges, loginAs }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
