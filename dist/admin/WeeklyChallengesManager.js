"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WeeklyChallengesManager;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const challengeService_1 = require("../services/challengeService");
const firebase_1 = require("../firebase");
const iconMap = {
    CalendarDays: (0, jsx_runtime_1.jsx)(lucide_react_1.CalendarDays, { size: 18 }),
    Power: (0, jsx_runtime_1.jsx)(lucide_react_1.Power, { size: 18 }),
    Users: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { size: 18 }),
    Award: (0, jsx_runtime_1.jsx)(lucide_react_1.Award, { size: 18 }),
};
function WeeklyChallengesManager() {
    const [challenges, setChallenges] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [formState, setFormState] = (0, react_1.useState)({
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
    (0, react_1.useEffect)(() => {
        const unsubscribe = challengeService_1.challengeService.subscribeToChallenges((data) => {
            setChallenges(data);
            setLoading(false);
        }, 'weekly');
        return () => unsubscribe();
    }, []);
    const handleChange = (key, value) => {
        setFormState((prev) => ({ ...prev, [key]: value }));
    };
    const handleAddChallenge = async (event) => {
        var _a;
        event.preventDefault();
        try {
            await challengeService_1.challengeService.createChallenge({
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
                createdBy: ((_a = firebase_1.auth.currentUser) === null || _a === void 0 ? void 0 : _a.uid) || 'admin',
                milestones: [
                    { label: 'Bronze', value: formState.bronze },
                    { label: 'Silver', value: formState.silver },
                    { label: 'Gold', value: formState.gold },
                ]
            });
            setIsOpen(false);
            // Reset form logic...
        }
        catch (error) {
            console.error("Error adding weekly challenge:", error);
            alert("Failed to create challenge");
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Delete this weekly challenge?')) {
            try {
                await challengeService_1.challengeService.deleteChallenge(id);
            }
            catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };
    if (loading)
        return (0, jsx_runtime_1.jsx)("div", { className: "p-8 text-center text-slate-500", children: "Syncing with Firebase..." });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-slate-900", children: "Weekly Challenges" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500", children: "Set high-impact weekly goals" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsOpen(true), className: "inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 16 }), "Create Weekly Challenge"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
                    { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.CalendarDays, { size: 18 }), title: 'Total Campaigns', value: challenges.length, color: 'bg-violet-50 text-violet-600' },
                    { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Power, { size: 18 }), title: 'Active Now', value: challenges.filter(c => c.status === 'Active').length, color: 'bg-emerald-50 text-emerald-600' },
                    { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { size: 18 }), title: 'Participants', value: challenges.reduce((acc, c) => acc + (c.participantsCount || 0), 0), color: 'bg-sky-50 text-sky-600' },
                    { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Award, { size: 18 }), title: 'Avg Completion', value: '65%', color: 'bg-amber-50 text-amber-600' },
                ].map((stat, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: `flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`, children: stat.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold leading-none text-slate-900", children: stat.value }), (0, jsx_runtime_1.jsx)("div", { className: "text-[11px] text-slate-500", children: stat.title })] })] }, i))) }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-5", children: challenges.map((challenge) => {
                    var _a;
                    return ((0, jsx_runtime_1.jsx)("div", { className: "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-bold text-slate-900", children: challenge.title }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700", children: challenge.status })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500", children: challenge.description })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { className: "p-2 text-slate-400 hover:text-blue-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { size: 16 }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => challenge.id && handleDelete(challenge.id), className: "p-2 text-slate-400 hover:text-red-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 16 }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 grid grid-cols-3 gap-4 border-t border-slate-50 pt-4", children: (_a = challenge.milestones) === null || _a === void 0 ? void 0 : _a.map((m, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: `p-3 rounded-lg border ${idx === 2 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`, children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[10px] font-bold uppercase text-slate-400", children: m.label }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-bold text-slate-700", children: [m.value, " ", challenge.unit] })] }, idx))) })] }) }, challenge.id));
                }) }), isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-slate-900", children: "Create Weekly Challenge" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(false), className: "text-slate-400 hover:text-slate-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleAddChallenge, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-xs font-bold uppercase text-slate-700", children: "Challenge Title" }), (0, jsx_runtime_1.jsx)("input", { type: "text", required: true, value: formState.title, onChange: e => handleChange('title', e.target.value), className: "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-violet-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-xs font-bold uppercase text-slate-700", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { required: true, value: formState.description, onChange: e => handleChange('description', e.target.value), className: "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-violet-500 focus:outline-none", rows: 2 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-[10px] font-bold uppercase text-slate-700", children: "Bronze" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: formState.bronze, onChange: e => handleChange('bronze', e.target.value), className: "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-[10px] font-bold uppercase text-slate-700", children: "Silver" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: formState.silver, onChange: e => handleChange('silver', e.target.value), className: "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-[10px] font-bold uppercase text-slate-700", children: "Gold" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: formState.gold, onChange: e => handleChange('gold', e.target.value), className: "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 pt-4", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setIsOpen(false), className: "flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "flex-1 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700", children: "Launch Weekly Goal" })] })] })] }) }))] }));
}
//# sourceMappingURL=WeeklyChallengesManager.js.map