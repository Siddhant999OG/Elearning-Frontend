import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { server } from "../main";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Utility to configure headers with token
  const getAuthHeaders = () => ({
    headers: {
      token: localStorage.getItem("token"),
    },
  });

  const loginUser = async (email, password, navigate, fetchMycourse) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/login`, { email, password });

      if (data.user) {
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setIsAuth(true);
        navigate("/");
        fetchMycourse();
      } else {
        // User not found, navigate to registration page
        navigate("/register");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
      console.error("Login Error:", message);
    } finally {
      setBtnLoading(false);
    }
  };

  const registerUser = async (name, email, password, navigate) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/register`, { name, email, password });

      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      navigate("/verify");
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
      console.error("Registration Error:", message);
    } finally {
      setBtnLoading(false);
    }
  };

  const verifyOtp = async (otp, navigate) => {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");
    if (!activationToken) {
      toast.error("No activation token found. Please register again.");
      setBtnLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${server}/api/v1/verifyUser`, { otp, activationToken });

      toast.success(data.message);
      localStorage.removeItem("activationToken");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
      console.error("OTP Verification Error:", message);
    } finally {
      setBtnLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/profile`, getAuthHeaders());

      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch user";
      console.error("Fetch User Error:", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        loginUser,
        btnLoading,
        loading,
        registerUser,
        verifyOtp,
        fetchUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserContextProvider");
  }
  return context;
};