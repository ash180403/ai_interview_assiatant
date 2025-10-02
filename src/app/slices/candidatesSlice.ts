// --- IMPORTS ---
import { createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
// We import the type definitions from our other slice to ensure data consistency.
import type { CandidateInfo, InterviewQuestion } from './InterviewSlice';

// --- TYPE DEFINITIONS ---
// This defines the structure for a single, completed candidate profile.
// It contains everything we need to display on the dashboard and in the details view.
export interface CandidateProfile {
  id: string; // A unique ID for each candidate
  candidateInfo: CandidateInfo;
  questions: InterviewQuestion[];
  answers: string[];
  score: number;
  summary: string;
  date: string; // The date the interview was completed
}

// The state for this slice is simply an array of these profiles.
interface CandidatesState {
  profiles: CandidateProfile[];
}

// --- INITIAL STATE ---
// The app starts with an empty list of candidate profiles.
const initialState: CandidatesState = {
  profiles: [],
};

// --- SLICE CREATION ---
const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    // This is the only action we need for this slice.
    // It takes a complete `CandidateProfile` as its payload and adds it to our array.
    addCandidateProfile: (state, action: PayloadAction<CandidateProfile>) => {
      // We use unshift to add the newest candidate to the beginning of the array.
      state.profiles.unshift(action.payload);
    },
  },
});

// We export the action and the reducer.
export const { addCandidateProfile } = candidatesSlice.actions;
export default candidatesSlice.reducer;
