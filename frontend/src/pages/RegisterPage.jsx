import React, { useState, useEffect } from 'react';
import { Send, Code2, RefreshCw, CheckCircle, ShieldCheck } from 'lucide-react';
import StudentForm from '../components/master/StudentForm';
import MissionsList from '../components/detail/MissionsList';
import StatusAlert from '../components/common/StatusAlert';
import { sendStudentMissions, fetchCatalogue } from '../services/api.service';

export default function RegisterPage({ onRecordUpdated }) {
  const [student, setStudent] = useState({
    carnet: '',
    nombre: '',
    correo: '',
  });

  const [missions, setMissions] = useState([
    { idMision: 1, nombre: 'Crear API', descripcion: 'Desarrollar la API REST maestro-detalle', estado: false },
    { idMision: 2, nombre: 'Crear Frontend', descripcion: 'Interfaz web para visualización y registro', estado: false },
    { idMision: 3, nombre: 'Subir código a GitHub', descripcion: 'Control de versiones y repositorio público', estado: false },
    { idMision: 4, nombre: 'Publicar en hosting', descripcion: 'Despliegue en la nube o servidor', estado: false },
    { idMision: 5, nombre: 'Pruebas de ingreso', descripcion: 'Validación de flujo completo y casos borde', estado: false },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  // Carga inicial del catálogo desde la API
  useEffect(() => {
    fetchCatalogue()
      .then((cat) => {
        if (cat && Array.isArray(cat) && cat.length > 0) {
          setMissions((prev) =>
            cat.map((c) => {
              const prevItem = prev.find((p) => p.idMision === c.id);
              return {
                idMision: c.id,
                nombre: c.nombre,
                descripcion: c.descripcion || '',
                estado: prevItem ? prevItem.estado : false,
              };
            })
          );
        }
      })
      .catch(() => {
        // Mantiene el catálogo predeterminado
      });
  }, []);

  const handleStudentChange = (field, value) => {
    setStudent((prev) => ({ ...prev, [field]: value }));
  };

  const handleStudentLoaded = (data) => {
    if (data.estudiante) {
      setStudent({
        carnet: data.estudiante.carnet,
        nombre: data.estudiante.nombre,
        correo: data.estudiante.correo,
      });
    }

    if (data.misiones && Array.isArray(data.misiones)) {
      setMissions((prev) =>
        prev.map((m) => {
          const found = data.misiones.find((dm) => dm.MisionID === m.idMision || dm.id_mision === m.idMision);
          return {
            ...m,
            estado: found ? Boolean(found.Estado ?? found.estado) : false,
          };
        })
      );
    }
  };

  const handleToggleMission = (idMision, newEstado) => {
    setMissions((prev) =>
      prev.map((m) => (m.idMision === idMision ? { ...m, estado: newEstado } : m))
    );
  };

  const handleSetAll = (estado) => {
    setMissions((prev) => prev.map((m) => ({ ...m, estado })));
  };

  const handleAddInvalidMission = () => {
    if (missions.some((m) => m.idMision === 99)) return;
    setMissions((prev) => [
      ...prev,
      {
        idMision: 99,
        nombre: 'Misión Fantasma (ID Inválido)',
        descripcion: 'Esta misión no existe en el catálogo. Al enviar el POST, el backend devolverá HTTP 422.',
        estado: true,
      },
    ]);
  };

  const handleRemoveMission = (idMision) => {
    setMissions((prev) => prev.filter((m) => m.idMision !== idMision));
  };

  // Construir el payload JSON que se enviará en el POST
  const buildPayload = () => ({
    carnet: student.carnet.trim(),
    nombre: student.nombre.trim(),
    correo: student.correo.trim(),
    misiones: missions.map((m) => ({
      idMision: m.idMision,
      estado: m.estado,
    })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    // Validación básica en cliente
    if (!student.carnet || !student.nombre || !student.correo) {
      setAlert({
        type: 'error',
        message: 'Por favor completa todos los campos del estudiante (carnet, nombre, correo).',
      });
      return;
    }

    const payload = buildPayload();
    setIsLoading(true);

    try {
      const response = await sendStudentMissions(payload);
      const op = response.data?.estudiante?.operacion || response.data?.operacionEstudiante || 'SINCRONIZADO';
      const misionesCount = response.data?.misionesActualizadas ?? response.data?.misionesProcesadas ?? missions.length;

      setAlert({
        type: 'success',
        status: 200,
        message: `¡Estudiante con carnet ${student.carnet} ${op.toLowerCase()} exitosamente! Se procesaron ${misionesCount} misiones en el detalle.`,
      });

      if (onRecordUpdated) onRecordUpdated();
    } catch (err) {
      setAlert({
        type: 'error',
        status: err.status || 500,
        message: err.message || 'Error al enviar los datos a la API.',
        details: err.details,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px' }} className="animate-fade-in">
      {/* Intro Hero */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
          Registro y Sincronización Maestro-Detalle
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Envía los datos del estudiante y el progreso de sus misiones en un único <code>POST</code>. 
          Si el carnet ya está registrado, sus datos y el estado de sus misiones se actualizarán automáticamente.
        </p>
      </div>

      <StatusAlert alert={alert} onClose={() => setAlert(null)} />

      <form onSubmit={handleSubmit}>
        <StudentForm
          student={student}
          onChange={handleStudentChange}
          onStudentLoaded={handleStudentLoaded}
        />

        <MissionsList
          missions={missions}
          onToggleMission={handleToggleMission}
          onSetAll={handleSetAll}
          onAddInvalidMission={handleAddInvalidMission}
          onRemoveMission={handleRemoveMission}
        />

        {/* Action Panel */}
        <div className="glass-card" style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowJsonPreview(!showJsonPreview)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Code2 size={16} />
            <span>{showJsonPreview ? 'Ocultar JSON Preview' : 'Ver Payload JSON (POST)'}</span>
          </button>

          <button
            id="btn-submit-post"
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ minWidth: '220px' }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Sincronizando en BD...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Enviar en un solo POST</span>
              </>
            )}
          </button>
        </div>

        {/* Live JSON Preview */}
        {showJsonPreview && (
          <div className="glass-card animate-fade-in" style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#0a0e17',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Payload a enviar a <code>POST /api/estudiantes</code>:
              </span>
            </div>
            <pre style={{
              margin: 0,
              fontSize: '0.85rem',
              color: '#38bdf8',
              fontFamily: 'monospace',
              overflowX: 'auto',
              maxHeight: '260px',
            }}>
              {JSON.stringify(buildPayload(), null, 2)}
            </pre>
          </div>
        )}
      </form>
    </div>
  );
}
