import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { KPIProvider } from './context/KPIContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import KPIReports from './pages/KPIReports';
import KPIDetail from './pages/KPIDetail';
import Settings from './pages/Settings';

function App() {
  return (
    <KPIProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reports" element={<KPIReports />} />
              <Route path="/kpi/:id" element={<KPIDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </KPIProvider>
  );
}

export default App;