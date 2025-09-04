// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// Quiz placeholder content
const quizContent = {
  "Money Personality": <p>[Money Personality Quiz Coming Soon]</p>,
  "Burnout Check": <p>[Burnout Assessment Coming Soon]</p>,
  "Depression Screening": <p>[Depression Screening Coming Soon]</p>,
};

function Home() {
  return (
    <section className="intro">
      <h2>Welcome to the Self-Assessment Hub</h2>
      <p>
        A one-stop platform for guided self-reflection. Explore tools to check
        your well-being, personality, and leadership journey.
      </p>
      <p>
        <b>
          Created by Missions of Hope International – Leadership Development
          Department
        </b>
      </p>
    </section>
  );
}

function Assessments() {
  const [activeQuiz, setActiveQuiz] = useState(null);

  return (
    <section className="assessments">
      <h2>Assessments</h2>
      <p>
        Choose a self-assessment below to begin. Click a tab to open that quiz
        on the same page.
      </p>
      <div className="tabs">
        {Object.keys(quizContent).map((quiz) => (
          <button
            key={quiz}
            className={activeQuiz === quiz ? "tab active" : "tab"}
            onClick={() => setActiveQuiz(quiz)}
          >
            {quiz}
          </button>
        ))}
      </div>
      <div className="quiz-area">
        {activeQuiz ? quizContent[activeQuiz] : <p>Select an assessment to start.</p>}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about">
      <h2>About</h2>
      <p>
        The Self-Assessment Hub is designed for MOHI staff and partners as a safe
        space to reflect, grow, and gain insights. It combines different quizzes
        (mental health, personality, leadership, etc.) into one platform for
        convenience.
      </p>
    </section>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header Navigation */}
        <header className="header">
          <h1>MOHI Self-Assessment Hub</h1>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/assessments">Assessments</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </nav>
        </header>

        {/* Routing */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Missions of Hope International - Leadership Development Department</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
