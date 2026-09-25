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

let poolPromise = null;

async function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(dbConfig).catch((err) => {
      poolPromise = null;
      throw err;
    });
  }
  return poolPromise;
}

module.exports = {
  sql,
  dbConfig,
  getPool,
};
