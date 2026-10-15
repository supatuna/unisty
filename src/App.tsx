import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PresenterToolbar } from './components/PresenterToolbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { NewListingPage } from './pages/NewListingPage';
import { WorkPage } from './pages/WorkPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { SafetyPage } from './pages/SafetyPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-600 selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Routed Content */}
      <main className="flex-1 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/listings/new" element={<NewListingPage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/profiles/:id" element={<ProfilePage />} />
          <Route path="/work/:id" element={<WorkPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation (App native experience) */}
      <MobileBottomNav />

      {/* Presenter / Reviewer Hidden DevTools Toolbar */}
      <PresenterToolbar />
    </div>
  );
};

export default App;
