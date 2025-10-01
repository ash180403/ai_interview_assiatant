// --- IMPORTS ---
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// --- TYPE DEFINITIONS ---
export interface CandidateInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
}
export interface InterviewQuestion {
  id: number;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// We include the new 'generating_questions' status in our type definition.
export type InterviewStatus =
  | 'idle'
  | 'parsing_resume'
  | 'awaiting_info'
  | 'ready_to_start'
  | 'generating_questions' // Our buffer state
  | 'in_progress'
  | 'completed';

interface InterviewState {
  status: InterviewStatus;
  candidateInfo: CandidateInfo;
  error: string | null;
  questions: InterviewQuestion[];
  answers: string[];
  currentQuestionIndex: number;
}

// --- INITIAL STATE ---
// This is the complete initial state for the slice.
const initialState: InterviewState = {
  status: 'idle',
  candidateInfo: { name: null, email: null, phone: null },
  error: null,
  questions: [],
  answers: [],
  currentQuestionIndex: 0,
};

// --- SLICE CREATION ---
const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  // This contains all the reducer functions for this slice.
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
    // This action sets the status for our new buffer screen.
    setGeneratingStatus: (state) => {
      state.status = 'generating_questions';
    },
    startInterview: (state, action: PayloadAction<InterviewQuestion[]>) => {
      state.questions = action.payload;
      state.answers = [];
      state.currentQuestionIndex = 0;
      state.status = 'in_progress';
    },
    submitAnswer: (state, action: PayloadAction<string>) => {
      state.answers.push(action.payload);
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      } else {
        state.status = 'completed';
      }
    },
    resetInterview: () => initialState,
  },
});

// We export all the actions, including our new `setGeneratingStatus`.
export const {
  setParsingStatus,
  setCandidateInfo,
  setInterviewError,
  updateCandidateField,
  validateCandidateInfo,
  setGeneratingStatus,
  startInterview,
  submitAnswer,
  resetInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;

