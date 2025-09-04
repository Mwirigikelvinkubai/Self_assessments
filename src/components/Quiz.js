// src/components/Quiz.js
import React, { useState } from "react";

function Quiz({ title, data, onBack }) {
  const { questions, scoring, descriptions } = data;
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);

  const handleAnswer = (value) => {
    const updated = [...answers];
    updated[step] = value;
    setAnswers(updated);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult(updated);
    }
  };

  const calculateResult = (finalAnswers) => {
  // Case 1: index-based scoring (Money Personality)
  if (Array.isArray(Object.values(scoring)[0])) {
    const totals = {};
    Object.keys(scoring).forEach((type) => (totals[type] = 0));

    Object.entries(scoring).forEach(([type, indices]) => {
      indices.forEach((qIndex) => {
        const ans = finalAnswers[qIndex - 1];
        if (ans !== null) totals[type] += ans;
      });
    });

    const topType = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
    setResult({ type: topType, ...descriptions[topType] });
  }

  // Case 2: threshold-based scoring (Depression, Burnout, PTSD)
  else if (scoring.method === "sum_all") {
    const total = finalAnswers.reduce((sum, val) => sum + (val || 0), 0);

    let matched = "Minimal or None"; // fallback
    Object.entries(scoring.thresholds).forEach(([label, range]) => {
      if (total >= range.min && total <= range.max) {
        matched = label;
      }
    });

    setResult({
      type: matched,
      score: total,
      ...descriptions[matched],
    });
  }
};

  

  const exportCSV = () => {
    if (!result) return;
    const csvContent = `data:text/csv;charset=utf-8,Result,Details\n${result.type},"${JSON.stringify(
      result
    )}"`;
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `${title.replace(/\s+/g, "_").toLowerCase()}_result.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const progress = Math.round(((step + 1) / questions.length) * 100);

  if (result) {
    return (
      <div className="quiz-result">
        <h3>{title} Result: {result.type}</h3>
        {"characteristics" in result && (
          <>
            <p><b>Characteristics:</b> {result.characteristics}</p>
            <p><b>Strengths:</b> {result.strengths}</p>
            <p><b>Blindspots:</b> {result.blindspots}</p>
          </>
        )}
        {"advice" in result && (
          <p><b>Advice:</b> {result.advice}</p>
        )}
        <button onClick={exportCSV}>Download Result as CSV</button>
        <button onClick={onBack}>Back to Assessments</button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <h3>{title}</h3>
      <h4>Question {step + 1} of {questions.length}</h4>
      <p>{questions[step]}</p>
      <div className="options">
        {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map(
          (label, idx) => (
            <button key={idx} onClick={() => handleAnswer(idx + 1)}>
              {label}
            </button>
          )
        )}
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

export default Quiz;
