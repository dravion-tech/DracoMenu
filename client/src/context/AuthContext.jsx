import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = localStorage.getItem("user");
      const storedRestaurantId = localStorage.getItem("restaurantId");
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedRestaurantId) setRestaurantId(storedRestaurantId);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user, restaurantId } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    if (restaurantId) localStorage.setItem("restaurantId", restaurantId);
    setUser(user);
    setRestaurantId(restaurantId);
    return response.data;
  };

  const register = async (name, email, password, restaurantName) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      restaurantName,
    });
    // For pending owners, we might not want to log them in automatically
    // or we can log them in but App.jsx will handle the redirect.
    const { token, user, restaurantId } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    if (restaurantId) localStorage.setItem("restaurantId", restaurantId);
    setUser(user);
    setRestaurantId(restaurantId);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurantId");
    setUser(null);
    setRestaurantId(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, restaurantId, login, register, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
