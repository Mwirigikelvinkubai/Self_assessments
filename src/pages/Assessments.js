import React, { useState, useEffect } from "react";
import Quiz from "../components/Quiz";
import "./Assessments.css";

function Assessments() {
  const [activeFile, setActiveFile] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const assessments = [
    { file: "money.json", title: "Money Personality", description: "Discover your financial habits and how they shape your decisions." },
    { file: "burnout.json", title: "Burnout Check", description: "Evaluate your current stress levels and identify early signs of burnout." },
    { file: "depression.json", title: "Depression Screening", description: "Gain insight into your emotional well-being and detect symptoms of depression." },
    { file: "ptsd.json", title: "PTSD Check", description: "Assess potential symptoms of post-traumatic stress and explore support options." },
    { file: "leadership.json", title: "Leadership Style", description: "Explore your leadership approach and strengths." },
    { file: "conflict.json", title: "Conflict Management", description: "Discover how you navigate and resolve conflicts." },
    { file: "gifts.json", title: "Spiritual Gifts", description: "Coming soon – Identify your spiritual gifts and how to use them." },
    { file: "teamwork.json", title: "Teamwork Health", description: "Coming soon – Assess the strength and health of your teamwork." },
    { file: "ei.json", title: "Emotional Intelligence", description: "Coming soon – Measure your ability to recognize and manage emotions." },
    { file: "resilience.json", title: "Resilience Test", description: "Coming soon – Evaluate your resilience and adaptability in challenges." },
  ];

  // apply/remove dark-mode class to <body>
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <section style={{ padding: "2rem" }}>
      {/* Header with Dark Mode Toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2>Assessments</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="toggle-btn"
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Popup for quiz */}
      {activeFile && (
        <div className="quiz-popup">
          <Quiz file={activeFile} onClose={() => setActiveFile(null)} />
        </div>
      )}

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {assessments.map((a) => (
          <div key={a.file} className={`card ${activeFile === a.file ? "active" : ""}`}>
            <h3>{a.title}</h3>
            <p style={{ fontSize: "0.9rem" }}>{a.description}</p>
            <button
              onClick={() => setActiveFile(a.file)}
              className="start-btn"
              style={{
                background: activeFile === a.file ? "#0d6efd" : "var(--btn-primary)",
              }}
            >
              {activeFile === a.file ? "Restart" : "Start"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Assessments;
