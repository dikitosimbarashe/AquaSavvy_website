"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DailyChallengesManager;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const challengeService_1 = require("../services/challengeService");
const firebase_1 = require("../firebase");
const getIconSymbol = (icon) => {
    switch (icon) {
        case 'Award':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Award, { size: 18, className: "text-purple-600 inline" });
        case 'Power':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Power, { size: 18, className: "text-green-600 inline" });
        default:
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Droplets, { size: 18, className: "text-blue-600 inline" });
    }
};
function DailyChallengesManager() {
    const [challenges, setChallenges] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [formState, setFormState] = (0, react_1.useState)({
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
    (0, react_1.useEffect)(() => {
        const unsubscribe = challengeService_1.challengeService.subscribeToChallenges((data) => {
            setChallenges(data);
            setLoading(false);
        }, 'daily');
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
                createdBy: ((_a = firebase_1.auth.currentUser) === null || _a === void 0 ? void 0 : _a.uid) || 'admin',
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
        }
        catch (error) {
            console.error("Error adding challenge:", error);
            alert("Failed to create challenge");
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this challenge?')) {
            try {
                await challengeService_1.challengeService.deleteChallenge(id);
            }
            catch (error) {
                console.error("Error deleting challenge:", error);
            }
        }
    };
    if (loading) {
        return (0, jsx_runtime_1.jsx)("div", { className: "p-8 text-center text-slate-500 italic", children: "Syncing daily missions..." });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-slate-900", children: "Daily Challenges" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500", children: "Manage daily missions and rewards" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsOpen(true), className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 16 }), "Create Challenge"] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "grid grid-cols-1 gap-4 md:grid-cols-4", initial: "hidden", animate: "visible", variants: { visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }, children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow", variants: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }, children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CalendarDays, { size: 18 }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold leading-none text-slate-900", children: challenges.length }), (0, jsx_runtime_1.jsx)("div", { className: "text-[11px] text-slate-500", children: "Total Challenges" })] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow", variants: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }, children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Power, { size: 18 }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold leading-none text-slate-900", children: challenges.filter(c => c.status === 'Active').length }), (0, jsx_runtime_1.jsx)("div", { className: "text-[11px] text-slate-500", children: "Active Now" })] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow", variants: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }, children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { size: 18 }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold leading-none text-slate-900", children: challenges.reduce((acc, c) => acc + (c.participantsCount || 0), 0) }), (0, jsx_runtime_1.jsx)("div", { className: "text-[11px] text-slate-500", children: "Total Participants" })] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow", variants: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }, children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.LineChart, { size: 18 }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold leading-none text-slate-900", children: "72%" }), (0, jsx_runtime_1.jsx)("div", { className: "text-[11px] text-slate-500", children: "Avg Completion" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-5", children: challenges.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Droplets, { className: "mx-auto text-slate-300 mb-4", size: 48 }), (0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-bold text-slate-900 mb-1", children: "No Daily Missions" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500 mb-6", children: "Create a new mission to engage your users today!" }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsOpen(true), className: "inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 18 }), "Create First Mission"] })] })) : ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "space-y-5", initial: "hidden", animate: "visible", variants: { visible: { transition: { staggerChildren: 0.2 } }, hidden: {} }, children: challenges.map((challenge) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow", variants: { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }, children: (0, jsx_runtime_1.jsxs)("div", { className: "p-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-sm font-bold text-slate-900", children: [getIconSymbol(challenge.type === 'daily' ? 'Droplet' : 'Award'), (0, jsx_runtime_1.jsx)("span", { className: "ml-2 align-middle", children: challenge.title })] }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700", children: challenge.status }), (0, jsx_runtime_1.jsxs)("span", { className: "rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700", children: [challenge.xpReward, " pts"] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500", children: challenge.description })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { className: "p-2 text-slate-400 hover:text-blue-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { size: 16 }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => challenge.id && handleDelete(challenge.id), className: "p-2 text-slate-400 hover:text-red-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 16 }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 border-t border-slate-50 pt-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] uppercase tracking-wider text-slate-400 font-bold", children: "Participants" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-bold text-slate-700", children: challenge.participantsCount || 0 })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] uppercase tracking-wider text-slate-400 font-bold", children: "Target" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm font-bold text-slate-700", children: [challenge.target, " ", challenge.unit] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] uppercase tracking-wider text-slate-400 font-bold", children: "Difficulty" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-bold text-slate-700", children: challenge.difficulty })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] uppercase tracking-wider text-slate-400 font-bold", children: "Ends" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-bold text-slate-700", children: challenge.endDate })] })] })] }) }, challenge.id))) })) }), isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-slate-900", children: "Create Daily Challenge" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(false), className: "text-slate-400 hover:text-slate-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleAddChallenge, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider", children: "Challenge Title" }), (0, jsx_runtime_1.jsx)("input", { type: "text", required: true, value: formState.title, onChange: (e) => handleChange('title', e.target.value), className: "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none", placeholder: "e.g., Save 10L Challenge" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { required: true, value: formState.description, onChange: (e) => handleChange('description', e.target.value), className: "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none", rows: 3, placeholder: "What should the user do?" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider", children: "Target Amount" }), (0, jsx_runtime_1.jsx)("input", { type: "number", required: true, value: formState.target, onChange: (e) => handleChange('target', e.target.value), className: "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider", children: "Unit" }), (0, jsx_runtime_1.jsxs)("select", { value: formState.unit, onChange: (e) => handleChange('unit', e.target.value), className: "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "litres", children: "Litres" }), (0, jsx_runtime_1.jsx)("option", { value: "points", children: "Eco Points" }), (0, jsx_runtime_1.jsx)("option", { value: "leaks", children: "Leaks Reported" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider", children: "XP Reward" }), (0, jsx_runtime_1.jsx)("input", { type: "number", required: true, value: formState.points, onChange: (e) => handleChange('points', e.target.value), className: "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider", children: "Difficulty" }), (0, jsx_runtime_1.jsxs)("select", { value: formState.difficulty, onChange: (e) => handleChange('difficulty', e.target.value), className: "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "Easy", children: "Easy" }), (0, jsx_runtime_1.jsx)("option", { value: "Medium", children: "Medium" }), (0, jsx_runtime_1.jsx)("option", { value: "Hard", children: "Hard" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 pt-4", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setIsOpen(false), className: "flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700", children: "Create Mission" })] })] })] }) }))] }));
}
//# sourceMappingURL=DailyChallengesManager.js.map