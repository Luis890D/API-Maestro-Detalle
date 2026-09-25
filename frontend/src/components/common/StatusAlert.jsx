import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export default function StatusAlert({ alert, onClose }) {
  if (!alert) return null;

  const isSuccess = alert.type === 'success';
  const isReferenceError = alert.status === 422;

  const borderColor = isSuccess ? 'var(--success-border)' : isReferenceError ? 'var(--warning-border)' : 'var(--danger-border)';
  const bgColor = isSuccess ? 'var(--success-bg)' : isReferenceError ? 'var(--warning-bg)' : 'var(--danger-bg)';
  const textColor = isSuccess ? 'var(--success)' : isReferenceError ? 'var(--warning)' : 'var(--danger)';

  return (
    <div
      className="animate-fade-in"
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        position: 'relative',
      }}
    >
      <div style={{ color: textColor, marginTop: '2px' }}>
        {isSuccess ? <CheckCircle2 size={22} /> : isReferenceError ? <AlertTriangle size={22} /> : <XCircle size={22} />}
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ color: textColor, fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>
          {isSuccess ? '¡Operación Exitosa!' : isReferenceError ? 'Error de Integridad Referencial (HTTP 422)' : 'Error en la Petición'}
        </h4>
        <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>
          {alert.message}
        </p>

        {alert.details?.misionesNoValidas && (
          <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              IDs de misión rechazados por el catálogo oficial:
            </span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              {alert.details.misionesNoValidas.map((id) => (
                <span key={id} className="badge badge-danger">
                  ID: {id} (Inexistente)
                </span>
              ))}
            </div>
          </div>
        )}

        {alert.details?.errores && (
          <ul style={{ margin: '8px 0 0 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {alert.details.errores.map((e, idx) => (
              <li key={idx}><strong>{e.campo}:</strong> {e.mensaje}</li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-dim)',
          cursor: 'pointer',
          padding: '4px',
        }}
        title="Cerrar notificación"
      >
        <X size={18} />
      </button>
    </div>
  );
}
