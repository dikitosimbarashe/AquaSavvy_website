import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, LineChart, Plus, Power, Pencil, Trash2, Users, X } from 'lucide-react';
import { challengeService, Challenge } from '../services/challengeService';
import { auth } from '../firebase';

interface CommunityFormState {
  title: string;
  description: string;
  target: string;
  unit: string;
  pointsPerContribution: string;
  bonusPoints: string;
  startDate: string;
  endDate: string;
}

export default function CommunityChallengesManager() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  
  const [formState, setFormState] = useState<CommunityFormState>({
    title: '',
    description: '',
    target: '1000000',
    unit: 'litres',
    pointsPerContribution: '5',
    bonusPoints: '500',
    startDate: new Date().toISOString().split('T')[0] || '',
    endDate: new Date(Date.now() + 2592000000).toISOString().split('T')[0] || '', // 30 days
  });

  const [milestones, setMilestones] = useState([
    { label: '250000', note: '100' },
    { label: '500000', note: '200' },
    { label: '750000', note: '300' },
    { label: '1000000', note: '500' },
  ]);

  useEffect(() => {
    const unsubscribe = challengeService.subscribeToChallenges((data) => {
      setChallenges(data as Challenge[]);
      setLoading(false);
    }, 'community');
    return () => unsubscribe();
  }, []);

  const handleChange = (key: keyof CommunityFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleMilestoneChange = (index: number, key: 'label' | 'note', value: string) => {
    setMilestones((current) => current.map((item, idx) => idx === index ? { ...item, [key]: value } : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await challengeService.createChallenge({
        title: formState.title,
        description: formState.description,
        type: 'community',
        target: parseInt(formState.target),
        unit: formState.unit,
        xpReward: parseInt(formState.bonusPoints),
        ecoPointsReward: Math.floor(parseInt(formState.bonusPoints) / 2),
        startDate: formState.startDate,
        endDate: formState.endDate,
        status: 'Active',
        communityChallenge: true,
        createdBy: auth.currentUser?.uid || 'admin',
        milestones: milestones,
      });
      setIsOpen(false);
      // Reset form
    } catch (error) {
      console.error("Error adding challenge: ", error);
      alert("Failed to create challenge");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        await challengeService.deleteChallenge(id);
      } catch (error) {
        console.error("Error deleting challenge: ", error);
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Connecting to Firebase...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Community Challenges</h3>
          <p className="text-sm text-slate-500">Global water saving initiatives</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          <Plus size={16} />
          New Community Goal
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { icon: <Globe size={18} />, title: 'Global Events', value: challenges.length, iconClass: 'bg-emerald-50 text-emerald-600' },
          { icon: <Power size={18} />, title: 'Active Now', value: challenges.filter(c => c.status === 'Active').length, iconClass: 'bg-emerald-50 text-emerald-600' },
          { icon: <Users size={18} />, title: 'Total Participants', value: challenges.reduce((acc, c) => acc + (c.participantsCount || 0), 0), iconClass: 'bg-sky-50 text-sky-600' },
          { icon: <LineChart size={18} />, title: 'Avg Progress', value: '60%', iconClass: 'bg-orange-50 text-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconClass}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-lg font-bold leading-none text-slate-900">{stat.value}</div>
              <div className="text-[11px] text-slate-500">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        {challenges.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <Users className="mx-auto text-slate-300 mb-4" size={48} />
            <h4 className="text-lg font-bold text-slate-900 mb-1">No Community Challenges Yet</h4>
            <p className="text-sm text-slate-500 mb-6">Start your first global initiative to save water!</p>
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700"
            >
              <Plus size={18} />
              Create Initiative
            </button>
          </div>
        ) : (
          challenges.map((challenge) => (
            <div key={challenge.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900">{challenge.title}</h4>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">{challenge.status}</span>
                    </div>
                    <p className="text-sm text-slate-500">{challenge.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600"><Pencil size={16} /></button>
                    <button 
                      onClick={() => challenge.id && handleDelete(challenge.id)}
                      className="p-2 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-end justify-between text-xs">
                    <span className="font-bold text-slate-700">{challenge.progressLabel || '0% Complete'}</span>
                    <span className="text-slate-500">{challenge.progressValue || `0 / ${challenge.target} ${challenge.unit}`}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: challenge.progressBar || '0%' }}></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 border-t border-slate-50 pt-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Participants</div>
                      <div className="text-sm font-bold text-slate-700">{challenge.participantsCount || 0}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pts/Contrib</div>
                      <div className="text-sm font-bold text-slate-700">5</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Start Date</div>
                      <div className="text-sm font-bold text-slate-700">{challenge.startDate}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">End Date</div>
                      <div className="text-sm font-bold text-slate-700">{challenge.endDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Create Community Challenge</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Event Title</label>
                  <input type="text" required value={formState.title} onChange={e => handleChange('title', e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Description</label>
                  <textarea required value={formState.description} onChange={e => handleChange('description', e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none" rows={2} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Global Target</label>
                  <input type="number" required value={formState.target} onChange={e => handleChange('target', e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Unit</label>
                  <select value={formState.unit} onChange={e => handleChange('unit', e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none">
                    <option value="litres">Litres Saved</option>
                    <option value="leaks">Leaks Fixed</option>
                    <option value="trees">Trees Planted</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">Launch Challenge</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
