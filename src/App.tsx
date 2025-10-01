// src/App.tsx

// --- IMPORTS ---
// We import our essential tools for routing and animation.
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
// We now need React hooks for state and effects to manage our modal.
import { useState, useEffect } from 'react';
// We need Redux hooks to check the interview status and dispatch actions.
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './app/store';
// We need the `resetInterview` action for the "Restart" button.
import { resetInterview } from './app/slices/InterviewSlice';

// We import our shadcn UI components.
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { Button } from './components/ui/button';
// We import our page and shared components.
import IntervieweeTab from './pages/IntervieweeTab';
import InterviewerTab from './pages/InterviewerTab';
import Header from './components/shared/Header';

// --- MAIN APP COMPONENT ---
function App() {
  const dispatch: AppDispatch = useDispatch();
  // We read the interview status directly from our Redux store. Because we updated our
  // store.ts, this value will be loaded from localStorage on page load.
  const interviewStatus = useSelector((state: RootState) => state.interview.status);

  // --- NEW STATE for the modal ---
  // This state controls whether the "Welcome Back" modal is visible or not.
  const [showWelcomeBackModal, setShowWelcomeBackModal] = useState(false);

  // --- NEW useEffect for checking status on load ---
  // This hook runs only once when the App component first mounts.
  useEffect(() => {
    // If the persisted state shows an interview is 'in_progress' when the user loads the app...
    if (interviewStatus === 'in_progress') {
      console.log("Detected an interview in progress. Showing 'Welcome Back' modal.");
      // ...we set the state to show our modal.
      setShowWelcomeBackModal(true);
    }
  }, []); // The empty dependency array `[]` ensures this runs only once on mount.

  // --- NEW Event Handlers for the modal ---
  const handleResume = () => {
    // To resume, we simply close the modal. The app will already be in the correct state
    // because that state was loaded from localStorage.
    setShowWelcomeBackModal(false);
  };

  const handleRestart = () => {
    // To restart, we dispatch the `resetInterview` action to clear the old session,
    // and then we close the modal.
    dispatch(resetInterview());
    setShowWelcomeBackModal(false);
  };

  return (
    // The `<Router>` component is the foundation for our app's navigation.
    <Router>
      {/*
        This is our main app container. It's where we'll create the Aurora background.
        - `min-h-screen`: Ensures it covers the full screen height.
        - `bg-[#020024]`: A very dark blue base color for our background.
        - `p-8 font-sans text-white`: Sets padding, default font, and white text for the whole app.
        - `overflow-hidden relative`: `overflow-hidden` prevents the large gradient shapes
          from creating scrollbars, and `relative` is needed to position them.
      */}
      <div className="min-h-screen bg-[#020024] p-8 font-sans text-white overflow-hidden relative">
        {/*
          These divs create our animated aurora effect. They are large, colored, blurred circles
          positioned absolutely behind our main content. We then animate their position.
        */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/*
          This style tag contains the CSS for our aurora animation.
          We define keyframes to move the blobs around the screen in a slow, circular path.
          The `animation-delay` in the classes above makes them move out of sync for a more organic feel.
        */}
        <style>
          {`
            .keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }
          `}
        </style>

        {/*
          This is a container to ensure our main content sits on top of the background animation.
          - `relative z-10`: `z-10` lifts this container and all its children above the
            absolutely positioned aurora blobs (which have a default z-index of 0).
        */}
        <div className="relative z-10 flex flex-col items-center">
            <Header />
            <main className="w-full max-w-6xl">
              <AnimatedRoutes />
            </main>
        </div>
        {/* --- NEW: The Welcome Back Modal --- */}
        {/* We use the Dialog component from shadcn, controlled by our new state. */}
        <Dialog open={showWelcomeBackModal}>
          <DialogContent className="bg-black/40 backdrop-blur-xl border-white/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl">Welcome Back!</DialogTitle>
              <DialogDescription className="text-white/60 pt-2">
                It looks like you were in the middle of an interview. Would you like to resume where you left off?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={handleRestart} className="text-white bg-transparent border-white/20 hover:bg-white/10 hover:text-white">
                Restart
              </Button>
              <Button onClick={handleResume} className="bg-cyan-500 text-black hover:bg-cyan-400">
                Resume Interview
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Router>
  );
}

// --- ANIMATED ROUTES COMPONENT ---
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      {/*
        Our navigation tabs, now styled for the glassmorphism theme.
      */}
      <Tabs defaultValue={location.pathname} className="mb-8">
        <TabsList className="w-full max-w-sm mx-auto grid grid-cols-2 bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-lg">
          <Link to="/" className="w-full">
            {/*
              The active tab now gets a bright cyan background, making it glow.
              The inactive tabs are semi-transparent, fitting our glass theme.
            */}
            <TabsTrigger value="/" className="w-full text-white data-[state=active]:bg-cyan-500 data-[state=active]:text-black data-[state=active]:shadow-lg rounded-md">
              Interviewee
            </TabsTrigger>
          </Link>
          <Link to="/interviewer" className="w-full">
            <TabsTrigger value="/interviewer" className="w-full text-white data-[state=active]:bg-cyan-500 data-[state=active]:text-black data-[state=active]:shadow-lg rounded-md">
              Interviewer
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      {/* AnimatePresence enables the exit/enter animations for our pages. */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<IntervieweeTab />} />
          <Route path="/interviewer" element={<InterviewerTab />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;