// --- IMPORTS ---
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// --- TYPE DEFINITIONS ---
export interface CandidateInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
}

// We define a new structure for our interview questions.
export interface InterviewQuestion {
  id: number;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export type InterviewStatus =
  | 'idle'
  | 'parsing_resume'
  | 'awaiting_info'
  | 'ready_to_start'
  | 'in_progress' // The state when the interview is active.
  | 'completed';

interface InterviewState {
  status: InterviewStatus;
  candidateInfo: CandidateInfo;
  error: string | null;
  // --- STATE FOR THE LIVE INTERVIEW ---
  questions: InterviewQuestion[]; // An array to hold all the interview questions.
  answers: string[]; // An array to store the candidate's answers.
  currentQuestionIndex: number; // A number to track which question is currently active.
}

// --- INITIAL STATE ---
const initialState: InterviewState = {
  status: 'idle',
  candidateInfo: { name: null, email: null, phone: null },
  error: null,
  // We initialize our new properties with empty or default values.
  questions: [],
  answers: [],
  currentQuestionIndex: 0,
};

// --- SLICE CREATION ---
const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setParsingStatus: (state) => {
      state.status = 'parsing_resume';
      state.error = null;
    },
    setCandidateInfo: (state, action: PayloadAction<CandidateInfo>) => {
      state.candidateInfo = action.payload;
      if (!action.payload.name || !action.payload.email || !action.payload.phone) {
        state.status = 'awaiting_info';
      } else {
        state.status = 'ready_to_start';
      }
    },
    setInterviewError: (state, action: PayloadAction<string>) => {
      state.status = 'idle';
      state.error = action.payload;
    },
    updateCandidateField: (state, action: PayloadAction<{ field: keyof CandidateInfo; value: string }>) => {
      const { field, value } = action.payload;
      state.candidateInfo[field] = value;
    },
    validateCandidateInfo: (state) => {
      if (state.candidateInfo.name && state.candidateInfo.email && state.candidateInfo.phone) {
        state.status = 'ready_to_start';
        state.error = null;
      } else {
        state.error = "Please fill in all required fields.";
      }
    },
    // --- ACTION FOR STARTING THE INTERVIEW ---
    startInterview: (state, action: PayloadAction<InterviewQuestion[]>) => {
      state.questions = action.payload;
      state.answers = [];
      state.currentQuestionIndex = 0;
      state.status = 'in_progress';
    },
    // --- ACTION FOR SUBMITTING AN ANSWER ---
    submitAnswer: (state, action: PayloadAction<string>) => {
      state.answers.push(action.payload);
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      } else {
        state.status = 'completed';
      }
    },
  },
});

// We export all our actions so they can be used in our components.
export const {
  setParsingStatus,
  setCandidateInfo,
  setInterviewError,
  updateCandidateField,
  validateCandidateInfo,
  startInterview,   // This was previously missing
  submitAnswer,     // This was also previously missing
} = interviewSlice.actions;

export default interviewSlice.reducer;

