
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './app/store';
import { resetInterview } from './app/slices/InterviewSlice';
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { Button } from './components/ui/button';
import IntervieweeTab from './pages/IntervieweeTab';
import InterviewerTab from './pages/InterviewerTab';
import Header from './components/shared/Header';

function App() {
  const dispatch: AppDispatch = useDispatch();
  const interviewStatus = useSelector((state: RootState) => state.interview.status);
  const [showWelcomeBackModal, setShowWelcomeBackModal] = useState(false);

  useEffect(() => {
    if (interviewStatus === 'in_progress') {
      console.log("Detected an interview in progress. Showing 'Welcome Back' modal.");
      setShowWelcomeBackModal(true);
    }
  }, []); 

  const handleResume = () => {
    setShowWelcomeBackModal(false);
  };

  const handleRestart = () => {
    dispatch(resetInterview());
    setShowWelcomeBackModal(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#020024] p-8 font-sans text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
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

        <div className="relative z-10 flex flex-col items-center">
            <Header />
            <main className="w-full max-w-6xl">
              <AnimatedRoutes />
            </main>
        </div>
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

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <Tabs defaultValue={location.pathname} className="mb-8">
        <TabsList className="w-full max-w-sm mx-auto grid grid-cols-2 bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-lg">
          <Link to="/" className="w-full">
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