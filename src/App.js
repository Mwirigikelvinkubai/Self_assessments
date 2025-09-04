// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// Import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Assessments from "./pages/Assessments";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header */}
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
            </ul>
          </nav>
        </header>

        {/* Routes */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/about" element={<About />} />
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
