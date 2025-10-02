AI-Powered Interview Assistant
A sophisticated, AI-powered interview assistant designed to streamline the technical screening process for Full Stack Developer roles. This application provides a seamless experience for both the candidate and the interviewer, all within a stunning, modern user interface.

✨ Live Demo Link ✨
Project Overview
This project is a feature-complete, single-page application that fulfills the role of an AI-powered interview platform. It showcases a modern, fluid UI built with a "Glassmorphism" aesthetic, powered by a dynamic, animated aurora background. The application leverages the Google Gemini API for its core intelligence, handling everything from resume analysis to dynamic question generation and final performance scoring.

The entire experience is divided into two main views: a candidate-facing chat interface for conducting the timed interview, and a persistent, dynamic dashboard for the interviewer to review and manage all completed sessions.

🚀 Key Features
This application successfully implements all the core requirements of the project brief:

Interviewee Experience (Chat)
📄 AI-Powered Resume Parsing: Candidates can upload a PDF resume. The application reads the document and uses the Gemini API to automatically extract the candidate's name, email, and phone number.

🤖 Intelligent Info Collection: If the AI is unable to find any of the required details, a sleek form dynamically appears, prompting the user to fill in only the missing information.

⏱️ Timed, Multi-Difficulty Interview: The AI generates a unique set of 6 questions for a Full Stack role (2 Easy, 2 Medium, 2 Hard). Each question is presented one at a time with a dedicated, animated timer (20s, 60s, 120s).

➡️ Auto-Submission: If a candidate runs out of time on a question, the system automatically submits their current answer and proceeds to the next question.

Interviewer Experience (Dashboard)
📈 Dynamic Candidate Dashboard: The dashboard displays a real-time list of all candidates who have completed an interview.

📊 Search & Sort: The dashboard is fully interactive, allowing the interviewer to search for candidates by name and sort the list by score, name, or date.

📂 Detailed Interview Review: By clicking "View," an interviewer can open a detailed modal that shows the candidate's full profile, their final score, the AI-generated performance summary, and a complete transcript of the entire interview with every question and answer.

Core Architecture
💾 Local Persistence: All completed candidate profiles are saved to the browser's local storage using redux-persist, ensuring that data is never lost, even if the browser is closed and reopened.

↩️ Pause and Resume: If a candidate refreshes or closes the tab mid-interview, a "Welcome Back" modal appears upon their return, giving them the option to seamlessly resume where they left off or restart the interview.

🛠️ Tech Stack
Frontend: React, TypeScript, Vite

State Management: Redux Toolkit, React-Redux, Redux Persist

Styling: Tailwind CSS

UI Components: shadcn/ui

Animations: Framer Motion

AI Integration: Google Gemini API

PDF Parsing: pdf.js

🏛️ Architectural Decisions
A key requirement of this project was to "persist all data locally." To meet this, I chose to use redux-persist to save all completed interviews directly to the browser's Local Storage.

This approach perfectly fulfills the assignment's constraints. In a real-world, production environment, I would evolve this architecture by separating the Interviewee and Interviewer views into two distinct applications. They would communicate via a central cloud database (like Firebase Firestore) to ensure security, scalability, and multi-user accessibility for a hiring team.

🏁 Getting Started
To run this project on your local machine, follow these steps:

1. Clone the Repository

git clone <your-repository-url>
cd <repository-folder>

2. Install Dependencies

npm install

3. Set Up Your Environment Variables

You will need an API key from the Google Gemini API.

In the root of the project, create a new file named .env.local.

Add your API key to this file:

VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE

4. Run the Development Server

npm run dev

The application should now be running on http://localhost:5173.