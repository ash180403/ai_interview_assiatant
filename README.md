# 🤖 AI-Powered Interview Assistant

A sophisticated, AI-powered interview assistant designed to streamline the technical screening process for **Full Stack Developer** roles.  
This application provides a seamless experience for both the **candidate** and the **interviewer**, all within a modern, glassmorphic user interface.

🌐 **[Live Demo](https://ai-interview-assiatant.vercel.app/)**

---

## 📌 Project Overview

This project is a **feature-complete single-page application** that serves as an AI-powered interview platform.  
It features a **fluid UI with Glassmorphism design** and a **dynamic aurora background**.  

The application leverages the **Google Gemini API** for intelligence, handling everything from **resume analysis** to **dynamic question generation** and **performance scoring**.

The experience is divided into two main views:
1. **Candidate Interface (Chat)** – Conducts the AI-driven interview.  
2. **Interviewer Dashboard** – Displays and manages completed sessions.

---

## 🚀 Key Features

### 🎯 Interviewee Experience
- **📄 Resume Parsing** – Upload a PDF resume. The app auto-extracts name, email, and phone using Gemini API.  
- **🤖 Intelligent Info Collection** – If details are missing, a sleek form appears dynamically.  
- **⏱️ Timed Interview** – 6 AI-generated questions (2 Easy, 2 Medium, 2 Hard) with timers:  
  - Easy → 20s  
  - Medium → 60s  
  - Hard → 120s  
- **➡️ Auto-Submission** – Answers auto-submit when time runs out.

### 👨‍💼 Interviewer Dashboard
- **📈 Candidate Dashboard** – Real-time list of completed interviews.  
- **🔍 Search & Sort** – Search by name, sort by score, name, or date.  
- **📂 Interview Review** – View candidate details, AI summary, final score, and complete Q/A transcript.

---

## 🏛 Core Architecture

- **💾 Local Persistence** – Data saved to browser’s Local Storage via `redux-persist`.  
- **↩️ Pause & Resume** – If a candidate leaves mid-interview, they can resume seamlessly.  

> 🔑 In production, the system could evolve into separate Interviewer & Interviewee apps communicating through a **cloud database** (e.g., Firebase Firestore) for **scalability & team access**.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite  
- **State Management:** Redux Toolkit, React-Redux, Redux Persist  
- **Styling:** Tailwind CSS  
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/), [framer motion](https://www.npmjs.com/package/framer-motion) 
- **Animations:** Framer Motion  
- **AI Integration:** Google Gemini API  
- **PDF Parsing:** pdf.js  

---
