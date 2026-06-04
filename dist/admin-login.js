"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminLoginPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const firebase_1 = require("./firebase");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
function AdminLoginPage({ onBack, onLoginSuccess }) {
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [email, setEmail] = (0, react_1.useState)('dikitosimbarashe@gmail.com');
    const [password, setPassword] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const userCredential = await (0, auth_1.signInWithEmailAndPassword)(firebase_1.auth, email, password);
            const user = userCredential.user;
            // Check if user has admin/superAdmin role
            const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === 'admin' || userData.role === 'superAdmin') {
                    onLoginSuccess();
                }
                else {
                    setError('Access denied: You do not have administrator privileges.');
                    await firebase_1.auth.signOut();
                }
            }
            else {
                setError('User record not found in the database.');
                await firebase_1.auth.signOut();
            }
        }
        catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to login. Please check your credentials.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-[#8B5CF6] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 opacity-10 pointer-events-none", children: (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0", style: { backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0 overflow-hidden pointer-events-none z-0", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: {
                            y: [0, -100, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.4, 0.7, 0.4]
                        }, transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }, className: "absolute top-[5%] left-[5%] w-[400px] h-[400px] bg-purple-200 rounded-full" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: {
                            y: [0, 100, 0],
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.6, 0.3]
                        }, transition: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }, className: "absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white rounded-full" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: {
                            x: [0, 80, 0],
                            scale: [1, 1.3, 1],
                            opacity: [0.35, 0.65, 0.35]
                        }, transition: { duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }, className: "absolute top-[30%] right-[10%] w-[350px] h-[350px] bg-purple-100 rounded-full" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: onBack, className: "absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-semibold text-sm group", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 18, className: "group-hover:-translate-x-1 transition-transform" }), "Back to App"] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl p-8 md:p-10 relative z-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "w-16 h-16 bg-[#8B5CF6] rounded-2xl flex items-center justify-center mb-6 relative shadow-lg shadow-purple-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute -top-2 -right-2", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { size: 20, className: "text-yellow-400 fill-yellow-400" }) }), (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { size: 32, className: "text-white" })] }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-slate-900 mb-2 tracking-tight", children: "SuperAdmin Portal" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-400 text-xs font-medium text-center", children: "Sign in to access the admin dashboard" })] }), error && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-xl flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Info, { size: 16 }), error] })), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleLogin, className: "space-y-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-bold text-slate-700 ml-1", children: "Email Address" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative group", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#8B5CF6] transition-colors", size: 18 }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "dikitosimbarashe@gmail.com", className: "w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-white transition-all text-xs font-medium placeholder:text-slate-300", required: true })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-bold text-slate-700 ml-1", children: "Password" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative group", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#8B5CF6] transition-colors", size: 18 }), (0, jsx_runtime_1.jsx)("input", { type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Enter your password", className: "w-full pl-11 pr-11 py-3.5 bg-[#F8FAFC] border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-white transition-all text-xs font-medium placeholder:text-slate-300", required: true }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors", children: showPassword ? (0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { size: 18 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 18 }) })] })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading, className: "w-full bg-[#8B5CF6] text-white font-bold py-4 rounded-xl shadow-xl shadow-purple-200 hover:bg-[#7C3AED] hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed text-sm", children: isLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { size: 18 }), "Sign In Securely"] })) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 flex flex-col items-center gap-4", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-[9px] text-slate-400 font-medium", children: ["Protected by end-to-end encryption \u2022 ", (0, jsx_runtime_1.jsx)("span", { className: "text-[#8B5CF6] hover:underline cursor-pointer", children: "Privacy Policy" })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-10 flex items-center gap-2 text-white/50 text-[10px] font-medium tracking-wide", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { size: 12 }), "Secured by AquaSavvy Authentication System"] })] }));
}
//# sourceMappingURL=admin-login.js.map