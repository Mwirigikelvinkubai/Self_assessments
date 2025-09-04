// src/components/Quiz.js
import React, { useEffect, useState } from "react";

function Quiz({ file }) {
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

  if (!data) return <p>Loading quiz...</p>;

  // ✅ Handle "Coming Soon" placeholders safely
  if (!data.questions || !data.scoring) {
    return (
      <div className="quiz coming-soon">
        <h3>{data.title || "Coming Soon"}</h3>
        <p>{data.description || "This assessment will be available soon."}</p>
      </div>
    );
  }

  const { questions, scoring, descriptions } = data;

  const handleAnswer = (value) => {
    const updated = [...answers, value];
    setAnswers(updated);

    if (updated.length === questions.length) {
      calculateResult(updated);
    } else {
      setStep(step + 1);
    }
  };

  const calculateResult = (finalAnswers) => {
    if (scoring.method === "sum_all") {
      // Total sum scoring (Depression, Burnout, PTSD)
      const total = finalAnswers.reduce((a, b) => a + b, 0);

      let label = "Unknown";
      for (let [name, range] of Object.entries(scoring.thresholds)) {
        if (total >= range.min && total <= range.max) {
          label = name;
          break;
        }
      }

      setResult({
        type: label,
        score: total,
        ...descriptions[label],
      });
    } else {
      // Indices scoring (Money Personality)
      const totals = {};
      Object.keys(scoring.categories).forEach((type) => (totals[type] = 0));

      Object.entries(scoring.categories).forEach(([type, indices]) => {
        if (Array.isArray(indices)) {
          indices.forEach((qIndex) => {
            const ans = finalAnswers[qIndex - 1]; // adjust index
            if (ans) totals[type] += ans;
          });
        }
      });

      const topType = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
      setResult({ type: topType, ...descriptions[topType] });
    }
  };

  if (result) {
    return (
      <div className="results">
        <h3>Result: {result.type}</h3>
        {result.score !== undefined && (
          <p>
            <strong>Score:</strong> {result.score}
          </p>
        )}
        <p>
          <strong>Characteristics:</strong> {result.characteristics}
        </p>
        <p>
          <strong>Strengths:</strong> {result.strengths}
        </p>
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
    <div className="quiz">
      {/* Progress bar */}
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${progress}%`,
            transition: "width 0.4s ease-in-out" // smooth animation
          }}
        ></div>
      </div>

      <h3>
        Question {step + 1} of {questions.length}
      </h3>
      <p>{questions[step]}</p>
      <div className="options">
        {scoring.labels && scoring.values ? (
          // Use labels/values if provided (Burnout, Depression, PTSD, improved Money Personality)
          scoring.labels.map((label, idx) => (
            <button key={idx} onClick={() => handleAnswer(scoring.values[idx])}>
              {label}
            </button>
          ))
        ) : (
          // Fallback (if labels missing)
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
