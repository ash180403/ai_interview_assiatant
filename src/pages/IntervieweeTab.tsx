// --- IMPORTS ---
// We need motion and AnimatePresence for all our animations.
import { motion, AnimatePresence } from 'framer-motion';
// We import all the UI components and icons we'll need for this complex view.
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { UploadCloud, Loader2, AlertCircle, UserCheck, Edit, Bot, Send, Star } from 'lucide-react';
// We need React hooks for managing component-level state and references.
import React, { useState, useEffect } from 'react';

// --- Redux Imports ---
// These hooks are how our component will talk to the Redux store.
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
// We import all the actions we defined in our slice.
import {
  setParsingStatus, setCandidateInfo, setInterviewError,
  updateCandidateField, validateCandidateInfo,
  startInterview, submitAnswer,
} from '../app/slices/InterviewSlice';

// --- Our AI Service ---
// We import both functions from our gemini.ts file.
import { parseResumeAndExtractInfo, generateInterviewQuestions } from '../lib/gemini';

// --- Animation Variants ---
// These predefined animation objects keep our JSX clean and readable.
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.2 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

// --- MAIN INTERVIEWEE TAB COMPONENT ---
const IntervieweeTab = () => {
  // --- Redux Hooks ---
  // `useDispatch` gives us the `dispatch` function, which is how we send actions to Redux.
  const dispatch: AppDispatch = useDispatch();
  // `useSelector` lets us read data from the Redux store. We are "subscribing" to these state values.
  const { status, error, candidateInfo } = useSelector((state: RootState) => state.interview);

  // --- React Hooks ---
  // `useRef` creates a reference to the hidden file input element, so we can "click" it with our button.
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  // `useState` manages the form data for the "missing info" screen.
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  // --- Event Handlers ---
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(setParsingStatus());
      try {
        const info = await parseResumeAndExtractInfo(file);
        dispatch(setCandidateInfo(info));
        // Pre-fill the form with any data we did manage to extract.
        setFormData({ name: info.name || '', email: info.email || '', phone: info.phone || '' });
      } catch (err: any) {
        dispatch(setInterviewError(err.message));
      }
    }
  };

  const handleButtonClick = () => fileInputRef.current?.click();
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFormSubmit = () => {
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((field) => {
      if (formData[field] && !candidateInfo[field]) { // Only update if the field was initially missing
          dispatch(updateCandidateField({ field, value: formData[field] }));
      }
    });
    dispatch(validateCandidateInfo());
  };

  // --- NEW HANDLER: Start Interview ---
  const handleStartInterview = async () => {
    try {
      const generatedQuestions = await generateInterviewQuestions();
      dispatch(startInterview(generatedQuestions));
    } catch (error) {
      dispatch(setInterviewError("Failed to generate interview questions. Please try again."));
    }
  };

  // --- UI Rendering Logic ---
  // This function determines which UI to show based on the current `status` from Redux.
  const renderContent = () => {
    switch (status) {
      case 'idle':
        if (error) {
          return (
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
              <p className="text-xl font-semibold text-red-400">An Error Occurred</p>
              <p className="text-white/60 mb-6">{error}</p>
              <Button onClick={handleButtonClick} className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-full px-8 py-6 text-lg font-semibold">
                Try Again
              </Button>
            </div>
          );
        }
        return (
          <motion.div className="flex flex-col items-center text-center" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <div className="w-24 h-24 mb-6 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/30">
                <UploadCloud className="text-cyan-400" size={48} />
              </div>
            </motion.div>
            <motion.h2 className="text-3xl font-bold text-white mb-2" variants={itemVariants}>Upload Your Resume</motion.h2>
            <motion.p className="text-white/60 max-w-md mb-8" variants={itemVariants}>Let's get started. Upload your resume (PDF or DOCX) and our AI will automatically extract your details to begin the interview.</motion.p>
            <motion.div variants={itemVariants}>
              <Button onClick={handleButtonClick} className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-full px-8 py-6 text-lg font-semibold">Choose File</Button>
            </motion.div>
          </motion.div>
        );

      case 'parsing_resume':
        return (
          <div className="flex flex-col items-center text-center">
            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mb-4" />
            <p className="text-xl font-semibold">Analyzing Resume...</p>
            <p className="text-white/60">Our AI is extracting your information.</p>
          </div>
        );

      case 'awaiting_info':
        return (
          <div className="flex flex-col items-center text-center">
            <Edit className="w-16 h-16 text-orange-400 mb-4" />
            <p className="text-xl font-semibold">Just a few more details</p>
            <p className="text-white/60 mb-6">Our AI couldn't find everything. Please fill in the missing fields.</p>
            <div className="w-full max-w-sm space-y-4">
              {!candidateInfo.name && <Input name="name" placeholder="Full Name" onChange={handleFormChange} className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />}
              {!candidateInfo.email && <Input name="email" type="email" placeholder="Email Address" onChange={handleFormChange} className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />}
              {!candidateInfo.phone && <Input name="phone" type="tel" placeholder="Phone Number" onChange={handleFormChange} className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />}
            </div>
            {error && <p className="text-red-400 mt-4">{error}</p>}
            <Button onClick={handleFormSubmit} className="bg-orange-500 text-black hover:bg-orange-400 rounded-full px-8 py-4 mt-6 font-semibold">
              Confirm Details
            </Button>
          </div>
        );
      
      case 'ready_to_start':
        return (
          <div className="flex flex-col items-center text-center">
            <UserCheck className="w-16 h-16 text-green-400 mb-4" />
            <p className="text-xl font-semibold">Details Confirmed!</p>
            <p className="text-white/60 mb-6">Welcome, {candidateInfo.name}. We're ready when you are.</p>
            <Button onClick={handleStartInterview} className="bg-green-500 text-black hover:bg-green-400 rounded-full px-8 py-6 text-lg font-semibold">
              Start Interview
            </Button>
          </div>
        );

      case 'in_progress':
        return <InterviewInProgressView />;
      
      case 'completed':
        return (
          <div className="flex flex-col items-center text-center">
            <Star className="w-16 h-16 text-yellow-400 mb-4" />
            <p className="text-xl font-semibold">Interview Completed!</p>
            <p className="text-white/60">Thank you for your time. We will be in touch shortly.</p>
          </div>
        );

      default:
        return <div>Something went wrong. Current status: {status}</div>;
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      {/* The main glassmorphism card that acts as our container. */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 min-h-[550px] flex items-center justify-center">
        {/* This hidden input is the real file upload element. */}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx" />
        
        {/* AnimatePresence ensures smooth transitions when the content inside changes (e.g., from 'idle' to 'parsing_resume'). */}
        <AnimatePresence mode="wait">
          <motion.div
            key={status} // The `key` prop is crucial. It tells AnimatePresence that the child has changed.
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


// --- NEW COMPONENT: Interview In Progress View ---
// We create a separate component for the live interview to keep our code organized.
const InterviewInProgressView = () => {
  const dispatch: AppDispatch = useDispatch();
  // We get the specific state needed for this view from Redux.
  const { questions, currentQuestionIndex } = useSelector((state: RootState) => state.interview);
  // `useState` manages the text in the answer textarea.
  const [answer, setAnswer] = useState('');

  // Get the current question object from the array.
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return <div>Loading...</div>; // Safety check

  // This function determines the timer duration based on the question's difficulty.
  const getTimerDuration = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    if (difficulty === 'Easy') return 20;
    if (difficulty === 'Medium') return 60;
    return 120;
  };

  // This function is called when the user submits their answer.
  const handleSubmit = () => {
    // We dispatch the `submitAnswer` action with the text from the textarea.
    dispatch(submitAnswer(answer || "No answer provided."));
    setAnswer(''); // Clear the textarea for the next question.
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header section with question progress and the timer */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-cyan-400 font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</p>
          <p className="text-sm text-white/60">{currentQuestion.difficulty} Difficulty</p>
        </div>
        <Timer
          key={currentQuestion.id} // The key is vital here to force React to re-create the Timer component for each new question, thus resetting it.
          duration={getTimerDuration(currentQuestion.difficulty)}
          onTimeUp={handleSubmit} // The timer will auto-submit when it hits zero.
        />
      </div>

      {/* The animated chat bubble for the AI's question */}
      <motion.div
        key={currentQuestion.id} // Also key this to re-animate for each question.
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 p-6 rounded-lg mb-6 flex gap-4"
      >
        <Bot className="text-cyan-400 flex-shrink-0 mt-1" />
        <p className="text-white/90 text-lg">{currentQuestion.text}</p>
      </motion.div>

      {/* Answer input area */}
      <div className="flex-grow flex flex-col">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="flex-grow bg-white/5 border-white/20 text-white placeholder:text-white/40 resize-none focus-visible:ring-cyan-500"
        />
      </div>

      {/* Submit button */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit} className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-full px-8 py-4 font-semibold flex items-center gap-2">
          Submit Answer <Send size={16} />
        </Button>
      </div>
    </div>
  );
};

// --- NEW COMPONENT: Animated Timer ---
const Timer = ({ duration, onTimeUp }: { duration: number; onTimeUp: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // `useEffect` is a React hook that runs side effects. In this case, it's perfect for managing our timer's interval.
  useEffect(() => {
    // If the timer hits zero, we call the onTimeUp function (which is handleSubmit) and stop.
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    // `setInterval` is a browser API that runs a function every X milliseconds.
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1); // Decrement the time left by 1 every second.
    }, 1000);
    // The return function from `useEffect` is a cleanup function. React runs it when the component
    // is about to unmount (or re-render). This is crucial to prevent memory leaks.
    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]); // This effect re-runs if `timeLeft` or `onTimeUp` changes.

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      {/* We use SVG and Framer Motion to create the animated circular progress bar. */}
      <motion.svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" className="stroke-white/10" strokeWidth="8" fill="transparent" />
        <motion.circle
          cx="50" cy="50" r="45"
          className="stroke-cyan-500"
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          pathLength={1} // We treat the circle's circumference as a path of length 1.
          initial={{ pathOffset: 0 }} // It starts as a full circle.
          animate={{ pathOffset: 1 - (timeLeft / duration) }} // We animate the offset based on time remaining.
          transition={{ duration: 1, ease: "linear" }} // A linear transition ensures a smooth countdown.
        />
      </motion.svg>
      <span className="text-xl font-bold z-10">{timeLeft}s</span>
    </div>
  );
};

export default IntervieweeTab;

