const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER || 'UsuarioEncuestas',
  password: process.env.DB_PASSWORD || 'DesaWeb2025$!',
  server: process.env.DB_SERVER || 'svr-sql-ctezo.southcentralus.cloudapp.azure.com',
  database: process.env.DB_NAME || 'db_WebDevUMG',
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

/**
 * Obtiene o reconecta el pool de SQL Server de forma segura en entornos Serverless (como Vercel)
 */
async function getPool() {
  try {
    if (pool && pool.connected) {
      return pool;
    }
    if (pool) {
      await pool.close().catch(() => {});
    }
    pool = await sql.connect(dbConfig);
    return pool;
  } catch (err) {
    pool = null;
    throw err;
  }
}

module.exports = {
  sql,
  dbConfig,
  getPool,
};
