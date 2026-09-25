const { getPool, ensureDatabaseExists } = require('../config/database');
const { initializeDatabase } = require('./initDb');

const DASHBOARD_URL = 'http://52.171.58.51:8080/api/dashboard';

async function importFromRemoteDashboard() {
  console.log('[IMPORT] Inicializando tablas locales...');
  await initializeDatabase();

  console.log(`[IMPORT] Descargando datos desde ${DASHBOARD_URL}...`);
  const response = await fetch(DASHBOARD_URL);
  if (!response.ok) {
    throw new Error(`Fallo al descargar datos: HTTP ${response.status}`);
  }

  const data = await response.json();
  const estudiantes = data.estudiantes || [];
  const detalles = data.detalles || [];

  console.log(`[IMPORT] Se encontraron ${estudiantes.length} estudiantes y ${detalles.length} registros de detalle.`);

  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Insertar o actualizar estudiantes
    for (const est of estudiantes) {
      await conn.query(
        `INSERT INTO estudiantes (carnet, nombre, correo)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), correo = VALUES(correo);`,
        [est.Carnet, est.Nombre, est.Correo]
      );
    }

    // 2. Insertar o actualizar detalles de misiones
    for (const det of detalles) {
      const estadoBool = det.Estado === 1 || det.Estado === true;
      await conn.query(
        `INSERT INTO estudiante_misiones (carnet_estudiante, id_mision, estado)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE estado = VALUES(estado);`,
        [det.Carnet, det.MisionID, estadoBool]
      );
    }

    await conn.commit();
    console.log('[IMPORT] ¡Importación completada con éxito en tu base de datos local!');
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

if (require.main === module) {
  importFromRemoteDashboard()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[IMPORT ERROR]:', err.message);
      process.exit(1);
    });
}

module.exports = { importFromRemoteDashboard };
