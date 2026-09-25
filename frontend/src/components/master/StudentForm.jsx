import React, { useState } from 'react';
import { User, Mail, CreditCard, Search, Loader2 } from 'lucide-react';
import { fetchStudentByCarnet } from '../../services/api.service';

export default function StudentForm({ student, onChange, onStudentLoaded }) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchMsg, setSearchMsg] = useState(null);

  const handleLookup = async () => {
    if (!student.carnet || !student.carnet.trim()) {
      setSearchMsg({ type: 'warning', text: 'Ingresa un número de carnet primero' });
      return;
    }

    setIsSearching(true);
    setSearchMsg(null);

    try {
      const data = await fetchStudentByCarnet(student.carnet.trim());
      if (data && data.estudiante) {
        onStudentLoaded(data);
        setSearchMsg({
          type: 'success',
          text: `Estudiante encontrado: ${data.estudiante.nombre}. Datos cargados en el formulario.`,
        });
      }
    } catch (err) {
      setSearchMsg({
        type: 'info',
        text: 'El carnet no está registrado aún. Se insertará como nuevo estudiante al enviar.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'rgba(99, 102, 241, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
        }}>
          <User size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
            1. Datos del Estudiante (Maestro)
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            El carnet actúa como clave primaria. Si ya existe, se actualizarán sus datos.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        {/* Carnet Input + Buscar */}
        <div>
          <label className="input-label" htmlFor="input-carnet">
            Número de Carnet *
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                id="input-carnet"
                type="text"
                className="input-field"
                placeholder="Ej. 1890-20-11489"
                value={student.carnet}
                onChange={(e) => onChange('carnet', e.target.value)}
                required
              />
              <CreditCard size={18} color="var(--text-dim)" style={{ position: 'absolute', right: '12px', top: '13px' }} />
            </div>
            <button
              id="btn-search-carnet"
              type="button"
              className="btn-secondary"
              onClick={handleLookup}
              disabled={isSearching}
              title="Verificar si el estudiante ya está registrado"
            >
              {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              <span>Consultar</span>
            </button>
          </div>
        </div>

        {/* Nombre Completo */}
        <div>
          <label className="input-label" htmlFor="input-nombre">
            Nombre Completo *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="input-nombre"
              type="text"
              className="input-field"
              placeholder="Ej. Luis David Aroche Contreras"
              value={student.nombre}
              onChange={(e) => onChange('nombre', e.target.value)}
              required
            />
            <User size={18} color="var(--text-dim)" style={{ position: 'absolute', right: '12px', top: '13px' }} />
          </div>
        </div>

        {/* Correo Electrónico */}
        <div>
          <label className="input-label" htmlFor="input-correo">
            Correo Electrónico Institucional *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="input-correo"
              type="email"
              className="input-field"
              placeholder="Ej. larochec2@miumg.edu.gt"
              value={student.correo}
              onChange={(e) => onChange('correo', e.target.value)}
              required
            />
            <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', right: '12px', top: '13px' }} />
          </div>
        </div>
      </div>

      {searchMsg && (
        <div style={{
          marginTop: '14px',
          padding: '8px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          backgroundColor: searchMsg.type === 'success' ? 'var(--success-bg)' : 'rgba(255,255,255,0.05)',
          color: searchMsg.type === 'success' ? 'var(--success)' : 'var(--text-muted)',
          border: `1px solid ${searchMsg.type === 'success' ? 'var(--success-border)' : 'var(--border-subtle)'}`,
        }}>
          {searchMsg.text}
        </div>
      )}
    </div>
  );
}
