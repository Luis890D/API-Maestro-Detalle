const DEFAULT_API_URL = '/api';

export function getBaseApiUrl() {
  return localStorage.getItem('api_endpoint_url') || DEFAULT_API_URL;
}

export function setBaseApiUrl(url) {
  if (!url) {
    localStorage.removeItem('api_endpoint_url');
  } else {
    localStorage.setItem('api_endpoint_url', url.trim());
  }
}

/**
 * Enviar el JSON Maestro-Detalle en un solo POST
 */
export async function sendStudentMissions(payload) {
  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}/estudiantes`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'Error al procesar los datos');
    error.status = response.status;
    error.details = data.detalles || null;
    throw error;
  }

  return data;
}

/**
 * Consultar los datos del Dashboard
 */
export async function fetchDashboardData() {
  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}/dashboard`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al consultar datos del dashboard');
  }

  return data;
}

/**
 * Consultar catálogo de misiones
 */
export async function fetchCatalogue() {
  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}/misiones`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al cargar catálogo');
    const json = await response.json();
    return json.data || json;
  } catch (err) {
    // Si falla o la ruta no existe en el servidor remoto, retornamos el catálogo predeterminado
    return [
      { id: 1, nombre: 'Crear API', descripcion: 'Desarrollar la API REST maestro-detalle' },
      { id: 2, nombre: 'Crear Frontend', descripcion: 'Interfaz web para visualización y registro' },
      { id: 3, nombre: 'Subir código a GitHub', descripcion: 'Control de versiones y repositorio público' },
      { id: 4, nombre: 'Publicar en hosting', descripcion: 'Despliegue en la nube o servidor' },
      { id: 5, nombre: 'Pruebas de ingreso', descripcion: 'Validación de flujo completo y casos borde' },
    ];
  }
}

/**
 * Buscar un estudiante por carnet con soporte dual (endpoint dedicado + fallback a /dashboard)
 */
export async function fetchStudentByCarnet(carnet) {
  const baseUrl = getBaseApiUrl();
  const cleanCarnet = (carnet || '').trim();

  // 1. Intentar endpoint dedicado /api/estudiantes/:carnet
  try {
    const response = await fetch(`${baseUrl}/estudiantes/${encodeURIComponent(cleanCarnet)}`);
    if (response.ok) {
      const json = await response.json();
      const payload = json.data || json;
      if (payload && payload.estudiante) {
        return payload;
      }
    }
  } catch (err) {
    // Si falla la red del endpoint dedicado, continúa al fallback
  }

  // 2. Fallback inteligente: Buscar en /api/dashboard (funciona tanto en local como en servidor UMG)
  try {
    const dashResponse = await fetch(`${baseUrl}/dashboard`);
    if (dashResponse.ok) {
      const dashData = await dashResponse.json();
      const estudiantes = dashData.estudiantes || [];
      const detalles = dashData.detalles || [];

      const foundEst = estudiantes.find((e) => {
        const c = (e.Carnet || e.carnet || '').trim().toLowerCase();
        return c === cleanCarnet.toLowerCase();
      });

      if (foundEst) {
        const studentMissions = detalles.filter((d) => {
          const c = (d.Carnet || d.carnet || '').trim().toLowerCase();
          return c === cleanCarnet.toLowerCase();
        });

        return {
          estudiante: {
            carnet: foundEst.Carnet || foundEst.carnet,
            nombre: foundEst.Nombre || foundEst.nombre,
            correo: foundEst.Correo || foundEst.correo,
          },
          misiones: studentMissions.map((m) => ({
            MisionID: m.MisionID || m.misionId || m.idMision,
            MisionNombre: m.MisionNombre || m.nombre,
            Estado: m.Estado === 1 || m.Estado === true || m.estado === true,
          })),
        };
      }
    }
  } catch (err) {
    // Error al consultar dashboard
  }

  throw new Error(`Estudiante con carnet '${cleanCarnet}' no encontrado en la base de datos.`);
}
