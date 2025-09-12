# 🌟 MOHI Self-Assessment Hub

A web-based platform by **Missions of Hope International (MOHI)** for interactive self-assessments, skill growth, and personal development.  
The first release focuses on **typing speed assessments** with real-time feedback and score tracking, with more assessments and features planned.  

---

## 🚀 Features (Current & Upcoming)

### ✅ Current
- Secure **user authentication** (signup, login, logout).
- **Protected routes** (only accessible after login).
- Typing **assessment tool** with speed (WPM), accuracy, and errors.
- Local storage of session state.

### 🔜 Upcoming (Roadmap)
- Save & view **assessment history**.
- Personalized **user dashboard** with progress charts.
- **Leaderboards & achievements** for motivation.
- Multi-assessment expansion (reading comprehension, logic, soft skills).
- Admin dashboard for **teachers/trainers**.
- **Google signup** & Single Sign-On.
- PDF **certificates of achievement**.
- MOHI-branded UI improvements and mobile-friendly design.

---

## 🛠️ Tech Stack

**Frontend**
- React (CRA / Vite)
- React Router
- Context API for Auth
- CSS (custom MOHI theme)

**Backend**
- Node.js / Express
- MongoDB (Mongoose ODM)
- JWT Authentication
- REST APIs

---

## 📂 Project Structure

self-assessments/
├── backend/ # Express server & API
│ ├── models/ # MongoDB models
│ ├── routes/ # API endpoints
│ └── server.js # App entry point
│
├── frontend/ # React client app
│ ├── src/
│ │ ├── pages/ # Login, Signup, Assessments, Home
│ │ ├── components/ # Reusable UI
│ │ ├── App.js # Routes & layout
│ │ └── index.js # Entry point
│ └── public/
│
└── README.md


---

## ⚡ Getting Started

### 1️⃣ Clone the repo
```bash
## git clone https://github.com/<your-username>/self-assessments.git
cd self-assessments

Backend Setup

cd backend
npm install
npm run dev   

Ensure you have MongoDB running locally or connect via Atlas.

Configure your .env file:

MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
PORT=5000

Frontend Setup

cd frontend
npm install
npm start   # runs React app on http://localhost:3000

🎯 Usage

Sign up / login to your account.

Take a typing assessment and view your score.

Future releases: track your progress, compare with others, and unlock achievements!

Phase 1: Core Foundation (MVP)

🔹 Goal: Make the app useful right away (typing assessments + saved results).

✅ Backend setup (authentication, user accounts).

✅ Frontend routes (login, signup, assessments).

🔜 Store typing results in DB (WPM, accuracy, errors, time).

🔜 Show results history (list of past attempts).

🔜 Logout + secure routes (done already).

Phase 2: Personalization & Dashboard

🔹 Goal: Give users a reason to return.

🔜 User profile (name, email, photo, optional bio).

🔜 Dashboard showing:

Best score, average score.

Graph of progress over time.

Recent attempts list.

🔜 Clear feedback after each test (e.g., “You improved by 7 WPM from last week 🎉”).

Phase 3: Gamification & Motivation

🔹 Goal: Make assessments engaging.

🔜 Leaderboards (daily, weekly, all-time).

🔜 Achievements/badges (🏅 First Test, 🚀 50 WPM, 🎯 100% Accuracy).

🔜 Streak tracking (keep users coming back daily).

Phase 4: Multi-Assessment Expansion

🔹 Goal: Broaden beyond typing.

🔜 Reading comprehension tests.

🔜 Math/logic assessments.

🔜 Soft skills (communication, problem-solving).

🔜 Support for uploading / creating assessments in backend.

Phase 5: Admin & Teacher Features

🔹 Goal: Make it useful for schools/organizations.

🔜 Admin dashboard:

View/manage users.

Reset passwords.

Export reports (CSV, PDF).

🔜 Teacher accounts:

View group-level performance.

Assign specific assessments.

Track progress of a class/team.

Phase 6: Advanced Features

🔹 Goal: Long-term growth & polish.

🔜 Google signup / Single Sign-On (SSO).

🔜 Email notifications (“Weekly Progress Report”).

🔜 Certificates (auto-generate PDFs for milestones).

🔜 Mobile-friendly UI / PWA (usable offline).

🔜 AI feedback (e.g., detect which keys slow you down and suggest practice). ##