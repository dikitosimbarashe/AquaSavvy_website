"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminDashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
function AdminDashboard({ onNavigate }) {
    const stats = [
        {
            label: 'Active Daily Challenges',
            value: '3',
            icon: lucide_react_1.Calendar,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            change: '+2 from yesterday',
            changeType: 'positive'
        },
        {
            label: 'Active Weekly Challenges',
            value: '2',
            icon: lucide_react_1.CalendarDays,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            change: 'Same as last week',
            changeType: 'neutral'
        },
        {
            label: 'Community Challenges',
            value: '1',
            icon: lucide_react_1.Users,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            change: 'Active worldwide',
            changeType: 'positive'
        },
        {
            label: 'Pending Plumber Reviews',
            value: '3',
            icon: lucide_react_1.UserCheck,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            change: 'Requires attention',
            changeType: 'neutral'
        }
    ];
    const quickActions = [
        {
            title: 'Manage Daily Challenges',
            description: 'Create, edit, or deactivate daily challenges',
            icon: lucide_react_1.Calendar,
            color: 'from-blue-500 to-blue-600',
            action: () => onNavigate('daily')
        },
        {
            title: 'Manage Weekly Challenges',
            description: 'Control weekly challenge campaigns',
            icon: lucide_react_1.CalendarDays,
            color: 'from-purple-500 to-purple-600',
            action: () => onNavigate('weekly')
        },
        {
            title: 'Manage Community Challenges',
            description: 'Set up global community events',
            icon: lucide_react_1.Users,
            color: 'from-green-500 to-green-600',
            action: () => onNavigate('community')
        },
        {
            title: 'Verify Plumbers',
            description: 'Review and approve plumber applications',
            icon: lucide_react_1.UserCheck,
            color: 'from-orange-500 to-orange-600',
            action: () => onNavigate('plumbers')
        },
        {
            title: 'Manage Market',
            description: 'Control products, orders, and inventory',
            icon: lucide_react_1.ShoppingCart,
            color: 'from-cyan-500 to-cyan-600',
            action: () => onNavigate('market')
        }
    ];
    const recentActivity = [
        {
            type: 'created',
            challenge: 'Daily: Save 10L Challenge',
            time: '2 hours ago',
            icon: lucide_react_1.CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            type: 'updated',
            challenge: 'Weekly: Eco Warrior Week',
            time: '5 hours ago',
            icon: lucide_react_1.Clock,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            type: 'activated',
            challenge: 'Community: Global Water Day',
            time: '1 day ago',
            icon: lucide_react_1.Activity,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            type: 'expired',
            challenge: 'Daily: Leak Detection Mission',
            time: '2 days ago',
            icon: lucide_react_1.AlertCircle,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-start justify-between mb-4", children: (0, jsx_runtime_1.jsx)("div", { className: `p-3 rounded-xl ${stat.bgColor}`, children: (0, jsx_runtime_1.jsx)(Icon, { size: 24, className: stat.iconColor }) }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-3xl font-bold text-slate-900 mb-1", children: stat.value }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-slate-600 mb-2", children: stat.label }), (0, jsx_runtime_1.jsx)("p", { className: `text-xs font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-slate-500'}`, children: stat.change })] }, index));
                }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-slate-900 mb-4", children: "Quick Actions" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4", children: quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return ((0, jsx_runtime_1.jsxs)("button", { onClick: action.action, className: "bg-white rounded-xl border border-slate-200 p-6 text-left hover:shadow-lg hover:border-slate-300 transition-all group", children: [(0, jsx_runtime_1.jsx)("div", { className: `inline-flex p-3 rounded-xl bg-gradient-to-br ${action.color} mb-4 group-hover:scale-110 transition-transform`, children: (0, jsx_runtime_1.jsx)(Icon, { size: 24, className: "text-white" }) }), (0, jsx_runtime_1.jsx)("h4", { className: "text-base font-semibold text-slate-900 mb-2", children: action.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600", children: action.description })] }, index));
                        }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl border border-slate-200 p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-slate-900 mb-4", children: "Recent Activity" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: recentActivity.map((activity, index) => {
                                    const Icon = activity.icon;
                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: `p-2 rounded-lg ${activity.bgColor}`, children: (0, jsx_runtime_1.jsx)(Icon, { size: 16, className: activity.color }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-slate-900 truncate", children: activity.challenge }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 mt-1", children: activity.time })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-medium text-slate-600 capitalize bg-slate-100 px-2 py-1 rounded", children: activity.type })] }, index));
                                }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl border border-slate-200 p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-slate-900 mb-4", children: "Challenge Performance" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-slate-700", children: "Daily Completion Rate" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-bold text-blue-600", children: "78%" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full h-2 bg-slate-100 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full", style: { width: '78%' } }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-slate-700", children: "Weekly Completion Rate" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-bold text-purple-600", children: "65%" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full h-2 bg-slate-100 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full", style: { width: '65%' } }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-slate-700", children: "Community Participation" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-bold text-green-600", children: "92%" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full h-2 bg-slate-100 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full", style: { width: '92%' } }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "pt-4 border-t border-slate-200 mt-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-600", children: "Average Points Awarded" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-2xl font-bold text-slate-900 mt-1", children: ["450", (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-slate-500", children: "/day" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-600", children: "Active Users" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-slate-900 mt-1", children: "1.2K" })] })] }) })] })] })] })] }));
}
//# sourceMappingURL=AdminDashboard.js.map