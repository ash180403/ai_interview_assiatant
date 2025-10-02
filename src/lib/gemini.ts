// --- IMPORTS ---
// We import the type definitions we created in our Redux slice. This ensures
// that the data we pass around our app has a consistent shape.
import type { CandidateInfo, InterviewQuestion } from '../app/slices/InterviewSlice';

// We need to import some specific things from the pdfjs-dist library.
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// --- PDF WORKER SETUP ---
// This line is crucial for the library to work in a web environment like Vite.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


// --- RESUME PARSING FUNCTION ---
// This function remains the same as before.
export const parseResumeAndExtractInfo = async (file: File): Promise<CandidateInfo> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf: PDFDocumentProxy = await pdfjsLib.getDocument(arrayBuffer).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
      fullText += pageText + '\n';
    }

    console.log("Extracted Text (would be sent to AI):", fullText.substring(0, 300) + '...');
    return new Promise((resolve) => {
      setTimeout(() => {
        if (Math.random() > 0.3) {
          console.log("Mock AI: Successfully extracted all info.");
          resolve({ name: 'Alice Johnson', email: 'alice.j@example.com', phone: '123-456-7890' });
        } else {
          console.log("Mock AI: Could not find all info.");
          resolve({ name: 'Bob Smith', email: null, phone: null });
        }
      }, 2000);
    });

  } catch (error) {
    console.error("Error parsing resume:", error);
    throw new Error("Failed to parse the resume. Please ensure it's a valid PDF file.");
  }
};


// --- QUESTION GENERATION FUNCTION ---
// This function also remains the same.
export const generateInterviewQuestions = async (): Promise<InterviewQuestion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock AI: Generating interview questions.");
      resolve([
        { id: 1, text: "What is the difference between `let`, `const`, and `var` in JavaScript?", difficulty: 'Easy' },
        { id: 2, text: "Explain the concept of component state in React.", difficulty: 'Easy' },
        { id: 3, text: "Describe the CSS box model.", difficulty: 'Medium' },
        { id: 4, text: "What are Promises and why are they useful in Node.js?", difficulty: 'Medium' },
        { id: 5, text: "Explain the concept of middleware in the context of Express.js.", difficulty: 'Hard' },
        { id: 6, text: "How would you optimize the performance of a slow React application?", difficulty: 'Hard' },
      ]);
    }, 1500);
  });
};

// --- NEW FUNCTION: SCORING AND SUMMARY ---
// This new function simulates the AI analyzing the questions and answers to produce a result.
export const scoreInterviewAndWriteSummary = async (
  questions: InterviewQuestion[],
  answers: string[]
): Promise<{ score: number; summary: string }> => {
  // We wrap the logic in a Promise to simulate a real network request to an AI service.
  return new Promise((resolve) => {
    // A 2.5-second delay simulates the AI doing the complex work of analysis.
    setTimeout(() => {
      console.log("Mock AI: Scoring interview and writing summary...");
      console.log("Questions:", questions);
      console.log("Answers:", answers);

      // In a real application, you would send the questions and answers to the Gemini API
      // with a specific prompt asking for a score and summary.
      // For now, we'll just generate a random score and a placeholder summary.

      const randomScore = Math.floor(Math.random() * (95 - 65 + 1)) + 65; // Random score between 65 and 95
      const mockSummary = "The candidate demonstrated a solid understanding of core concepts but could improve on advanced performance optimization techniques. Communication was clear and concise.";

      // Once the "AI" is done, we resolve the promise with the results.
      resolve({
        score: randomScore,
        summary: mockSummary,
      });
    }, 2500);
  });
};

