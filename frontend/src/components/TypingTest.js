import React, { useState, useEffect } from "react";
import "./TypingTest.css";

function TypingTest({ onClose, onComplete }) {
  const texts = {
    short: `At MOHI, we live by four values. Bold dependence on God keeps us rooted in faith. Integrity guides us to be truthful and consistent. Servanthood calls us to put others first. Transformation reminds us to change lives and communities for the better.`,
    medium: `MOHI’s values give meaning to our mission. Bold dependence on God reminds us that real strength comes from Him. Integrity keeps us honest in words and actions, even when no one is watching. Servanthood inspires us to serve with humility and care. Transformation challenges us to bring lasting change in the lives of those we walk with. These values shape how we think, act, and serve daily.`,
    long: `Every day at MOHI, our work is guided by four key values that define who we are. We begin with bold dependence on God, trusting Him for wisdom, strength, and provision in all we do. We practice integrity by choosing to be honest and consistent, ensuring that our words and actions align with truth. Servanthood reminds us that leadership is not about power but about serving others with humility and love. Transformation drives us to go beyond temporary solutions and instead seek lasting change in people’s lives, families, and communities. Together, these values form the foundation of our culture and the heartbeat of our mission.`,
  };

  const [difficulty, setDifficulty] = useState("short");
  const [text, setText] = useState(texts.short);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setText(texts[difficulty]);
    setInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setCompleted(false);
  }, [difficulty]);

  useEffect(() => {
    if (input.length === 0 || completed) return;

    if (!startTime) setStartTime(Date.now());

    const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = input.trim().split(/\s+/).length;
    setWpm(Math.round(wordsTyped / elapsedMinutes));

    let correctChars = 0;
    for (let i = 0; i < input.length && i < text.length; i++) {
      if (input[i] === text[i]) correctChars++;
    }
    setAccuracy(Math.round((correctChars / input.length) * 100));

    // ✅ Check for completion
    if (input === text) {
      setCompleted(true);
      if (onComplete) onComplete();
    }
  }, [input, startTime, text, completed, onComplete]);

  const handleChange = (e) => {
    let value = e.target.value;
    // Prevent leading spaces breaking alignment
    if (input.length === 0) {
      value = value.replace(/^\s+/, "");
    }
    setInput(value);
  };

  const renderHighlightedText = () => {
    let output = [];
    for (let i = 0; i < text.length; i++) {
      if (i < input.length) {
        if (input[i] === text[i]) {
          output.push(
            <span key={i} className="correct">
              {text[i]}
            </span>
          );
        } else {
          output.push(
            <span key={i} className="incorrect">
              {text[i]}
            </span>
          );
        }
      } else {
        output.push(
          <span key={i} className="pending">
            {text[i]}
          </span>
        );
      }
    }

    // Show extra characters typed beyond the reference
    if (input.length > text.length) {
      output.push(
        ...input
          .slice(text.length)
          .split("")
          .map((char, idx) => (
            <span key={`extra-${idx}`} className="incorrect">
              {char}
            </span>
          ))
      );
    }

    return output;
  };

  return (
    <div className="quiz-popup scale-in">
      <div className="quiz rotating-border-slow">
        <h3>Typing Test</h3>

        {/* Difficulty selector */}
        <div className="difficulty-select">
          <button
            className={difficulty === "short" ? "active" : ""}
            onClick={() => setDifficulty("short")}
          >
            🟢 Short
          </button>
          <button
            className={difficulty === "medium" ? "active" : ""}
            onClick={() => setDifficulty("medium")}
          >
            🟡 Medium
          </button>
          <button
            className={difficulty === "long" ? "active" : ""}
            onClick={() => setDifficulty("long")}
          >
            🔴 Long
          </button>
        </div>

        {/* Highlighted text */}
        <div className="typing-text">{renderHighlightedText()}</div>

        {/* Typing area */}
        <textarea
          value={input}
          onChange={handleChange}
          placeholder="Start typing here..."
          className="typing-box"
          disabled={completed}
        />

        {/* Live stats */}
        <div className="typing-stats">
          <p>
            <strong>WPM:</strong> {isNaN(wpm) || !isFinite(wpm) ? 0 : wpm}
          </p>
          <p>
            <strong>Accuracy:</strong> {isNaN(accuracy) ? 0 : accuracy}%
          </p>
        </div>

        {/* Completion message */}
        {completed && (
          <div className="completion-message">
            🎉 Well done! You completed the typing test.
          </div>
        )}

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default TypingTest;
