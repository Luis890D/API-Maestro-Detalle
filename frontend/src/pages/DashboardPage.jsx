import React, { useState, useEffect } from 'react';
import { BarChart3, Users, CheckCircle2, TrendingUp, Search, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';
import { fetchDashboardData, getBaseApiUrl } from '../services/api.service';

export default function DashboardPage({ refreshTrigger, onSelectStudent }) {
  const [data, setData] = useState({ estudiantes: [], detalles: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgress, setFilterProgress] = useState('all');

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchDashboardData();
      setData(result || { estudiantes: [], detalles: [] });
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const estudiantes = data.estudiantes || [];
  const detalles = data.detalles || [];

  // Map misiones por estudiante para consulta rápida
  const studentDetailsMap = {};
  detalles.forEach((d) => {
    if (!studentDetailsMap[d.Carnet]) {
      studentDetailsMap[d.Carnet] = {};
    }
    studentDetailsMap[d.Carnet][d.MisionID] = {
      nombre: d.MisionNombre,
      estado: d.Estado === 1 || d.Estado === true,
    };
  });

  // Estadísticas globales
  const totalEstudiantes = estudiantes.length;
  const completados = estudiantes.filter((e) => e.PorcentajeAvance === 100).length;
  const promedioAvance = totalEstudiantes > 0
    ? Math.round(estudiantes.reduce((acc, curr) => acc + (curr.PorcentajeAvance || 0), 0) / totalEstudiantes)
    : 0;

  // Filtrado
  const filteredEstudiantes = estudiantes.filter((est) => {
    const matchesSearch =
      est.Carnet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.Correo?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterProgress === 'completed') return est.PorcentajeAvance === 100;
    if (filterProgress === 'in_progress') return est.PorcentajeAvance > 0 && est.PorcentajeAvance < 100;
    if (filterProgress === 'not_started') return est.PorcentajeAvance === 0;

    return true;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }} className="animate-fade-in">
      {/* Header and Refresh */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Dashboard General de Avance
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0 0' }}>
            Visualización consolidada de estudiantes y estado de misiones (compatible con el formato oficial).
          </p>
        </div>

        <button
          id="btn-refresh-dashboard"
          onClick={loadData}
          className="btn-secondary"
          disabled={isLoading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          <span>{isLoading ? 'Actualizando...' : 'Recargar Datos'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px',
        marginBottom: '28px',
      }}>
        {/* Total Estudiantes */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
                Estudiantes Registrados
              </p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '6px 0 0 0' }}>
                {totalEstudiantes}
              </h3>
            </div>
            <div style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary)',
            }}>
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* Reto Completado (100%) */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
                Reto Completado (100%)
              </p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', margin: '6px 0 0 0' }}>
                {completados}
              </h3>
            </div>
            <div style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--success)',
            }}>
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        {/* Promedio de Avance */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
                Promedio de Avance
              </p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', margin: '6px 0 0 0' }}>
                {promedioAvance}%
              </h3>
            </div>
            <div style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.15)',
              color: '#a78bfa',
            }}>
              <TrendingUp size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <input
              id="search-input"
              type="text"
              className="input-field"
              placeholder="Buscar por carnet, nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setFilterProgress('all')}
              className={`btn-secondary ${filterProgress === 'all' ? 'badge-primary' : ''}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              Todos ({totalEstudiantes})
            </button>
            <button
              onClick={() => setFilterProgress('completed')}
              className={`btn-secondary ${filterProgress === 'completed' ? 'badge-success' : ''}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              100% Finalizados ({completados})
            </button>
            <button
              onClick={() => setFilterProgress('in_progress')}
              className={`btn-secondary ${filterProgress === 'in_progress' ? 'badge-primary' : ''}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              En Progreso
            </button>
          </div>
        </div>
      </div>

      {/* Error View */}
      {error && (
        <div className="glass-card" style={{
          padding: '24px',
          textAlign: 'center',
          borderColor: 'var(--danger-border)',
          backgroundColor: 'var(--danger-bg)',
          marginBottom: '20px',
        }}>
          <AlertCircle size={32} color="var(--danger)" style={{ margin: '0 auto 12px auto' }} />
          <h4 style={{ color: 'var(--danger)', margin: 0 }}>Error al conectar con la API</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '6px 0 16px 0' }}>
            {error}. Verifica que el servidor backend esté corriendo en <code>{getBaseApiUrl()}</code>.
          </p>
          <button onClick={loadData} className="btn-secondary" style={{ margin: '0 auto' }}>
            Intentar nuevamente
          </button>
        </div>
      )}

      {/* Main Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid var(--border-subtle)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
              }}>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Carnet</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Estudiante</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Progreso General</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Misiones (1 a 5)</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstudiantes.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
                    {isLoading ? 'Cargando datos del dashboard...' : 'No se encontraron estudiantes registrados.'}
                  </td>
                </tr>
              ) : (
                filteredEstudiantes.map((est) => {
                  const misionesMap = studentDetailsMap[est.Carnet] || {};
                  return (
                    <tr
                      key={est.Carnet}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Carnet */}
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#ffffff' }}>
                        <code>{est.Carnet}</code>
                      </td>

                      {/* Estudiante Info */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#f8fafc' }}>{est.Nombre}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{est.Correo}</div>
                      </td>

                      {/* Progreso */}
                      <td style={{ padding: '16px 20px', minWidth: '180px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            flex: 1,
                            height: '6px',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${est.PorcentajeAvance || 0}%`,
                              height: '100%',
                              backgroundColor: est.PorcentajeAvance === 100 ? 'var(--success)' : 'var(--primary)',
                              borderRadius: 'var(--radius-full)',
                            }} />
                          </div>
                          <span style={{
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: est.PorcentajeAvance === 100 ? 'var(--success)' : '#ffffff',
                            width: '40px',
                            textAlign: 'right',
                          }}>
                            {est.PorcentajeAvance || 0}%
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                          {est.MisionesCompletadas} de {est.TotalMisiones || 5} misiones
                        </div>
                      </td>

                      {/* Estado Misiones 1 a 5 */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {[1, 2, 3, 4, 5].map((mId) => {
                            const isDone = misionesMap[mId]?.estado;
                            return (
                              <span
                                key={mId}
                                title={`Misión #${mId}: ${isDone ? 'Completada' : 'Pendiente'}`}
                                className={`badge ${isDone ? 'badge-success' : 'badge-primary'}`}
                                style={{
                                  padding: '3px 8px',
                                  fontSize: '0.72rem',
                                  opacity: isDone ? 1 : 0.45,
                                }}
                              >
                                M{mId} {isDone ? '✓' : '—'}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* Acción */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        {onSelectStudent && (
                          <button
                            onClick={() => onSelectStudent(est.Carnet)}
                            className="btn-secondary"
                            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                            title="Cargar estudiante en el formulario de edición"
                          >
                            <span>Editar</span>
                            <ArrowUpRight size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
