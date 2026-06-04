import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, CalendarDays, Plus, Power, Pencil, Trash2, Users, X } from 'lucide-react';
import { challengeService, Challenge } from '../services/challengeService';
import { auth } from '../firebase';

interface WeeklyFormState {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  bronze: string;
  silver: string;
  gold: string;
  unit: string;
  basePoints: string;
  bonusPoints: string;
}

const iconMap = {
  CalendarDays: <CalendarDays size={18} />,
  Power: <Power size={18} />,
  Users: <Users size={18} />,
  Award: <Award size={18} />,
};

export default function WeeklyChallengesManager() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  
  const [formState, setFormState] = useState<WeeklyFormState>({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0] || '',
    endDate: new Date(Date.now() + 604800000).toISOString().split('T')[0] || '', // 7 days
    bronze: '50',
    silver: '75',
    gold: '100',
    unit: 'litres',
    basePoints: '200',
    bonusPoints: '100',
  });

  useEffect(() => {
    const unsubscribe = challengeService.subscribeToChallenges((data) => {
      setChallenges(data);
      setLoading(false);
    }, 'weekly');
    return () => unsubscribe();
  }, []);

  const handleChange = (key: keyof WeeklyFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddChallenge = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await challengeService.createChallenge({
        title: formState.title,
        description: formState.description,
        type: 'weekly',
        difficulty: 'Medium',
        target: parseInt(formState.gold),
        unit: formState.unit,
        xpReward: parseInt(formState.basePoints) + parseInt(formState.bonusPoints),
        ecoPointsReward: Math.floor(parseInt(formState.basePoints) / 2),
        startDate: formState.startDate,
        endDate: formState.endDate,
        status: 'Active',
        communityChallenge: false,
        createdBy: auth.currentUser?.uid || 'admin',
        milestones: [
          { label: 'Bronze', value: formState.bronze },
          { label: 'Silver', value: formState.silver },
          { label: 'Gold', value: formState.gold },
        ]
      });
      setIsOpen(false);
      // Reset form logic...
    } catch (error) {
      console.error("Error adding weekly challenge:", error);
      alert("Failed to create challenge");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this weekly challenge?')) {
      try {
        await challengeService.deleteChallenge(id);
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Syncing with Firebase...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Weekly Challenges</h3>
          <p className="text-sm text-slate-500">Set high-impact weekly goals</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          <Plus size={16} />
          Create Weekly Challenge
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <CalendarDays size={18} />, title: 'Total Campaigns', value: challenges.length, color: 'bg-violet-50 text-violet-600' },
          { icon: <Power size={18} />, title: 'Active Now', value: challenges.filter(c => c.status === 'Active').length, color: 'bg-emerald-50 text-emerald-600' },
          { icon: <Users size={18} />, title: 'Participants', value: challenges.reduce((acc, c) => acc + (c.participantsCount || 0), 0), color: 'bg-sky-50 text-sky-600' },
          { icon: <Award size={18} />, title: 'Avg Completion', value: '65%', color: 'bg-amber-50 text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>{stat.icon}</div>
            <div>
              <div className="text-lg font-bold leading-none text-slate-900">{stat.value}</div>
              <div className="text-[11px] text-slate-500">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">{challenge.title}</h4>
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">{challenge.status}</span>
                  </div>
                  <p className="text-sm text-slate-500">{challenge.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600"><Pencil size={16} /></button>
                  <button onClick={() => challenge.id && handleDelete(challenge.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-50 pt-4">
                {challenge.milestones?.map((m: any, idx: number) => (
                  <div key={idx} className={`p-3 rounded-lg border ${idx === 2 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
                    <p className="text-[10px] font-bold uppercase text-slate-400">{m.label}</p>
                    <p className="text-sm font-bold text-slate-700">{m.value} {challenge.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Create Weekly Challenge</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddChallenge} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Challenge Title</label>
                  <input type="text" required value={formState.title} onChange={e => handleChange('title', e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-violet-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Description</label>
                  <textarea required value={formState.description} onChange={e => handleChange('description', e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-violet-500 focus:outline-none" rows={2} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                   <div>
                     <label className="mb-1 block text-[10px] font-bold uppercase text-slate-700">Bronze</label>
                     <input type="number" value={formState.bronze} onChange={e => handleChange('bronze', e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" />
                   </div>
                   <div>
                     <label className="mb-1 block text-[10px] font-bold uppercase text-slate-700">Silver</label>
                     <input type="number" value={formState.silver} onChange={e => handleChange('silver', e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" />
                   </div>
                   <div>
                     <label className="mb-1 block text-[10px] font-bold uppercase text-slate-700">Gold</label>
                     <input type="number" value={formState.gold} onChange={e => handleChange('gold', e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" />
                   </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700">Launch Weekly Goal</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
