// src/pages/Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // ✅ Shared styles
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

function Signup({ setIsLoggedIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");

      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");

      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Join MOHI Leadership and Development Assessment Hub 🌍</h2>
        <p className="auth-subtitle">Create your account to get started</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn">
            Signup
          </button>
        </form>

        <div className="divider">or</div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log("Google Login Failed")}
        />

        <p className="auth-footer">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
