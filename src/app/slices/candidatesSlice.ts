// --- IMPORTS ---
// We import the necessary tools from Redux Toolkit.
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
// We import the type definitions from our other slice. This is a best practice
// to ensure our data structures are consistent across the entire application.
import type { CandidateInfo, InterviewQuestion } from './InterviewSlice';

// --- TYPE DEFINITIONS ---
// This interface defines the structure for a single, completed candidate profile.
// It contains every piece of information we need to display on the interviewer's dashboard
// and in the detailed view for each candidate.
export interface CandidateProfile {
  id: string; // A unique ID for each candidate (we'll use their email).
  candidateInfo: CandidateInfo;
  questions: InterviewQuestion[];
  answers: string[];
  score: number;
  summary: string;
  date: string; // The date the interview was completed.
}

// The state for this specific slice is simple: just an array of candidate profiles.
interface CandidatesState {
  profiles: CandidateProfile[];
}

// --- INITIAL STATE ---
// When the application first loads, the list of candidates is empty.
const initialState: CandidatesState = {
  profiles: [],
};

// --- SLICE CREATION ---
// We create the slice, giving it a name, its initial state, and its reducers.
const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  // Reducers are the only functions that can modify this slice's state.
  reducers: {
    // This is the only action this slice needs. Its job is to add a new candidate
    // to our list of profiles.
    addCandidateProfile: (state, action: PayloadAction<CandidateProfile>) => {
      // The `action.payload` will be the complete candidate profile object we create
      // after an interview is finished and scored.
      
      // We use `state.profiles.unshift(...)` instead of `push`. `unshift` adds the new
      // candidate to the *beginning* of the array, so the most recently completed
      // interview will always appear at the top of our dashboard table.
      state.profiles.unshift(action.payload);
    },
  },
});

// We export the action so we can dispatch it from our components (specifically, from IntervieweeTab.tsx).
export const { addCandidateProfile } = candidatesSlice.actions;

// We export the reducer as the default export so it can be included in our main Redux store.
export default candidatesSlice.reducer;

