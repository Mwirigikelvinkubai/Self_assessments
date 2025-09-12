// src/pages/Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example signup logic (replace with API later)
    localStorage.setItem("token", "dummy-token"); 
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);  // 👈 updates state instantly
    navigate("/");
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
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
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
