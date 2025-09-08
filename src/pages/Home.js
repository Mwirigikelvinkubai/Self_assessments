// src/pages/Home.js
import React from "react";

function Home() {
  return (
    <section className="home-container">
      <div className="home-header">
        <h1 className="home-title">Welcome to the Self-Assessment Hub</h1>
        <p className="home-subtitle">
          Your Journey of Growth Starts Here. This is your space to pause,
          reflect, and realign as you grow in your leadership walk.
        </p>
      </div>

      <div className="home-content">
        <h2 className="section-heading">What You’ll Discover</h2>
        <ul className="features-list">
          <li>✔️ Check in on your well-being and strengthen resilience.</li>
          <li>
            ✔️ Explore your personality and see how your unique design shapes
            the way you lead and connect.
          </li>
          <li>
            ✔️ Reflect on your leadership journey and identify your next steps.
          </li>
          <li>
            ✔️ Use guided reflection tools to nurture Christ-centered
            leadership.
          </li>
          <li>
            ✔️ Open pathways for growth with mentorship and development
            resources.
          </li>
        </ul>
      </div>

      <footer className="home-footer">
        <p>
          <strong>
            Created by Missions of Hope International – Leadership Development
            Department
          </strong>
        </p>
      </footer>
    </section>
  );
}

export default Home;
