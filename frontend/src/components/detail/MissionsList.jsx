import React from 'react';
import { Target, CheckCircle2, Circle, AlertCircle, PlusCircle, Trash2 } from 'lucide-react';

export default function MissionsList({ missions, onToggleMission, onSetAll, onAddInvalidMission, onRemoveMission }) {
  const completedCount = missions.filter((m) => m.estado).length;
  const totalCount = missions.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      {/* Header and Progress */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--success)',
          }}>
            <Target size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              2. Misiones del Reto (Detalle)
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Modifica el estado booleano de cada misión. Se sincronizarán en el mismo POST.
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Progreso: <strong style={{ color: '#ffffff' }}>{completedCount} / {totalCount}</strong> ({percentage}%)
          </span>
          <div style={{
            width: '120px',
            height: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${percentage}%`,
              height: '100%',
              background: 'var(--primary-gradient)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }} />
          </div>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '16px',
        padding: '10px 14px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            onClick={() => onSetAll(true)}
          >
            Marcar Todas
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            onClick={() => onSetAll(false)}
          >
            Desmarcar Todas
          </button>
        </div>

        <button
          type="button"
          className="btn-secondary"
          style={{
            fontSize: '0.8rem',
            padding: '6px 12px',
            borderColor: 'var(--danger-border)',
            color: '#f87171',
          }}
          onClick={onAddInvalidMission}
          title="Prueba de laboratorio: Agrega una misión con ID=99 que no existe en el catálogo para verificar que el backend devuelve error HTTP 422"
        >
          <PlusCircle size={14} />
          <span>Probar ID Inválido (Test Error 422)</span>
        </button>
      </div>

      {/* Mission Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {missions.map((m) => {
          const isInvalid = m.idMision === 99 || m.idMision > 5;
          return (
            <div
              key={m.idMision}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isInvalid
                  ? 'rgba(239, 68, 68, 0.08)'
                  : m.estado
                  ? 'rgba(16, 185, 129, 0.06)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${
                  isInvalid
                    ? 'var(--danger-border)'
                    : m.estado
                    ? 'rgba(16, 185, 129, 0.25)'
                    : 'var(--border-subtle)'
                }`,
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span className={`badge ${isInvalid ? 'badge-danger' : m.estado ? 'badge-success' : 'badge-primary'}`}>
                  ID: #{m.idMision}
                </span>

                <div>
                  <h4 style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    margin: 0,
                    color: isInvalid ? '#fca5a5' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    {m.nombre || `Misión ID ${m.idMision}`}
                    {isInvalid && <AlertCircle size={14} color="var(--danger)" />}
                  </h4>
                  {m.descripcion && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                      {m.descripcion}
                    </p>
                  )}
                  {isInvalid && (
                    <span style={{ fontSize: '0.75rem', color: '#f87171' }}>
                      * ID fuera del catálogo oficial para validar la integridad referencial.
                    </span>
                  )}
                </div>
              </div>

              {/* Status & Toggle Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: m.estado ? 'var(--success)' : 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  {m.estado ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  {m.estado ? 'Completada' : 'Pendiente'}
                </span>

                <label className="switch-container">
                  <input
                    type="checkbox"
                    checked={m.estado}
                    onChange={(e) => onToggleMission(m.idMision, e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                </label>

                {isInvalid && onRemoveMission && (
                  <button
                    type="button"
                    onClick={() => onRemoveMission(m.idMision)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    title="Quitar misión de prueba"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
