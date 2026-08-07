import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

import { DashboardPage } from './pages/DashboardPage';
import { ApplyLoanPage } from './pages/ApplyLoanPage';
import { LoanTrackingPage } from './pages/LoanTrackingPage';
import { EMICalculatorPage } from './pages/EMICalculatorPage';
import { OfficerDashboardPage } from './pages/OfficerDashboardPage';
import { ManagerDashboardPage } from './pages/ManagerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ArchitectureDocsPage } from './pages/ArchitectureDocsPage';
import LoginPage from './pages/LoginPage';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/apply" element={<ApplyLoanPage />} />
            <Route path="/track" element={<LoanTrackingPage />} />
            <Route path="/calculator" element={<EMICalculatorPage />} />
            <Route path="/officer-queue" element={<OfficerDashboardPage />} />
            <Route path="/manager-approvals" element={<ManagerDashboardPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/architecture" element={<ArchitectureDocsPage />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}