// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Assessments from "./pages/Assessments";

function Home() {
  return (
    <section className="intro">
      <h2>Welcome to the Self-Assessment Hub</h2>
      <p>
        A one-stop platform for guided self-reflection. Explore tools to check
        your well-being, personality, and leadership journey.
      </p>
      <p>
        <b>
          Created by Missions of Hope International – Leadership Development
          Department
        </b>
      </p>
    </section>
  );
}

function About() {
  return (
    <section className="about">
      <h2>About</h2>
      <p>
        The Self-Assessment Hub is designed for MOHI staff and partners as a
        safe space to reflect, grow, and gain insights. It combines different
        quizzes (mental health, personality, leadership, etc.) into one platform
        for convenience.
      </p>
    </section>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header */}
        <header className="header">
          <h1>MOHI Self-Assessment Hub</h1>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/assessments">Assessments</Link></li>
              <li><Link to="/about">About</Link></li>
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
            &copy; {new Date().getFullYear()} Missions of Hope International -
            Leadership Development Department
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
