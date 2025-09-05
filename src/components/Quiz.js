// src/components/Quiz.js
import React, { useEffect, useState } from "react";

/**
 * Quiz component
 * - Expects parent (Assessments.js) to render a surrounding .quiz-popup container.
 * - Renders content inside .quiz-container / .results so styling is consistent.
 * - Uses a small in-page confetti effect (no external dependency).
 */
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

  // Lightweight fallback confetti (no external package)
  const runConfetti = () => {
    try {
      const colors = ["#FF6B6B", "#FFB86B", "#4AD99B", "#4D8BFF", "#8A6CFF"];
      const count = 40;
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "0";
      container.style.top = "0";
      container.style.width = "100%";
      container.style.height = "0";
      container.style.pointerEvents = "none";
      container.style.overflow = "visible";
      container.style.zIndex = 9999;
      document.body.appendChild(container);

      for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        const size = Math.floor(Math.random() * 10) + 6; // 6 - 15 px
        particle.style.position = "absolute";
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.top = "-10px";
        particle.style.width = `${size}px`;
        particle.style.height = `${size * 1.3}px`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.opacity = String(0.9 - Math.random() * 0.5);
        particle.style.borderRadius = `${Math.random() > 0.5 ? "3px" : "50%"}`;
        particle.style.transform = `translateY(0) rotate(${Math.random() * 360}deg)`;
        particle.style.transition = `transform ${900 + Math.floor(Math.random() * 600)}ms cubic-bezier(.2,.8,.2,1), opacity 900ms ease`;
        container.appendChild(particle);

        // trigger the fall with a small stagger
        setTimeout(() => {
          const fallY = window.innerHeight + 50 + Math.random() * 200;
          const rotateDeg = 360 * (Math.random() > 0.5 ? 1 : -1);
          particle.style.transform = `translateY(${fallY}px) rotate(${rotateDeg}deg)`;
          particle.style.opacity = "0";
        }, 20 + i * 8);
        // remove particle after animation
        setTimeout(() => {
          particle.remove();
          if (i === count - 1) {
            container.remove();
          }
        }, 2000 + Math.floor(Math.random() * 500));
      }
    } catch (e) {
      // if anything goes wrong, silently ignore confetti
      // (we don't want to crash the quiz)
      console.warn("Confetti fallback failed:", e);
    }
  };

  // Loading state rendered inside the popup / card
  if (!data) {
    return (
      <div className="quiz-container scale-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Loading…</h3>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
        <p>Please wait while the assessment loads.</p>
      </div>
    );
  }

  // Handle "Coming Soon" placeholders safely and use the same card container
  if (!data.questions || !data.scoring) {
    return (
      <div className="quiz-container rotating-border-slow scale-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>{data.title || "Coming Soon"}</h3>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
        <p>{data.description || "This assessment will be available soon."}</p>
      </div>
    );
  }

  // Normal quiz flow
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
    // build result object
    let resultObj = null;

    if (scoring && scoring.method === "sum_all") {
      const total = finalAnswers.reduce((a, b) => a + b, 0);
      let label = "Unknown";

      if (scoring.thresholds) {
        for (let [name, range] of Object.entries(scoring.thresholds)) {
          // guard against missing min/max
          const min = typeof range.min === "number" ? range.min : -Infinity;
          const max = typeof range.max === "number" ? range.max : Infinity;
          if (total >= min && total <= max) {
            label = name;
            break;
          }
        }
      }

      resultObj = {
        type: label,
        score: total,
        ...(descriptions[label] || {}),
      };
    } else {
      // indices scoring (flexible handling)
      const categories = scoring.categories || (() => {
        // if the scoring object itself has arrays per category (like money.json), pick those
        const cat = {};
        Object.entries(scoring || {}).forEach(([k, v]) => {
          if (Array.isArray(v)) cat[k] = v;
        });
        return cat;
      })();

      const totals = {};
      Object.keys(categories).forEach((type) => (totals[type] = 0));

      Object.entries(categories).forEach(([type, indices]) => {
        if (Array.isArray(indices)) {
          indices.forEach((qIndex) => {
            const ans = finalAnswers[qIndex - 1]; // JSON indexes are 1-based
            if (typeof ans === "number") totals[type] += ans;
          });
        }
      });

      const entries = Object.entries(totals);
      if (entries.length === 0) {
        resultObj = { type: "Unknown", ...(descriptions["Unknown"] || {}) };
      } else {
        const topType = entries.sort((a, b) => b[1] - a[1])[0][0];
        resultObj = { type: topType, ...(descriptions[topType] || {}) };
      }
    }

    setResult(resultObj);

    // run confetti (fallback implementation)
    runConfetti();
  };

  // Results view (inside card)
  if (result) {
    return (
      <div className="results rotating-border-slow scale-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Result: {result.type}</h3>
          <div>
            <button className="close-btn" onClick={onClose}>Close</button>
            <button
              className="retake-btn"
              onClick={() => {
                setAnswers([]);
                setStep(0);
                setResult(null);
              }}
              style={{ marginLeft: "8px" }}
            >
              Retake
            </button>
          </div>
        </div>

        {result.score !== undefined && (
          <p><strong>Score:</strong> {result.score}</p>
        )}
        {result.characteristics && (
          <p><strong>Characteristics:</strong> {result.characteristics}</p>
        )}
        {result.strengths && (
          <p><strong>Strengths:</strong> {result.strengths}</p>
        )}
        {result.blindspots && (
          <p><strong>Blindspots:</strong> {result.blindspots}</p>
        )}
        {result.advice && (
          <p><strong>Advice:</strong> {result.advice}</p>
        )}
      </div>
    );
  }

  // Progress calculation (guard for zero-length)
  const progress = questions && questions.length ? Math.round(((step + 1) / questions.length) * 100) : 0;
  const currentQuestion = questions[step];

  return (
    <div className="quiz-container rotating-border-slow scale-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Question {step + 1} of {questions.length}</h3>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>

      {/* Progress bar */}
      <div className="progress-container" aria-hidden>
        <div
          className="progress-bar"
          style={{ width: `${progress}%`, transition: "width 0.4s ease-in-out" }}
        />
      </div>

      <p>{currentQuestion}</p>

      <div className="options" role="list">
        {scoring.labels && scoring.values ? (
          scoring.labels.map((label, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(scoring.values[idx])}
              aria-label={`Answer ${label}`}
            >
              {label}
            </button>
          ))
        ) : (
          [1, 2, 3, 4, 5].map((val) => (
            <button key={val} onClick={() => handleAnswer(val)} aria-label={`Answer ${val}`}>
              {val}
            </button>
          ))
        )}
      </div>

      <div className="quiz-footer" style={{ marginTop: 12 }}>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Quiz;
