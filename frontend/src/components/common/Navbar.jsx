import React from 'react';
import { Layers, BarChart3, Settings, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenSettings, currentApiUrl }) {
  const isCustomUrl = currentApiUrl && currentApiUrl !== '/api';

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
          }}>
            <Layers size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                API Maestro-Detalle
              </h1>
              <span className="badge badge-primary">Reto Web</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}>
              Sincronización Estudiante & Misiones
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <button
            id="tab-btn-register"
            onClick={() => setActiveTab('register')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'register' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'register' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'register' ? '0 2px 8px rgba(99, 102, 241, 0.4)' : 'none',
            }}
          >
            <ShieldCheck size={18} />
            <span>Registro y Sincronización</span>
          </button>

          <button
            id="tab-btn-dashboard"
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'dashboard' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'dashboard' ? '0 2px 8px rgba(99, 102, 241, 0.4)' : 'none',
            }}
          >
            <BarChart3 size={18} />
            <span>Dashboard Universitario</span>
          </button>
        </nav>

        {/* API Settings Button */}
        <div>
          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="btn-secondary"
            title="Configurar Endpoint de API"
            style={{ fontSize: '0.85rem' }}
          >
            <Settings size={16} />
            <span>Endpoint: {isCustomUrl ? 'Remoto' : 'Local (/api)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
