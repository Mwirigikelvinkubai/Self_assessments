import React, { useState } from "react";
import "./Quiz.css";

function Quiz({ data }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion] === undefined) {
      alert("Please select an option before continuing.");
      return;
    }

    if (currentQuestion < data.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    let scores = {};
    for (let type in data.scoring) {
      scores[type] = 0;
      data.scoring[type].forEach((q) => {
        scores[type] += answers[q - 1] || 0;
      });
    }

    const best = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    setResult({
      type: best,
      ...data.resultMapping[best],
    });
  };

  const downloadCSV = () => {
    if (!result) return;

    let csvContent =
      "data:text/csv;charset=utf-8,Personality,Description,Strengths,Blindspots\n";
    csvContent += `"${result.type}","${result.description}","${result.strengths}","${result.blindspots}"\n`;

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${data.name}_result.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (result) {
    return (
      <div className="quiz-container">
        <h3>Your Result: {result.type}</h3>
        <p><b>Description:</b> {result.description}</p>
        <p><b>Strengths:</b> {result.strengths}</p>
        <p><b>Blindspots:</b> {result.blindspots}</p>
        <button onClick={downloadCSV}>Download CSV</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${((currentQuestion + 1) / data.questions.length) * 100}%`,
          }}
        ></div>
      </div>

      <div className="question">
        <p>{data.questions[currentQuestion]}</p>
        <div className="options">
          <input
            type="radio"
            id="opt1"
            name="q"
            value="1"
            checked={answers[currentQuestion] === 1}
            onChange={() => handleAnswer(1)}
          />
          <label htmlFor="opt1" className="strongly-disagree">
            Strongly Disagree
          </label>

          <input
            type="radio"
            id="opt2"
            name="q"
            value="2"
            checked={answers[currentQuestion] === 2}
            onChange={() => handleAnswer(2)}
          />
          <label htmlFor="opt2" className="disagree">
            Disagree
          </label>

          <input
            type="radio"
            id="opt3"
            name="q"
            value="3"
            checked={answers[currentQuestion] === 3}
            onChange={() => handleAnswer(3)}
          />
          <label htmlFor="opt3" className="neutral">
            Neutral
          </label>

          <input
            type="radio"
            id="opt4"
            name="q"
            value="4"
            checked={answers[currentQuestion] === 4}
            onChange={() => handleAnswer(4)}
          />
          <label htmlFor="opt4" className="agree">
            Agree
          </label>

          <input
            type="radio"
            id="opt5"
            name="q"
            value="5"
            checked={answers[currentQuestion] === 5}
            onChange={() => handleAnswer(5)}
          />
          <label htmlFor="opt5" className="strongly-agree">
            Strongly Agree
          </label>
        </div>
      </div>

      <button onClick={handleNext}>
        {currentQuestion < data.questions.length - 1 ? "Next" : "Finish"}
      </button>
    </div>
  );
}

export default Quiz;
