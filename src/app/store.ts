// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// --- Import our new slice reducer ---
import interviewReducer from './slices/InterviewSlice';
import candidatesReducer from './slices/candidatesSlice'; // This is the key import.

// We'll create this one in a future step.
// import candidatesReducer from './slices/candidatesSlice';

// Create the root reducer which combines all our slice reducers into one object.
const rootReducer = combineReducers({
  // We add our interview slice here under the key 'interview'.
  // Now, all data from this slice will be stored in `state.interview`.
  interview: interviewReducer,
  // We will add our slices here later
  // candidates: candidatesReducer,
  candidates: candidatesReducer,
});

// --- PERSISTENCE CONFIGURATION ---
const persistConfig = {
  key: 'root',
  storage,
  // Optional: You can choose to only persist certain slices.
  // For now, we'll persist everything.
  // whitelist: ['interview', 'candidates']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// --- STORE CREATION (no change) ---
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Recommended for redux-persist
    }),
});

// --- EXPORTS ---
export const persistor = persistStore(store);
// This `RootState` type is now correctly inferred from our `rootReducer`.
// It will now correctly have both `interview` and `candidates` properties, fixing the error.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
