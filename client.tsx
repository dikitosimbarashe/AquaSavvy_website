import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import AquaSavvyWebsite from './index';
import WebsiteMarketPage from './market';
import AdminLoginPage from './admin-login';
import SuperAdminPortal from './SuperAdminPortal';
import AppStorePage from './AppStorePage';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'market' | 'admin-login' | 'admin-portal' | 'app-store'>('home');

  if (currentPage === 'market') {
    return (
      <WebsiteMarketPage
        onBack={() => setCurrentPage('home')}
      />
    );
  }

  if (currentPage === 'admin-login') {
    return (
      <AdminLoginPage
        onBack={() => setCurrentPage('home')}
        onLoginSuccess={() => setCurrentPage('admin-portal')}
      />
    );
  }

  if (currentPage === 'admin-portal') {
    return (
      <SuperAdminPortal
        onLogout={() => setCurrentPage('home')}
      />
    );
  }

  if (currentPage === 'app-store') {
    return (
      <AppStorePage
        onBack={() => setCurrentPage('home')}
        onDownload={() => alert('Download functionality would be implemented here')}
      />
    );
  }

  return (
    <AquaSavvyWebsite
      onAdminLogin={() => setCurrentPage('admin-login')}
      onGetStarted={() => setCurrentPage('app-store')}
      onBackToApp={() => setCurrentPage('home')}
      onMarketClick={() => setCurrentPage('market')}
    />
  );
}
