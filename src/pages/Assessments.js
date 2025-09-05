// src/pages/Assessments.js
import React, { useState } from "react";
import Quiz from "../components/Quiz";
import "./Assessments.css"; // import CSS

function Assessments() {
  const [activeFile, setActiveFile] = useState(null);

  const assessments = [
    {
      file: "money.json",
      title: "Money Personality",
      description:
        "Discover your financial habits and how they shape your decisions.",
    },
    {
      file: "burnout.json",
      title: "Burnout Check",
      description:
        "Evaluate your current stress levels and identify early signs of burnout.",
    },
    {
      file: "depression.json",
      title: "Depression Screening",
      description:
        "Gain insight into your emotional well-being and detect symptoms of depression.",
    },
    {
      file: "ptsd.json",
      title: "PTSD Check",
      description:
        "Assess potential symptoms of post-traumatic stress and explore support options.",
    },
    {
      file: "leadership.json",
      title: "Leadership Style",
      description: "Explore your leadership approach and strengths.",
    },
    {
      file: "conflict.json",
      title: "Conflict Management",
      description: "Discover how you navigate and resolve conflicts.",
    },
    {
      file: "gifts.json",
      title: "Spiritual Gifts",
      description:
        "Coming soon – Identify your spiritual gifts and how to use them.",
    },
    {
      file: "teamwork.json",
      title: "Teamwork Health",
      description:
        "Coming soon – Assess the strength and health of your teamwork.",
    },
    {
      file: "ei.json",
      title: "Emotional Intelligence",
      description:
        "Coming soon – Measure your ability to recognize and manage emotions.",
    },
    {
      file: "resilience.json",
      title: "Resilience Test",
      description:
        "Coming soon – Evaluate your resilience and adaptability in challenges.",
    },
  ];

  return (
    <section style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Assessments</h2>

      {/* 🔹 Popup area for quiz (questions or results) */}
      {activeFile && (
        <div className="quiz-popup live-border">
          <Quiz file={activeFile} onClose={() => setActiveFile(null)} />
        </div>
      )}

      {/* 🔹 Grid of assessment cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
          marginTop: activeFile ? "2rem" : "0",
        }}
      >
        {assessments.map((a) => (
          <div
            key={a.file}
            className={`card ${activeFile === a.file ? "active" : ""}`}
            style={{
              background: "#fff",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{a.title}</h3>
            <p style={{ fontSize: "0.9rem", color: "#444" }}>{a.description}</p>
            <button
              onClick={() => setActiveFile(a.file)}
              style={{
                marginTop: "0.5rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "5px",
                border: "none",
                background: activeFile === a.file ? "#0d6efd" : "#198754",
                color: "#fff",
                cursor: "pointer",
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
