// src/components/Quiz.js
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function Quiz({ file, onClose }) {
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // reset state on new quiz load
    setData(null);
    setAnswers([]);
    setStep(0);
    setResult(null);

    fetch(`/assessments/${file}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load JSON");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        console.error("Error loading quiz:", err);
        setData({ title: "Error", description: "Failed to load assessment." });
      });
  }, [file]);

  // Simple confetti fallback
  const runConfetti = ({ count = 40, duration = 2500 } = {}) => {
    try {
      const colors = ["#FF6B6B", "#FFB86B", "#4AD99B", "#4D8BFF", "#8A6CFF"];
      const container = document.createElement("div");
      Object.assign(container.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: "100%",
        height: "100vh",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: "9999",
      });
      document.body.appendChild(container);

      for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        const size = Math.floor(Math.random() * 10) + 6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100 + "vw";
        const fallY = window.innerHeight + 50 + Math.random() * 200;
        const driftX = Math.random() * 100 - 50;

        Object.assign(particle.style, {
          position: "absolute",
          left,
          top: "-10px",
          width: `${size}px`,
          height: `${size * 1.3}px`,
          background: color,
          opacity: "0.8",
          borderRadius: Math.random() > 0.5 ? "3px" : "50%",
          transform: `translate(0, 0) rotate(0deg)`,
          transition: `transform 1200ms ease-out, opacity 900ms ease`,
        });

        container.appendChild(particle);
        setTimeout(() => {
          particle.style.transform = `translate(${driftX}px, ${fallY}px) rotate(360deg)`;
          particle.style.opacity = "0";
        }, 20 + i * 8);
        setTimeout(() => particle.remove(), duration + 1000);
      }
    } catch (e) {
      console.warn("Confetti fallback failed:", e);
    }
  };

  // Loading state
  if (!data) {
    return (
      <div className="quiz-container scale-in">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Loading…</h3>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
        <p>Please wait while the assessment loads.</p>
      </div>
    );
  }

  // "Coming Soon" case
  if (!data.questions || !data.scoring) {
    return (
      <div className="quiz-container rotating-border-slow scale-in">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>{data.title || "Coming Soon"}</h3>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
        <p>{data.description || "This assessment will be available soon."}</p>
      </div>
    );
  }

  const { questions, scoring, descriptions = {} } = data;

  const handleAnswer = (value) => {
    const updated = [...answers, value];
    setAnswers(updated);

    if (updated.length === questions.length) {
      calculateResult(updated);
    } else {
      setStep((s) => s + 1);
    }
  };

  const calculateResult = (finalAnswers) => {
    let resultObj = null;

    // conflict styles
    if (scoring && scoring.method === "conflict_styles") {
      const styles = {
        Avoiding: 0,
        Compromising: 0,
        Competing: 0,
        Collaborating: 0,
        Accommodating: 0,
      };
      finalAnswers.forEach((ans) => {
        switch (ans) {
          case "A": styles.Avoiding++; break;
          case "B": styles.Compromising++; break;
          case "C": styles.Competing++; break;
          case "D": styles.Collaborating++; break;
          case "E": styles.Accommodating++; break;
          default: break;
        }
      });
      const total = finalAnswers.length;
      const entries = Object.entries(styles).map(([style, count]) => ({
        name: style,
        value: count,
        percentage: ((count / total) * 100).toFixed(1),
      }));
      const top = entries.sort((a, b) => b.value - a.value)[0];
      resultObj = {
        type: top.name,
        count: top.value,
        breakdown: entries,
        ...(descriptions[top.name] || {}),
      };
    }
    // sum method
    else if (scoring && scoring.method === "sum_all") {
      const total = finalAnswers.reduce((a, b) => a + b, 0);
      let label = "Unknown";
      if (scoring.thresholds) {
        for (let [name, range] of Object.entries(scoring.thresholds)) {
          const min = typeof range.min === "number" ? range.min : -Infinity;
          const max = typeof range.max === "number" ? range.max : Infinity;
          if (total >= min && total <= max) {
            label = name;
            break;
          }
        }
      }
      resultObj = { type: label, score: total, ...(descriptions[label] || {}) };
    }
    // categories
    else {
      const categories = scoring.categories || {};
      const totals = {};
      Object.keys(categories).forEach((t) => (totals[t] = 0));
      Object.entries(categories).forEach(([type, indices]) => {
        if (Array.isArray(indices)) {
          indices.forEach((qIndex) => {
            const ans = finalAnswers[qIndex - 1];
            if (typeof ans === "number") totals[type] += ans;
          });
        }
      });
      const entries = Object.entries(totals);
      const topType = entries.length ? entries.sort((a, b) => b[1] - a[1])[0][0] : "Unknown";
      resultObj = { type: topType, ...(descriptions[topType] || {}) };
    }

    setResult(resultObj);
    runConfetti();
  };

  // Results screen
  if (result) {
    const COLORS = ["#FF6B6B", "#FFB86B", "#4AD99B", "#4D8BFF", "#8A6CFF"];
    return (
      <div className="results rotating-border-slow scale-in">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Result: {result.type}</h3>
          <div>
            <button className="close-btn" onClick={onClose}>Close</button>
            <button
              className="retake-btn"
              onClick={() => { setAnswers([]); setStep(0); setResult(null); }}
              style={{ marginLeft: "8px" }}
            >Retake</button>
          </div>
        </div>
        {result.score !== undefined && <p><strong>Score:</strong> {result.score}</p>}
        {result.count !== undefined && <p><strong>Top Count:</strong> {result.count}</p>}
        {result.characteristics && <p><strong>Characteristics:</strong> {result.characteristics}</p>}
        {result.strengths && <p><strong>Strengths:</strong> {result.strengths}</p>}
        {result.blindspots && <p><strong>Blindspots:</strong> {result.blindspots}</p>}
        {result.advice && <p><strong>Advice:</strong> {result.advice}</p>}
        {result.breakdown && (
          <PieChart width={320} height={280}>
            <Pie data={result.breakdown} cx="50%" cy="50%" outerRadius={90} dataKey="value"
              label={(entry) => `${entry.name} (${entry.percentage}%)`}>
              {result.breakdown.map((entry, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </div>
    );
  }

  // Question screen
  const progress = questions && questions.length ? Math.round(((step + 1) / questions.length) * 100) : 0;
  const currentQuestion = questions[step];
  const qText = typeof currentQuestion === "string" ? currentQuestion : currentQuestion.question;

  // Normalize options
  let options = [];
  if (currentQuestion.options) {
    if (Array.isArray(currentQuestion.options)) {
      options = currentQuestion.options.map((opt, i) => [i.toString(), opt]);
    } else if (typeof currentQuestion.options === "object") {
      options = Object.entries(currentQuestion.options); // [["A", "text"], ["B", "text"]...]
    }
  } else if (scoring.labels && scoring.values) {
    options = scoring.labels.map((label, i) => [scoring.values[i], label]);
  } else {
    options = [1, 2, 3, 4, 5].map((val) => [val, val.toString()]);
  }

  return (
    <div className="quiz-container rotating-border-slow scale-in">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Question {step + 1} of {questions.length}</h3>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%`, transition: "width 0.4s" }} />
      </div>
      <p>{qText}</p>
      <div className="options">
        {options.map(([value, label]) => (
          <button key={value} onClick={() => handleAnswer(value)}>{label}</button>
        ))}
      </div>
    </div>
  );
}

export default Quiz;
