// --- IMPORTS ---
import { motion } from 'framer-motion';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Search, Eye, Star, Calendar, LineChart, Users } from 'lucide-react';

// --- Animation Variants ---
// We'll use the same staggering animation variants as the other page
// to create a cohesive and professional feel across the app.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // A slightly faster stagger for a more dynamic dashboard feel.
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// --- INTERVIEWER TAB COMPONENT ---
const InterviewerTab = () => {
  // We'll use this placeholder data for the table until we hook it up to our state management.
  const candidates = [
    { name: 'Alice Johnson', score: '85/100', status: 'Completed', date: 'Sept 28, 2025' },
    { name: 'Bob Smith', score: '72/100', status: 'Completed', date: 'Sept 27, 2025' },
    { name: 'Charlie Brown', score: 'N/A', status: 'In Progress', date: 'Sept 29, 2025' },
  ];

  return (
    // This is the main page container with our fade-in animation.
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/*
        This is the main animated container for the entire dashboard layout.
        - `variants={containerVariants}` tells this div to orchestrate the animation of its children.
        - `initial="hidden"` and `animate="visible"` start the animation sequence.
      */}
      <motion.div
        className="flex flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/*
          SECTION 1: Dashboard Header
          Each main section is a `motion.div` with `variants={itemVariants}` so it
          fades and slides in as part of the staggered sequence.
        */}
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold text-white mb-2">Candidate Dashboard</h2>
          <p className="text-white/60">Review and manage all candidate interviews.</p>
        </motion.div>

        {/*
          SECTION 2: Stat Cards & Search
          We use a grid to lay out the cards and the search bar.
        */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center"
          variants={itemVariants}
        >
          {/* Stat Card 1: Total Candidates */}
          <StatCard icon={<Users />} title="Total Candidates" value="3" />
          {/* Stat Card 2: Completed */}
          <StatCard icon={<Star />} title="Completed" value="2" className="text-green-400" />
          {/* Stat Card 3: In Progress */}
          <StatCard icon={<Calendar />} title="In Progress" value="1" className="text-orange-400" />
          {/* Stat Card 4: Avg Score */}
          <StatCard icon={<LineChart />} title="Avg. Score" value="78.5" className="text-cyan-400" />
        </motion.div>

        {/*
          SECTION 3: Candidates Table
          The final piece of our dashboard.
        */}
        <motion.div
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
          variants={itemVariants}
        >
          {/* Search Bar for the table */}
          <div className="p-4 border-b border-white/10 relative">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <Input
              placeholder="Search by name..."
              className="w-full bg-transparent border-none pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/40"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-b-white/10">
                <TableHead className="text-white/80">Candidate</TableHead>
                <TableHead className="text-white/80">Score</TableHead>
                <TableHead className="text-white/80">Status</TableHead>
                <TableHead className="text-white/80">Date</TableHead>
                <TableHead className="text-white/80 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate, index) => (
                <TableRow key={index} className="border-b-white/10 hover:bg-white/5">
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell className="font-semibold text-cyan-400">{candidate.score}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        candidate.status === 'Completed'
                          ? 'border-green-400/50 text-green-400'
                          : 'border-orange-400/50 text-orange-400'
                      } bg-transparent`}
                    >
                      {candidate.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/60">{candidate.date}</TableCell>
                  <TableCell className="text-right">
                    <button className="p-2 rounded-md hover:bg-white/10">
                      <Eye size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// --- Reusable StatCard Component ---
// To keep our code clean (DRY - Don't Repeat Yourself), we create a small component
// for the statistics cards since they all share the same structure.
const StatCard = ({ icon, title, value, className = '' }: { icon: React.ReactNode; title: string; value: string; className?: string }) => (
  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex items-center gap-4">
    <div className={`p-3 rounded-lg bg-white/5 ${className}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-white/60">{title}</p>
      <p className={`text-2xl font-bold ${className}`}>{value}</p>
    </div>
  </div>
);

export default InterviewerTab;

