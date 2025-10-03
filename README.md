# AI-Powered Interview Assistant

This is a project I built as a fresher to explore how AI can help in technical interviews. The idea is simple: make the whole process smoother for both the candidate and the interviewer. The app has a clean glass-like UI with animations, and it handles everything from parsing resumes to running a timed interview.

---

## Live Demo

[Visit the app](https://ai-interview-assiatant.vercel.app/)

---

## How the App Works

It’s a single-page app made with React, TypeScript, and Redux. The whole flow runs on state management. Below is how each part works.

---

### 1. State Management

I used Redux Toolkit to manage the app’s data. There are two slices:

* **interviewSlice**
  This handles the current interview session. It keeps track of the status (like `idle`, `parsing_resume`, `in_progress`, or `completed`). I didn’t persist this slice so refreshing the page starts a new interview.

* **candidatesSlice**
  This stores the profiles of completed candidates. This one is persisted using redux-persist, so the interviewer’s dashboard always keeps the data even after reload.

---

### 2. Candidate Flow

The candidate journey has two parts: parsing the resume and the actual timed interview.

#### a. Resume Parsing

* When a PDF resume is uploaded, it’s read as an ArrayBuffer.
* I used **pdf.js** to extract all the text from each page into one string.
* That text is then sent to the **Google Gemini API** with a prompt asking for name, email, and phone in JSON format.
* The JSON updates the Redux store. If any details are missing, the state changes to `awaiting_info`, and a form is shown where the candidate can fill in the missing info.

#### b. Timed Interview

* Once details are ready, the app asks Gemini to generate 6 questions for the role.
* The status changes to `in_progress` and the interview screen shows up.
* Each question comes with a timer:

  * I used `useEffect` + `setInterval` for the countdown.
  * The timer is a circular SVG animated with **Framer Motion**.
  * When time runs out, the answer is auto-submitted.
* Answers can also be submitted manually. After each submission, the next question loads.
* At the end, the status is set to `completed`.

---

### 3. Data Persistence

I used **redux-persist** to keep interviewer data safe.

* Whenever a candidate profile is saved, it’s written into Local Storage.
* On reload, the data is rehydrated back into Redux.
* This way the dashboard is permanent between sessions.
* For active interviews, I didn’t persist anything so they always restart clean.

---

### 4. Interviewer Dashboard

The interviewer gets a dashboard with all stored profiles.

* It reads data directly from Redux.
* Updates automatically when a new profile is added.
* Has search and sort (by name, score, date). I used `useMemo` so it doesn’t re-render unnecessarily.
* Clicking "View" opens a modal with full transcript and AI summary.

---

### 5. Visuals & Animations

I wanted the app to look modern and smooth, so I tried a few design tricks.

* **Aurora Glass Theme**: dark theme, blurred panels, subtle borders.
* **Framer Motion** for animations:

  * Smooth page transitions.
  * Staggered entrances so elements appear one after another.
  * Hover and timer animations for small interactions.

---

## Tech Stack

* React, TypeScript, Vite
* Redux Toolkit, Redux Persist
* Tailwind CSS, shadcn/ui
* Framer Motion
* Google Gemini API
* pdf.js

---

## Summary

This project shows how AI can be used to handle resume parsing, generate interview questions, and keep track of candidates. I focused on making the flow simple but complete, while also learning things like state management, persistence, and animations.
