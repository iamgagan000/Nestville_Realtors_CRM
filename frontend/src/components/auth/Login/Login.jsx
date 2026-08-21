import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../../api";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({
    email: "admin@estatecrm.com",
    password: "admin123",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data } = await api.post(
        "/auth/login",
        form
      );

      // Save token
      localStorage.setItem(
        "estate_token",
        data.token
      );

      // Save user
      localStorage.setItem(
        "estate_user",
        JSON.stringify(data.user)
      );

      // Update authentication state
      onLogin?.();

      // Go to dashboard
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* BRAND */}
        <div className="login-brand">
          <img
            src="/nestville-logo.jpg"
            alt="Nestville Realtors"
          />

          <div>
            <b>NESTVILLE REALTORS</b>

            <span>
              Luxury Real Estate CRM
            </span>
          </div>
        </div>

        {/* TITLE */}
        <h1>Welcome back</h1>

        <p>
          Manage leads, properties, site visits
          and sales from one premium workspace.
        </p>

        {/* LOGIN FORM */}
        <form onSubmit={submit}>

          {/* EMAIL */}
          <label>
            Email

            <input
              required
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </label>

          {/* PASSWORD */}
          <label>
            Password

            <input
              required
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />
          </label>

          {/* ERROR */}
          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="primary full"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>
        </form>

        <small className="hint">
          Secure workspace • Nestville Realtors
        </small>
      </div>
    </div>
  );
}