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
        Your Journey of Growth Starts Here
Welcome to MOHI’s Leadership Development Self-Assessment Home. This is your space to pause, reflect, and realign as you grow in your leadership walk.

Here, you’ll discover tools that help you:

Check in on your well-being and find ways to stay balanced and resilient.

Explore your personality and uncover how your unique design shapes the way you lead and connect with others.

Reflect on your leadership journey and celebrate how far you’ve come, while identifying the next steps forward.

Use guided reflection tools to deepen self-awareness and nurture Christ-centered leadership.

Open up pathways for growth, with practical recommendations for learning, mentorship, and development.

This platform is here to support you—not just as a leader, but as a whole person—so you can continue to serve, inspire, and transform lives alongside the MOHI family.
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
        The Self-Assessment Hub is created for MOHI staff and partners as a safe and supportive space to reflect, grow, and gain valuable insights. It combines a range of tools—covering mental health, personality, leadership, and overall well-being—into one convenient platform.

Through this hub, you are encouraged to:

Pause and reflect on your personal and leadership journey.

Discover insights that strengthen self-awareness, resilience, and Christ-centered leadership.

Access resources that nurture both personal well-being and professional growth.

At MOHI, we believe that healthy, self-aware leaders are key to transforming lives and communities. This hub is designed to guide you in aligning your growth with our mission, while ensuring that you are supported in every step of your journey.

📧 Email: leadershipdevelopment@mohiafrica.org

📞 EXT 404
🌍 Website: www.mohiafrica.org
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
