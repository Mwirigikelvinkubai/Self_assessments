import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";

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

  if (!data) return <p>Loading quiz...</p>;

  // ✅ Handle "Coming Soon" placeholders safely
  if (!data.questions || !data.scoring) {
    return (
      <div className="quiz-popup scale-in">
        <div className="quiz rotating-border-slow">
          <h3>{data.title || "Coming Soon"}</h3>
          <p>{data.description || "This assessment will be available soon."}</p>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
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
    let resultObj;

    if (scoring.method === "sum_all") {
      const total = finalAnswers.reduce((a, b) => a + b, 0);

      let label = "Unknown";
      for (let [name, range] of Object.entries(scoring.thresholds)) {
        if (total >= range.min && total <= range.max) {
          label = name;
          break;
        }
      }

      resultObj = {
        type: label,
        score: total,
        ...descriptions[label],
      };
    } else {
      const totals = {};
      Object.keys(scoring.categories).forEach((type) => (totals[type] = 0));

      Object.entries(scoring.categories).forEach(([type, indices]) => {
        if (Array.isArray(indices)) {
          indices.forEach((qIndex) => {
            const ans = finalAnswers[qIndex - 1];
            if (ans) totals[type] += ans;
          });
        }
      });

      const topType = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
      resultObj = { type: topType, ...descriptions[topType] };
    }

    setResult(resultObj);

    // 🎉 trigger confetti when result is set
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  if (result) {
    return (
      <div className="quiz-popup scale-in">
        <div className="results rotating-border-slow">
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
          <div className="result-actions">
            <button className="close-btn" onClick={onClose}>
              Close
            </button>
            <button
              className="retake-btn"
              onClick={() => {
                setAnswers([]);
                setStep(0);
                setResult(null);
              }}
            >
              Retake
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = Math.round(((step + 1) / questions.length) * 100);

  return (
    <div className="quiz-popup scale-in">
      <div className="rotating-border-slow quiz-container">
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

        <h3>
          Question {step + 1} of {questions.length}
        </h3>
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

        <div className="quiz-footer">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
