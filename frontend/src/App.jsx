import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApiSettingsModal from './components/common/ApiSettingsModal';
import { getBaseApiUrl } from './services/api.service';

export default function App() {
  const [activeTab, setActiveTab] = useState('register');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState(getBaseApiUrl());
  const [refreshDashboardTrigger, setRefreshDashboardTrigger] = useState(0);

  const handleRecordUpdated = () => {
    setRefreshDashboardTrigger((prev) => prev + 1);
  };

  const handleSelectStudentForEdit = (carnet) => {
    setActiveTab('register');
    // Si queremos pre-llenar, podemos usar un trigger o consultar el estudiante
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentApiUrl={apiUrl}
      />

      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {activeTab === 'register' ? (
          <RegisterPage onRecordUpdated={handleRecordUpdated} />
        ) : (
          <DashboardPage
            refreshTrigger={refreshDashboardTrigger}
            onSelectStudent={handleSelectStudentForEdit}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px 16px',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.85rem',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span>Desarrollo Web — 8vo Semestre UMG</span>
          <span>Arquitectura en Capas: Controller - Service - Repository</span>
          <span>Endpoint: <code>{apiUrl}</code></span>
        </div>
      </footer>

      {/* Settings Modal */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={() => {
          setApiUrl(getBaseApiUrl());
          setRefreshDashboardTrigger((prev) => prev + 1);
        }}
      />
    </div>
  );
}
