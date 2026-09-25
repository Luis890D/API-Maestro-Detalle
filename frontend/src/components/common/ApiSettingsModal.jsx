import React, { useState } from 'react';
import { X, Server, Check, RotateCcw } from 'lucide-react';
import { getBaseApiUrl, setBaseApiUrl } from '../../services/api.service';

export default function ApiSettingsModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const [url, setUrl] = useState(getBaseApiUrl());

  const handleSave = () => {
    setBaseApiUrl(url);
    onSave();
    onClose();
  };

  const handleReset = () => {
    setUrl('/api');
    setBaseApiUrl('/api');
    onSave();
    onClose();
  };

  const setUniversityUrl = () => {
    setUrl('http://52.171.58.51:8080/api');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px',
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '24px',
        position: 'relative',
        background: '#121826',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={22} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>Configuración del Endpoint de la API</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ marginBottom: '20px' }}>
          <label className="input-label" htmlFor="api-url-input">URL Base de la API</label>
          <input
            id="api-url-input"
            type="text"
            className="input-field"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://localhost:3000/api o /api"
          />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '6px' }}>
            Por defecto se usa <code>/api</code> que redirige a tu backend local de Node.js (puerto 3000).
          </p>

          {/* Quick presets */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => setUrl('/api')}
            >
              Usar Local (/api)
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={setUniversityUrl}
            >
              Usar Servidor UMG (52.171.58.51)
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={16} />
            Restablecer
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn-primary" onClick={handleSave}>
              <Check size={16} />
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
