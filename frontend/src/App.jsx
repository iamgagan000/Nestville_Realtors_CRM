import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./components/auth/Login/Login";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const [auth, setAuth] = useState(() => {
    return Boolean(localStorage.getItem("estate_token"));
  });

  const handleLogin = () => {
    setAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("estate_token");
    localStorage.removeItem("estate_user");

    setAuth(false);
  };

  return (
    <Routes>
      {/* =========================
          ROOT
      ========================= */}
      <Route
        path="/"
        element={
          auth ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* =========================
          LOGIN
      ========================= */}
      <Route
        path="/login"
        element={
          auth ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      {/* =========================
          PROTECTED CRM
      ========================= */}
      <Route
        path="/*"
        element={
          auth ? (
            <AppRoutes onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}