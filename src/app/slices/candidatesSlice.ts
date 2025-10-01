import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CandidateInfo, InterviewQuestion } from './InterviewSlice';

export interface CandidateProfile {
  id: string; 
  candidateInfo: CandidateInfo;
  questions: InterviewQuestion[];
  answers: string[];
  score: number;
  summary: string;
  date: string; 
}

interface CandidatesState {
  profiles: CandidateProfile[];
}

const initialState: CandidatesState = {
  profiles: [],
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidateProfile: (state, action: PayloadAction<CandidateProfile>) => {
      state.profiles.unshift(action.payload);
    },
  },
});

export const { addCandidateProfile } = candidatesSlice.actions;

export default candidatesSlice.reducer;

