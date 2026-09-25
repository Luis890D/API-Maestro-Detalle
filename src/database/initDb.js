const { getPool, ensureDatabaseExists } = require('../config/database');

const CATALOGO_MISIONES = [
  { id: 1, nombre: 'Crear API', descripcion: 'Desarrollar la API REST maestro-detalle' },
  { id: 2, nombre: 'Crear Frontend', descripcion: 'Interfaz web para visualización y registro' },
  { id: 3, nombre: 'Subir código a GitHub', descripcion: 'Control de versiones y repositorio público' },
  { id: 4, nombre: 'Publicar en hosting', descripcion: 'Despliegue en la nube o servidor' },
  { id: 5, nombre: 'Pruebas de ingreso', descripcion: 'Validación de flujo completo y casos borde' },
];

async function initializeDatabase() {
  console.log('[DB] Verificando existencia de la base de datos...');
  await ensureDatabaseExists();

  const pool = getPool();

  console.log('[DB] Creando tablas si no existen...');

  // 1. Tabla Maestro: Estudiantes
  await pool.query(`
    CREATE TABLE IF NOT EXISTS estudiantes (
      carnet VARCHAR(50) NOT NULL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      correo VARCHAR(150) NOT NULL,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Tabla Catálogo: Misiones
  await pool.query(`
    CREATE TABLE IF NOT EXISTS misiones_catalogo (
      id INT NOT NULL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      descripcion VARCHAR(255) NULL,
      activa BOOLEAN DEFAULT TRUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 3. Tabla Detalle: Estudiante - Misiones
  await pool.query(`
    CREATE TABLE IF NOT EXISTS estudiante_misiones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      carnet_estudiante VARCHAR(50) NOT NULL,
      id_mision INT NOT NULL,
      estado BOOLEAN NOT NULL DEFAULT FALSE,
      fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_em_estudiante FOREIGN KEY (carnet_estudiante) 
        REFERENCES estudiantes(carnet) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_em_mision FOREIGN KEY (id_mision) 
        REFERENCES misiones_catalogo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT uk_estudiante_mision UNIQUE (carnet_estudiante, id_mision)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 4. Seed del Catálogo Oficial de 5 Misiones
  for (const mision of CATALOGO_MISIONES) {
    await pool.query(
      `INSERT INTO misiones_catalogo (id, nombre, descripcion, activa)
       VALUES (?, ?, ?, TRUE)
       ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), descripcion = VALUES(descripcion);`,
      [mision.id, mision.nombre, mision.descripcion]
    );
  }

  console.log('[DB] Tablas y catálogo de 5 misiones inicializados correctamente.');
}

if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('[DB] Proceso de inicialización finalizado.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[DB ERROR] Error al inicializar base de datos:', err);
      process.exit(1);
    });
}

module.exports = {
  initializeDatabase,
  CATALOGO_MISIONES,
};
