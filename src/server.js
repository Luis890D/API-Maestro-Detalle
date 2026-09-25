const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { getPool, dbConfig } = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log(`[BD] Conectando a SQL Server en ${dbConfig.server}...`);
    await getPool();
    console.log(`[BD] ¡Conexión exitosa a la base de datos SQL Server '${dbConfig.database}'!`);
  } catch (err) {
    console.error('========================================================================');
    console.error('[ERROR DE CONEXIÓN A SQL SERVER]:');
    console.error(err.message);
    console.error('Verifica las credenciales en tu archivo .env (DB_SERVER, DB_USER, etc.)');
    console.error('========================================================================');
  }

  app.listen(PORT, () => {
    console.log(`[SERVIDOR] API ejecutándose exitosamente en http://localhost:${PORT}`);
    console.log(`[SERVIDOR] Endpoint POST Maestro-Detalle: http://localhost:${PORT}/api/estudiantes`);
    console.log(`[SERVIDOR] Endpoint GET Dashboard: http://localhost:${PORT}/api/dashboard`);
    console.log(`[SERVIDOR] Endpoint GET Catálogo: http://localhost:${PORT}/api/misiones`);
  });
}

startServer();
