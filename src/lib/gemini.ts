// --- IMPORTS ---
// We import the type definitions we created in our Redux slice. This ensures
// that the data we pass around our app has a consistent shape.
import type { CandidateInfo, InterviewQuestion } from '../app/slices/InterviewSlice';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// --- PDF WORKER SETUP (THE FINAL FIX) ---
// This is the definitive fix for the worker issue with Vite. We are pointing to the
// official CDN, but specifically to the `.mjs` (Module JavaScript) version of the worker file.
// Modern bundlers like Vite are designed to work with modules, and this version is
// fully compatible, resolving the "Failed to fetch" error.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;


// --- API CONFIGURATION ---
// We safely access our API key from the environment variables you created.
// Vite makes any variable starting with 'VITE_' available in our frontend code.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// THE DEFINITIVE FIX: The model name `gemini-1.5-flash-latest` is incorrect for the v1beta API.
// The correct, stable model name is simply `gemini-1.5-flash`. This will resolve the 404 error.
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

// --- HELPER FUNCTION for making API calls ---
// To avoid repeating the same fetch logic, we create this reusable helper function.
// It takes a "prompt" (our instructions for the AI) and handles the communication.
async function callGemini(prompt: string) {
  // We wrap our API call in a try...catch block to handle any potential network errors.
  try {
    // We use the browser's built-in `fetch` API to make a POST request to the Gemini URL.
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // The `body` of the request must be a JSON string. We structure our prompt
      // according to the Gemini API's requirements.
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    // If the response is not "ok" (e.g., a 404 or 500 error), we throw an error.
    if (!response.ok) {
      const errorBody = await response.json();
      console.error("API Error Response:", errorBody);
      throw new Error(`API request failed with status ${response.status}: ${errorBody.error.message}`);
    }

    const data = await response.json();
    // The AI's response is nested deep inside the data object. We safely navigate to get the raw text.
    const rawText = data.candidates[0].content.parts[0].text;
    
    // The AI sometimes helpfully wraps its JSON response in markdown backticks.
    // This line of code uses a regular expression to clean that up, leaving only the pure JSON.
    const jsonText = rawText.replace(/^```json\s*|```$/g, '');
    
    // We parse the cleaned text into a usable JavaScript object. If the text isn't valid JSON, this will throw an error.
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // If anything goes wrong, we throw a new, more user-friendly error that our UI can display.
    throw new Error("Failed to get a response from the AI. Please check your API key and network connection.");
  }
}

// --- FUNCTION 1: Extract Info from Resume ---
// This function is now powered by the real AI.
export const parseResumeAndExtractInfo = async (file: File): Promise<CandidateInfo> => {
  // Part 1: Read the PDF text (this logic remains the same).
  const arrayBuffer = await file.arrayBuffer();
  const pdf: PDFDocumentProxy = await pdfjsLib.getDocument(arrayBuffer).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
  }

  // Part 2: Craft a specific prompt and call the real AI API.
  // This prompt is our "instruction" to the AI, telling it exactly what to do and what format to use.
  const prompt = `
    Analyze the following resume text and extract the person's full name, email address, and phone number.
    Return the result as a single, clean JSON object with the keys: "name", "email", "phone".
    If a field is not found, its value must be null. Do not include any extra text, explanations, or markdown.

    Resume Text:
    ---
    ${fullText.substring(0, 8000)} 
    ---
  `; // Increased character limit for better parsing.

  // We call our helper function with the crafted prompt.
  const extractedData = await callGemini(prompt);
  // The AI should return a JSON object that matches our `CandidateInfo` type.
  return extractedData;
};

// --- FUNCTION 2: Generate Interview Questions ---
export const generateInterviewQuestions = async (): Promise<InterviewQuestion[]> => {
  const prompt = `
    You are an AI assistant for a tech company. Your task is to generate a series of 6 interview questions for a Full Stack Developer role with experience in React and Node.js.
    Provide exactly 2 'Easy', 2 'Medium', and 2 'Hard' questions.
    Return the result as a single, clean JSON array of objects.
    Each object must have three keys: "id" (a unique number from 1 to 6), "text" (the question), and "difficulty" (the string 'Easy', 'Medium', or 'Hard').
    Do not include any extra text, explanations, or markdown.
  `;
  
  const questions = await callGemini(prompt);
  return questions;
};

// --- FUNCTION 3: Score the Interview ---
export const scoreInterviewAndWriteSummary = async (questions: InterviewQuestion[], answers: string[]): Promise<{ score: number; summary: string }> => {
  // We format the Q&A data into a clean, readable string for the AI to analyze.
  const interviewTranscript = questions.map((q, i) => 
    `Question ${i + 1} (${q.difficulty}): ${q.text}\nAnswer ${i + 1}: ${answers[i] || "No answer was provided."}`
  ).join('\n\n');

  const prompt = `
    You are an expert technical interviewer reviewing an interview transcript.
    Your task is to do two things:
    1.  Provide a final score for the candidate out of 100. Base the score on the quality, correctness, and depth of their answers, considering the difficulty of the questions.
    2.  Write a concise, professional, 2-3 sentence summary of the candidate's performance, highlighting potential strengths or weaknesses.

    Return the result as a single, clean JSON object with two keys: "score" (a number between 0 and 100) and "summary" (a string).
    Do not include any extra text, explanations, or markdown.

    Interview Transcript:
    ---
    ${interviewTranscript}
    ---
  `;

  const result = await callGemini(prompt);
  return result;
};

