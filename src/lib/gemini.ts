import type { CandidateInfo, InterviewQuestion } from '../app/slices/InterviewSlice';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

async function callGemini(prompt: string) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("API Error Response:", errorBody);
      throw new Error(`API request failed with status ${response.status}: ${errorBody.error.message}`);
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const jsonText = rawText.replace(/^```json\s*|```$/g, '');
    
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from the AI. Please check your API key and network connection.");
  }
}

export const parseResumeAndExtractInfo = async (file: File): Promise<CandidateInfo> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf: PDFDocumentProxy = await pdfjsLib.getDocument(arrayBuffer).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
  }

  const prompt = `
    Analyze the following resume text and extract the person's full name, email address, and phone number.
    Return the result as a single, clean JSON object with the keys: "name", "email", "phone".
    If a field is not found, its value must be null. Do not include any extra text, explanations, or markdown.

    Resume Text:
    ---
    ${fullText.substring(0, 8000)} 
    ---
  `; 

  const extractedData = await callGemini(prompt);
  return extractedData;
};

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

export const scoreInterviewAndWriteSummary = async (questions: InterviewQuestion[], answers: string[]): Promise<{ score: number; summary: string }> => {
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

