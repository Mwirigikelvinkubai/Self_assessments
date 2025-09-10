// src/App.js 
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

// Import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Assessments from "./pages/Assessments";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// Header with Logout logic
function Header() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUser = localStorage.getItem("currentUser");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <header className="header">
      <h1>MOHI Self-Assessment Hub</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/assessments">Assessments</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <span style={{ fontWeight: "bold" }}>
                  Hi, {currentUser}
                </span>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header */}
        <Header />

        {/* Routes */}
        <main>
          <Routes>
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/assessments" element={<PrivateRoute><Assessments /></PrivateRoute>} />
            <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>
            &copy; {new Date().getFullYear()} Missions of Hope International – 
            Leadership Development Department
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
