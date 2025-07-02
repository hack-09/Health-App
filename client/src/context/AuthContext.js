import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const users = [
  { email: "doc@example.com", password: "doctor123", role: "doctor" },
  { email: "pat@example.com", password: "patient123", role: "patient" }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (email, password, role) => {
    const found = users.find(u => u.email === email && u.password === password && u.role === role);
    if (found) {
      const userData = { email, role };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
