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
 * Buscar un estudiante por carnet
 */
export async function fetchStudentByCarnet(carnet) {
  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}/estudiantes/${encodeURIComponent(carnet)}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Estudiante no encontrado');
  }

  return data.data || data;
}
