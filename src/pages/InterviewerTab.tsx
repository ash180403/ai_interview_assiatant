import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Search, Eye, Star, Calendar, LineChart, Users, Bot, User, ArrowUp, ArrowDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import type { CandidateProfile } from '../app/slices/candidatesSlice';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const InterviewerTab = () => {
  const { profiles } = useSelector((state: RootState) => state.candidates);

  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: 'score' | 'date' | 'name'; direction: 'asc' | 'desc' }>({ key: 'score', direction: 'desc' });

  const sortedProfiles = useMemo(() => {
    let filtered = profiles.filter(profile =>
      profile.candidateInfo.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key === 'name') {
        aValue = a.candidateInfo.name || '';
        bValue = b.candidateInfo.name || '';
      } else if (sortConfig.key === 'score') {
        aValue = a.score;
        bValue = b.score;
      } else { 
        aValue = new Date(a.date);
        bValue = new Date(b.date);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [profiles, searchTerm, sortConfig]);

  const handleSort = (key: 'score' | 'date' | 'name') => {
    setSortConfig(prevConfig => {
      const direction = prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc';
      return { key, direction };
    });
  };

  const totalInterviews = profiles.length;
  const completedCount = profiles.length;
  const avgScore = completedCount > 0
    ? Math.round(profiles.reduce((sum, p) => sum + p.score, 0) / completedCount)
    : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex flex-col gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
             <h2 className="text-3xl font-bold text-white mb-2">Candidate Dashboard</h2>
             <p className="text-white/60">Review and manage all candidate interviews.</p>
          </motion.div>

          <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center"
              variants={itemVariants}
            >
      <StatCard icon={<Users />} title="Total Candidates" value={totalInterviews.toString()} />
<StatCard icon={<Star />} title="Completed" value={completedCount.toString()} />
<StatCard icon={<Calendar />} title="In Progress" value="0" />
<StatCard icon={<LineChart />} title="Avg. Score" value={avgScore > 0 ? avgScore.toString() : 'N/A'} />

          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
            variants={itemVariants}
          >
            <div className="p-4 border-b border-white/10 relative">
               <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-white/40" size={20} />
               <Input
                  placeholder="Search by name..."
                  className="w-full bg-transparent border-none pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-b-white/10 hover:bg-transparent">
                  <TableHead className="text-white/80">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-2 hover:text-white">
                      Candidate {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </TableHead>
                  <TableHead className="text-white/80">
                    <button onClick={() => handleSort('score')} className="flex items-center gap-2 hover:text-white">
                      Score {sortConfig.key === 'score' && (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </TableHead>
                  <TableHead className="text-white/80">Status</TableHead>
                  <TableHead className="text-white/80">
                    <button onClick={() => handleSort('date')} className="flex items-center gap-2 hover:text-white">
                       Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </TableHead>
                  <TableHead className="text-white/80 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProfiles.map((profile) => (
                  <TableRow key={profile.id} className="border-b-white/10 hover:bg-white/5">
                    <TableCell className="font-medium">{profile.candidateInfo.name}</TableCell>
                    <TableCell className="font-semibold text-cyan-400">{profile.score}/100</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-400/50 text-green-400 bg-transparent">
                        Completed
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/60">{profile.date}</TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => setSelectedCandidate(profile)}
                        className="p-2 rounded-md hover:bg-white/10 flex items-center gap-2 ml-auto"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </motion.div>
      </motion.div>

      <CandidateDetailModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </>
  );
};

const CandidateDetailModal = ({ candidate, onClose }: { candidate: CandidateProfile | null; onClose: () => void }) => {
  return (
    <Dialog open={!!candidate} onOpenChange={onClose}>
      <DialogContent className="bg-black/40 backdrop-blur-xl border-white/20 text-white max-w-3xl">
        {candidate && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{candidate.candidateInfo.name}</DialogTitle>
              <DialogDescription className="text-white/60">
                {candidate.candidateInfo.email} &bull; {candidate.candidateInfo.phone}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-4 my-4">
               <div className="bg-white/5 p-4 rounded-lg text-center">
                  <p className="text-sm text-white/60">Final Score</p>
                  <p className="text-3xl font-bold text-cyan-400">{candidate.score}<span className="text-lg text-white/60">/100</span></p>
               </div>
               <div className="bg-white/5 p-4 rounded-lg col-span-2">
                  <p className="text-sm text-white/60 mb-1">AI Summary</p>
                  <p className="text-sm">{candidate.summary}</p>
               </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto pr-4 space-y-6">
              {candidate.questions.map((question, index) => (
                <div key={question.id}>
                  <div className="flex gap-3 mb-2">
                    <Bot className="text-cyan-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{question.text}</p>
                      <p className="text-xs text-white/50">{question.difficulty} Difficulty</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pl-4 border-l-2 border-white/10">
                    <User className="text-white/60 flex-shrink-0" />
                    <p className="text-white/80 italic">{candidate.answers[index]}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const StatCard = ({ icon, title, value, className = '' }: { icon: React.ReactNode; title: string; value: string; className?: string }) => (
  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex items-center gap-4">
    <div className={`p-3 rounded-lg bg-white/5 ${className}`}>{icon}</div>
    <div>
      <p className="text-sm text-white/60">{title}</p>
      <p className={`text-2xl font-bold ${className}`}>{value}</p>
    </div>
  </div>
);

export default InterviewerTab;

