import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { UploadCloud, Loader2, AlertCircle, UserCheck, Edit, Bot, Send, Star, X } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import {
  setParsingStatus, setCandidateInfo, setInterviewError,
  updateCandidateField, validateCandidateInfo,
  startInterview, submitAnswer, resetInterview, setGeneratingStatus,
} from '../app/slices/InterviewSlice';
import { addCandidateProfile } from '../app/slices/candidatesSlice';
import type { CandidateProfile } from '../app/slices/candidatesSlice';
import {
  parseResumeAndExtractInfo,
  generateInterviewQuestions,
  scoreInterviewAndWriteSummary,
} from '../lib/gemini';

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.2 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const IntervieweeTab = () => {
  const dispatch: AppDispatch = useDispatch();
  const { status, error, candidateInfo, questions, answers } = useSelector((state: RootState) => state.interview);
  const { profiles } = useSelector((state: RootState) => state.candidates);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (status === 'completed') {
      const handleInterviewCompletion = async () => {
        const isAlreadySaved = profiles.some((p: CandidateProfile) => p.id === candidateInfo.email);
        if (candidateInfo.email && !isAlreadySaved) {
          const { score, summary } = await scoreInterviewAndWriteSummary(questions, answers);
          const finalProfile: CandidateProfile = {
            id: candidateInfo.email,
            candidateInfo: candidateInfo,
            questions: questions,
            answers: answers,
            score: score,
            summary: summary,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          };
          dispatch(addCandidateProfile(finalProfile));
        }
      };
      handleInterviewCompletion();
    }
  }, [status, dispatch, candidateInfo, questions, answers, profiles]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(setParsingStatus());
      try {
        const info = await parseResumeAndExtractInfo(file);
        dispatch(setCandidateInfo(info));
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
      if (formData[field] && !candidateInfo[field]) {
        dispatch(updateCandidateField({ field, value: formData[field] }));
      }
    });
    dispatch(validateCandidateInfo());
  };
  const handleStartInterview = async () => {
    dispatch(setGeneratingStatus());
    try {
      const generatedQuestions = await generateInterviewQuestions();
      dispatch(startInterview(generatedQuestions));
    } catch (error: any) {
      dispatch(setInterviewError(error.message || "Failed to generate interview questions. Please try again."));
    }
  };
  const handleNewInterview = () => {
    dispatch(resetInterview());
  };

  const renderContent = () => {
    switch (status) {
      case 'idle':
        if (error) {
          return (
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
              <p className="text-xl font-semibold text-red-400">An Error Occurred</p>
              <p className="text-white/60 mb-6">{error}</p>
              <Button onClick={() => dispatch(resetInterview())} className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-full px-8 py-6 text-lg font-semibold">
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
            <motion.p className="text-white/60 max-w-md mb-8" variants={itemVariants}>Let's get started. Upload your resume and our AI will automatically extract your details to begin the interview.</motion.p>
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
              {!candidateInfo.name && <Input name="name" value={formData.name} placeholder="Full Name" onChange={handleFormChange} className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />}
              {!candidateInfo.email && <Input name="email" type="email" value={formData.email} placeholder="Email Address" onChange={handleFormChange} className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />}
              {!candidateInfo.phone && <Input name="phone" type="tel" value={formData.phone} placeholder="Phone Number" onChange={handleFormChange} className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />}
            </div>
            {error && <p className="text-red-400 mt-4">{error}</p>}
            <div className="flex gap-4 mt-6">
              <Button onClick={handleNewInterview} variant="outline" className="text-white bg-transparent border-white/20 hover:bg-white/10 hover:text-white rounded-full px-8 py-4 font-semibold">
                Start Over
              </Button>
              <Button onClick={handleFormSubmit} className="bg-orange-500 text-black hover:bg-orange-400 rounded-full px-8 py-4 font-semibold">
                Confirm Details
              </Button>
            </div>
          </div>
        );
      
      case 'ready_to_start':
        return (
          <div className="flex flex-col items-center text-center">
            <UserCheck className="w-16 h-16 text-green-400 mb-4" />
            <p className="text-xl font-semibold">Details Confirmed!</p>
            <p className="text-white/60 mb-6">Welcome, {candidateInfo.name}. We're ready when you are.</p>
            <div className="flex gap-4">
              <Button onClick={handleNewInterview} variant="outline" className="text-white bg-transparent border-white/20 hover:bg-white/10 hover:text-white rounded-full px-8 py-6 text-lg font-semibold">
                <X className="mr-2 h-5 w-5" /> Cancel
              </Button>
              <Button onClick={handleStartInterview} className="bg-green-500 text-black hover:bg-green-400 rounded-full px-8 py-6 text-lg font-semibold">
                Start Interview
              </Button>
            </div>
          </div>
        );
      case 'generating_questions':
        return (
          <motion.div
            className="flex flex-col items-center text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mb-4" />
            </motion.div>
            <motion.p className="text-2xl font-semibold" variants={itemVariants}>
              Our AI is crafting your interview...
            </motion.p>
            <motion.p className="text-white/60" variants={itemVariants}>
              This may take a few seconds.
            </motion.p>
          </motion.div>
        );
      case 'in_progress':
        return <InterviewInProgressView />;
      
      case 'completed':
        return (
          <motion.div
            className="flex flex-col items-center text-center"
            variants={containerVariants} initial="hidden" animate="visible"
          >
            <motion.div variants={itemVariants}>
                <Star className="w-16 h-16 text-yellow-400 mb-4 animate-pulse" />
            </motion.div>
            <motion.p className="text-2xl font-semibold" variants={itemVariants}>Interview Completed!</motion.p>
            <motion.p className="text-white/60 mb-6" variants={itemVariants}>
              Thank you for your time. Your results have been saved.
            </motion.p>
            <motion.div variants={itemVariants}>
               <Button onClick={handleNewInterview} className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-full px-8 py-4 font-semibold">
                Start New Interview
              </Button>
            </motion.div>
          </motion.div>
        );
      default:
        return <div>Something went wrong. Current status: {status}</div>;
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 min-h-[550px] flex items-center justify-center">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
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

const InterviewInProgressView = () => {
  const dispatch: AppDispatch = useDispatch();
  const { questions, currentQuestionIndex } = useSelector((state: RootState) => state.interview);
  const [answer, setAnswer] = useState('');
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return <div>Loading...</div>;

  const getTimerDuration = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    if (difficulty === 'Easy') return 20;
    if (difficulty === 'Medium') return 60;
    return 120;
  };

  const handleSubmit = () => {
    dispatch(submitAnswer(answer || "No answer provided."));
    setAnswer('');
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-cyan-400 font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</p>
          <p className="text-sm text-white/60">{currentQuestion.difficulty} Difficulty</p>
        </div>
        <Timer
          key={currentQuestion.id}
          duration={getTimerDuration(currentQuestion.difficulty)}
          onTimeUp={handleSubmit}
        />
      </div>
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 p-6 rounded-lg mb-6 flex gap-4"
      >
        <Bot className="text-cyan-400 flex-shrink-0 mt-1" />
        <p className="text-white/90 text-lg">{currentQuestion.text}</p>
      </motion.div>
      <div className="flex-grow flex flex-col">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="flex-grow bg-white/5 border-white/20 text-white placeholder:text-white/40 resize-none focus-visible:ring-cyan-500"
        />
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit} className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-full px-8 py-4 font-semibold flex items-center gap-2">
          Submit Answer <Send size={16} />
        </Button>
      </div>
    </div>
  );
};

const Timer = ({ duration, onTimeUp }: { duration: number; onTimeUp: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <motion.svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" className="stroke-white/10" strokeWidth="8" fill="transparent" />
        <motion.circle
          cx="50" cy="50" r="45"
          className="stroke-cyan-500"
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          pathLength={1}
          initial={{ pathOffset: 0 }}
          animate={{ pathOffset: 1 - (timeLeft / duration) }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </motion.svg>
      <span className="text-xl font-bold z-10">{timeLeft}s</span>
    </div>
  );
};

export default IntervieweeTab;

