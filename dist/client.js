"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("react-dom/client");
const index_1 = __importDefault(require("./index"));
const market_1 = __importDefault(require("./market"));
const admin_login_1 = __importDefault(require("./admin-login"));
const SuperAdminPortal_1 = __importDefault(require("./SuperAdminPortal"));
const AppStorePage_1 = __importDefault(require("./AppStorePage"));
const container = document.getElementById('root');
if (container) {
    const root = (0, client_1.createRoot)(container);
    root.render((0, jsx_runtime_1.jsx)(App, {}));
}
function App() {
    const [currentPage, setCurrentPage] = (0, react_1.useState)('home');
    if (currentPage === 'market') {
        return ((0, jsx_runtime_1.jsx)(market_1.default, { onBack: () => setCurrentPage('home') }));
    }
    if (currentPage === 'admin-login') {
        return ((0, jsx_runtime_1.jsx)(admin_login_1.default, { onBack: () => setCurrentPage('home'), onLoginSuccess: () => setCurrentPage('admin-portal') }));
    }
    if (currentPage === 'admin-portal') {
        return ((0, jsx_runtime_1.jsx)(SuperAdminPortal_1.default, { onLogout: () => setCurrentPage('home') }));
    }
    if (currentPage === 'app-store') {
        return ((0, jsx_runtime_1.jsx)(AppStorePage_1.default, { onBack: () => setCurrentPage('home'), onDownload: () => alert('Download functionality would be implemented here') }));
    }
    return ((0, jsx_runtime_1.jsx)(index_1.default, { onAdminLogin: () => setCurrentPage('admin-login'), onGetStarted: () => setCurrentPage('app-store'), onBackToApp: () => setCurrentPage('home'), onMarketClick: () => setCurrentPage('market') }));
}
//# sourceMappingURL=client.js.map