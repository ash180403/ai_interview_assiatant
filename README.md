# 🤖 AI-Powered Interview Assistant

An AI-driven interview assistant built to make the technical screening process smoother for both candidates and interviewers. The app provides an end-to-end experience in a modern, glassmorphic user interface with fluid animations and smart state management.

---



🌐 **[Live Demo](https://ai-interview-assiatant.vercel.app/)**

---

## ⚙️ How the App Works

This project is a single-page application with React, TypeScript, and Redux at its core. Every part of the workflow is powered by state updates and well-structured logic. Here’s a full breakdown of how it works, step by step.

---

### 1. State Management: The Core Engine

At the heart of the app is a centralized Redux store. It’s split into two main slices:

* **`interviewSlice`**
  Tracks the state of a live interview session with a status property (`idle`, `parsing_resume`, `in_progress`, `completed`).
  This slice is **not persisted** so refreshing the page resets the interview. That way, users always start fresh unless they’re in the middle of something.

* **`candidatesSlice`**
  Stores completed candidate profiles.
  This slice **is persisted** so the interviewer’s dashboard always retains data even after a reload or session end.

This separation ensures active sessions stay clean, while interview history remains safe.

---

### 2. Candidate Flow: From Resume to Final Report

The candidate’s journey is built around small, predictable steps controlled by state changes.

#### a. Resume Parsing

* The uploaded PDF file is read as an `ArrayBuffer`.
* Using **pdf.js**, all pages are looped through and converted into one big text string.
* This text is sent to the **Google Gemini API** with a carefully structured prompt. The AI is asked to find key details (name, email, phone) and return them as a clean JSON object.
* The returned JSON updates the `interviewSlice`. If details are missing, the state switches to `awaiting_info`, and a dynamic form appears asking the candidate to fill in the gaps.

#### b. Live Timed Interview

* Once candidate details are set, the app asks Gemini to generate **6 unique, role-specific questions** with varying difficulty.
* The state switches to `in_progress`, rendering the live interview screen.
* Questions are displayed one by one. Each is wrapped in a **Timer** component:

  * The timer uses `useEffect` and `setInterval` to tick down.
  * A circular SVG timer is animated with **Framer Motion**.
  * When the timer hits zero, the answer auto-submits and the app moves to the next question.
* Answers can also be submitted manually. Either way, the Redux reducer increments the `currentQuestionIndex`.
* After the last question, the status becomes `completed`.

---

### 3. Local Persistence with Redux Persist

To avoid losing interviewer data, **redux-persist** is used.

* Every change to `candidatesSlice` is automatically synced with Local Storage.
* On page load, the stored state is **rehydrated** into Redux.
* This makes the dashboard permanent between sessions.
* For active interviews, persistence is deliberately skipped so candidates always restart clean.

---

### 4. The Interviewer Dashboard

The dashboard is a live, read-only view of all saved candidate profiles.

* Uses `useSelector` to read the `candidatesSlice`.
* Updates instantly whenever a new profile is added.
* Includes client-side search and sort (by name, score, or date). With `useMemo`, the list re-computes only when needed, keeping everything fast.
* Clicking “View” opens a modal with the candidate’s full transcript and AI-generated summary.

---

### 5. Visuals & Animations

The app is styled for a premium, modern feel.

* **Aurora Glass Theme**: A dark theme with animated gradient backgrounds and glassmorphism UI (transparent panels, blur effects, subtle borders).
* **Framer Motion Animations**:

  * Smooth page transitions with `AnimatePresence`.
  * Staggered element entrances (`staggerChildren`) for polished sequences.
  * Micro-interactions like hover effects and animated timers.

These touches make the experience feel engaging and interactive.

---

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite
* **State Management:** Redux Toolkit, React-Redux, Redux Persist
* **Styling & UI:** Tailwind CSS, shadcn/ui
* **Animations:** Framer Motion
* **AI Integration:** Google Gemini API
* **PDF Parsing:** pdf.js

---

## 📖 Summary

The AI-Powered Interview Assistant is more than a demo—it’s a complete flow. From parsing resumes with pdf.js and AI-driven prompts, to handling real-time timed interviews, to persisting candidate data for interviewers, every detail is designed to feel seamless. The Redux-based architecture ensures state remains predictable, while animations and glassmorphism elevate the user experience.
