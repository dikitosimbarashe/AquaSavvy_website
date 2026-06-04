"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CommunityChallengesManager;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const challengeService_1 = require("../services/challengeService");
const firebase_1 = require("../firebase");
function CommunityChallengesManager() {
    const [challenges, setChallenges] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [formState, setFormState] = (0, react_1.useState)({
        title: '',
        description: '',
        target: '1000000',
        unit: 'litres',
        pointsPerContribution: '5',
        bonusPoints: '500',
        startDate: new Date().toISOString().split('T')[0] || '',
        endDate: new Date(Date.now() + 2592000000).toISOString().split('T')[0] || '', // 30 days
    });
    const [milestones, setMilestones] = (0, react_1.useState)([
        { label: '250000', note: '100' },
        { label: '500000', note: '200' },
        { label: '750000', note: '300' },
        { label: '1000000', note: '500' },
    ]);
    (0, react_1.useEffect)(() => {
        const unsubscribe = challengeService_1.challengeService.subscribeToChallenges((data) => {
            setChallenges(data);
            setLoading(false);
        }, 'community');
        return () => unsubscribe();
    }, []);
    const handleChange = (key, value) => {
        setFormState((prev) => ({ ...prev, [key]: value }));
    };
    const handleMilestoneChange = (index, key, value) => {
        setMilestones((current) => current.map((item, idx) => idx === index ? { ...item, [key]: value } : item));
    };
    const handleSubmit = async (e) => {
        var _a;
        e.preventDefault();
        try {
            await challengeService_1.challengeService.createChallenge({
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
                createdBy: ((_a = firebase_1.auth.currentUser) === null || _a === void 0 ? void 0 : _a.uid) || 'admin',
                milestones: milestones,
            });
            setIsOpen(false);
            // Reset form
        }
        catch (error) {
            console.error("Error adding challenge: ", error);
            alert("Failed to create challenge");
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this challenge?')) {
            try {
                await challengeService_1.challengeService.deleteChallenge(id);
            }
            catch (error) {
                console.error("Error deleting challenge: ", error);
            }
        }
    };
    if (loading)
        return (0, jsx_runtime_1.jsx)("div", { className: "p-8 text-center text-slate-500", children: "Connecting to Firebase..." });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-slate-900", children: "Community Challenges" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500", children: "Global water saving initiatives" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsOpen(true), className: "inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 16 }), "New Community Goal"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-4", children: [
                    { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { size: 18 }), title: 'Global Events', value: challenges.length, iconClass: 'bg-emerald-50 text-emerald-600' },
                    { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Power, { size: 18 }), title: 'Active Now', value: challenges.filter(c => c.status === 'Active').length, iconClass: 'bg-emerald-50 text-emerald-600' },
                    { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { size: 18 }), title: 'Total Participants', value: challenges.reduce((acc, c) => acc + (c.participantsCount || 0), 0), iconClass: 'bg-sky-50 text-sky-600' },
                    { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.LineChart, { size: 18 }), title: 'Avg Progress', value: '60%', iconClass: 'bg-orange-50 text-orange-600' },
                ].map((stat, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: `flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconClass}`, children: stat.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold leading-none text-slate-900", children: stat.value }), (0, jsx_runtime_1.jsx)("div", { className: "text-[11px] text-slate-500", children: stat.title })] })] }, i))) }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-5", children: challenges.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "mx-auto text-slate-300 mb-4", size: 48 }), (0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-bold text-slate-900 mb-1", children: "No Community Challenges Yet" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500 mb-6", children: "Start your first global initiative to save water!" }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsOpen(true), className: "inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 18 }), "Create Initiative"] })] })) : (challenges.map((challenge) => ((0, jsx_runtime_1.jsx)("div", { className: "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-bold text-slate-900", children: challenge.title }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700", children: challenge.status })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500", children: challenge.description })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { className: "p-2 text-slate-400 hover:text-blue-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { size: 16 }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => challenge.id && handleDelete(challenge.id), className: "p-2 text-slate-400 hover:text-red-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 16 }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-end justify-between text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-700", children: challenge.progressLabel || '0% Complete' }), (0, jsx_runtime_1.jsx)("span", { className: "text-slate-500", children: challenge.progressValue || `0 / ${challenge.target} ${challenge.unit}` })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-2 w-full overflow-hidden rounded-full bg-slate-100", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-emerald-500 transition-all duration-500", style: { width: challenge.progressBar || '0%' } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-4 border-t border-slate-50 pt-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400", children: "Participants" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-bold text-slate-700", children: challenge.participantsCount || 0 })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400", children: "Pts/Contrib" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-bold text-slate-700", children: "5" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400", children: "Start Date" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-bold text-slate-700", children: challenge.startDate })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400", children: "End Date" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-bold text-slate-700", children: challenge.endDate })] })] })] })] }) }, challenge.id)))) }), isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-slate-900", children: "Create Community Challenge" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(false), className: "text-slate-400 hover:text-slate-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "col-span-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-xs font-bold uppercase text-slate-700", children: "Event Title" }), (0, jsx_runtime_1.jsx)("input", { type: "text", required: true, value: formState.title, onChange: e => handleChange('title', e.target.value), className: "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "col-span-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-xs font-bold uppercase text-slate-700", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { required: true, value: formState.description, onChange: e => handleChange('description', e.target.value), className: "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none", rows: 2 })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-xs font-bold uppercase text-slate-700", children: "Global Target" }), (0, jsx_runtime_1.jsx)("input", { type: "number", required: true, value: formState.target, onChange: e => handleChange('target', e.target.value), className: "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "mb-1 block text-xs font-bold uppercase text-slate-700", children: "Unit" }), (0, jsx_runtime_1.jsxs)("select", { value: formState.unit, onChange: e => handleChange('unit', e.target.value), className: "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "litres", children: "Litres Saved" }), (0, jsx_runtime_1.jsx)("option", { value: "leaks", children: "Leaks Fixed" }), (0, jsx_runtime_1.jsx)("option", { value: "trees", children: "Trees Planted" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 pt-4", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setIsOpen(false), className: "flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700", children: "Launch Challenge" })] })] })] }) }))] }));
}
//# sourceMappingURL=CommunityChallengesManager.js.map