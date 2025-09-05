// src/components/Quiz.js
import React, { useEffect, useState } from "react";

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
      .catch((err) => console.error("Error loading quiz:", err));
  }, [file]);

  // Loading state inside the popup box
  if (!data) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h3>Loading…</h3>
          {onClose && (
            <button className="close-btn" onClick={onClose} aria-label="Close">
              Close
            </button>
          )}
        </div>
        <p>Please wait while we load this assessment.</p>
      </div>
    );
  }

  // Handle "Coming Soon" placeholders safely
  const isPlaceholder = !data.questions || !data.scoring;
  if (isPlaceholder) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h3>{data.title || "Coming Soon"}</h3>
          {onClose && (
            <button className="close-btn" onClick={onClose} aria-label="Close">
              Close
            </button>
          )}
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
    if (scoring.method === "sum_all") {
      // Total sum scoring (Depression, Burnout, PTSD)
      const total = finalAnswers.reduce((a, b) => a + b, 0);

      let label = "Unknown";
      if (scoring.thresholds) {
        for (let [name, range] of Object.entries(scoring.thresholds)) {
          if (total >= range.min && total <= range.max) {
            label = name;
            break;
          }
        }
      }

      setResult({
        type: label,
        score: total,
        ...(descriptions[label] || {}),
      });
    } else {
      // Indices scoring (Money Personality)
      const categories = scoring.categories || scoring; // support both shapes
      const totals = {};
      Object.keys(categories).forEach((type) => (totals[type] = 0));

      Object.entries(categories).forEach(([type, indices]) => {
        if (Array.isArray(indices)) {
          indices.forEach((qIndex) => {
            const ans = finalAnswers[qIndex - 1]; // questions are 1-based in indices
            if (typeof ans === "number") totals[type] += ans;
          });
        }
      });

      const topType = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
      setResult({ type: topType, ...(descriptions[topType] || {}) });
    }
  };

  // Results view inside the popup
  if (result) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h3>Result: {result.type}</h3>
          {onClose && (
            <button className="close-btn" onClick={onClose} aria-label="Close">
              Close
            </button>
          )}
        </div>

        {result.score !== undefined && (
          <p>
            <strong>Score:</strong> {result.score}
          </p>
        )}
        {result.characteristics && (
          <p>
            <strong>Characteristics:</strong> {result.characteristics}
          </p>
        )}
        {result.strengths && (
          <p>
            <strong>Strengths:</strong> {result.strengths}
          </p>
        )}
        {result.blindspots && (
          <p>
            <strong>Blindspots:</strong> {result.blindspots}
          </p>
        )}
        {result.advice && (
          <p>
            <strong>Advice:</strong> {result.advice}
          </p>
        )}
      </div>
    );
  }

  // progress calculation
  const progress = Math.round(((step + 1) / questions.length) * 100);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h3>
          Question {step + 1} of {questions.length}
        </h3>
        {onClose && (
          <button className="close-btn" onClick={onClose} aria-label="Close">
            Close
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${progress}%`,
            transition: "width 0.4s ease-in-out",
          }}
        ></div>
      </div>

      <p>{questions[step]}</p>

      <div className="options">
        {scoring.labels && scoring.values ? (
          scoring.labels.map((label, idx) => (
            <button key={idx} onClick={() => handleAnswer(scoring.values[idx])}>
              {label}
            </button>
          ))
        ) : (
          [1, 2, 3, 4, 5].map((val) => (
            <button key={val} onClick={() => handleAnswer(val)}>
              {val}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default Quiz;
