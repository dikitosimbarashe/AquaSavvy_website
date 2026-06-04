import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, LineChart, Plus, Power, Pencil, Trash2, Users, Droplets, Award, X } from 'lucide-react';
import { challengeService, Challenge } from '../services/challengeService';
import { auth } from '../firebase';

const getIconSymbol = (icon: string) => {
  switch (icon) {
    case 'Award':
      return <Award size={18} className="text-purple-600 inline" />;
    case 'Power':
      return <Power size={18} className="text-green-600 inline" />;
    default:
      return <Droplets size={18} className="text-blue-600 inline" />;
  }
};

interface DailyFormState {
  title: string;
  description: string;
  icon: string;
  points: string;
  target: string;
  unit: string;
  difficulty: string;
  startDate: string;
  endDate: string;
}

export default function DailyChallengesManager() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  
  const [formState, setFormState] = useState<DailyFormState>({
    title: '',
    description: '',
    icon: 'Droplet',
    points: '50',
    target: '10',
    unit: 'litres',
    difficulty: 'Easy',
    startDate: new Date().toISOString().split('T')[0] || '',
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] || '',
  });

  useEffect(() => {
    const unsubscribe = challengeService.subscribeToChallenges((data) => {
      setChallenges(data);
      setLoading(false);
    }, 'daily');
    return () => unsubscribe();
  }, []);

  const handleChange = (key: keyof DailyFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddChallenge = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await challengeService.createChallenge({
        title: formState.title,
        description: formState.description,
        type: 'daily',
        difficulty: formState.difficulty,
        target: parseInt(formState.target),
        unit: formState.unit,
        xpReward: parseInt(formState.points),
        ecoPointsReward: Math.floor(parseInt(formState.points) / 2),
        startDate: formState.startDate,
        endDate: formState.endDate,
        status: 'Active',
        communityChallenge: false,
        createdBy: auth.currentUser?.uid || 'admin',
      });
      setIsOpen(false);
      setFormState({
        title: '',
        description: '',
        icon: 'Droplet',
        points: '50',
        target: '10',
        unit: 'litres',
        difficulty: 'Easy',
        startDate: new Date().toISOString().split('T')[0] || '',
        endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] || '',
      });
    } catch (error) {
      console.error("Error adding challenge:", error);
      alert("Failed to create challenge");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        await challengeService.deleteChallenge(id);
      } catch (error) {
        console.error("Error deleting challenge:", error);
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 italic">Syncing daily missions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Daily Challenges</h3>
          <p className="text-sm text-slate-500">Manage daily missions and rewards</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Challenge
        </button>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
      >
        <motion.div
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <CalendarDays size={18} />
          </div>
          <div>
            <div className="text-lg font-bold leading-none text-slate-900">{challenges.length}</div>
            <div className="text-[11px] text-slate-500">Total Challenges</div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
            <Power size={18} />
          </div>
          <div>
            <div className="text-lg font-bold leading-none text-slate-900">
              {challenges.filter(c => c.status === 'Active').length}
            </div>
            <div className="text-[11px] text-slate-500">Active Now</div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <Users size={18} />
          </div>
          <div>
            <div className="text-lg font-bold leading-none text-slate-900">
              {challenges.reduce((acc, c) => acc + (c.participantsCount || 0), 0)}
            </div>
            <div className="text-[11px] text-slate-500">Total Participants</div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
            <LineChart size={18} />
          </div>
          <div>
            <div className="text-lg font-bold leading-none text-slate-900">72%</div>
            <div className="text-[11px] text-slate-500">Avg Completion</div>
          </div>
        </motion.div>
      </motion.div>
      
      <div className="space-y-5">
        {challenges.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <Droplets className="mx-auto text-slate-300 mb-4" size={48} />
            <h4 className="text-lg font-bold text-slate-900 mb-1">No Daily Missions</h4>
            <p className="text-sm text-slate-500 mb-6">Create a new mission to engage your users today!</p>
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700"
            >
              <Plus size={18} />
              Create First Mission
            </button>
          </div>
        ) : (
          <motion.div
            className="space-y-5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } }, hidden: {} }}
          >
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow"
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {getIconSymbol(challenge.type === 'daily' ? 'Droplet' : 'Award')}
                          <span className="ml-2 align-middle">{challenge.title}</span>
                        </h4>
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">{challenge.status}</span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">{challenge.xpReward} pts</span>
                      </div>
                      <p className="text-xs text-slate-500">{challenge.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => challenge.id && handleDelete(challenge.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 border-t border-slate-50 pt-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Participants</div>
                      <div className="text-sm font-bold text-slate-700">{challenge.participantsCount || 0}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Target</div>
                      <div className="text-sm font-bold text-slate-700">{challenge.target} {challenge.unit}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Difficulty</div>
                      <div className="text-sm font-bold text-slate-700">{challenge.difficulty}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Ends</div>
                      <div className="text-sm font-bold text-slate-700">{challenge.endDate}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Create Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Create Daily Challenge</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddChallenge} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Challenge Title</label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Save 10L Challenge"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
                <textarea
                  required
                  value={formState.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="What should the user do?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Target Amount</label>
                  <input
                    type="number"
                    required
                    value={formState.target}
                    onChange={(e) => handleChange('target', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Unit</label>
                  <select
                    value={formState.unit}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="litres">Litres</option>
                    <option value="points">Eco Points</option>
                    <option value="leaks">Leaks Reported</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">XP Reward</label>
                  <input
                    type="number"
                    required
                    value={formState.points}
                    onChange={(e) => handleChange('points', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Difficulty</label>
                  <select
                    value={formState.difficulty}
                    onChange={(e) => handleChange('difficulty', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Create Mission
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
