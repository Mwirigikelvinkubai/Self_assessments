// src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Assessments from "./pages/Assessments";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function PrivateRoute({ children, isLoggedIn }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// Logout button
function LogoutButton({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false); // ✅ instantly update auth state
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  return (
    <Router>
      <div className="App">
        <header className="header">
          <h1>MOHI Self-Assessment Hub</h1>
          <nav>
            <ul>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/assessments">Assessments</Link>
                  </li>
                  <li>
                    <Link to="/about">About</Link>
                  </li>
                  <li>
                    <LogoutButton setIsLoggedIn={setIsLoggedIn} />
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

        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/" />
                ) : (
                  <Login setIsLoggedIn={setIsLoggedIn} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isLoggedIn ? (
                  <Navigate to="/" />
                ) : (
                  <Signup setIsLoggedIn={setIsLoggedIn} />
                )
              }
            />

            {/* Private routes */}
            <Route
              path="/"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/assessments"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Assessments />
                </PrivateRoute>
              }
            />
            <Route
              path="/about"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <About />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        {isLoggedIn && (
          <footer className="footer">
            <p>
              &copy; {new Date().getFullYear()} Missions of Hope International – Leadership Development Department
            </p>
          </footer>
        )}
      </div>
    </Router>
  );
}

export default App;
