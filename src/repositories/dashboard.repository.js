const { getPool } = require('../config/database');

class DashboardRepository {
  /**
   * Obtiene la estructura completa del Dashboard universitario directamente desde SQL Server
   */
  async getDashboardData(transaction = null) {
    const pool = await getPool();
    const request = transaction ? new sql.Request(transaction) : pool.request();

    // 1. Resumen por estudiante
    const estudiantesResult = await request.query(`
      SELECT 
        e.Carnet, 
        e.Nombre, 
        e.Correo,
        COUNT(CASE WHEN em.Estado = 1 THEN 1 END) AS MisionesCompletadas,
        (SELECT COUNT(*) FROM Misiones) AS TotalMisiones,
        CASE 
          WHEN (SELECT COUNT(*) FROM Misiones) = 0 THEN 0
          ELSE (COUNT(CASE WHEN em.Estado = 1 THEN 1 END) * 100) / (SELECT COUNT(*) FROM Misiones)
        END AS PorcentajeAvance
      FROM Estudiantes e
      LEFT JOIN EstudianteMisiones em ON e.Carnet = em.Carnet
      GROUP BY e.Carnet, e.Nombre, e.Correo
      ORDER BY e.Carnet ASC;
    `);

    // 2. Detalle de misiones
    const detallesResult = await request.query(`
      SELECT 
        em.Carnet,
        em.MisionID,
        m.Nombre AS MisionNombre,
        CAST(em.Estado AS INT) AS Estado
      FROM EstudianteMisiones em
      INNER JOIN Misiones m ON em.MisionID = m.MisionID
      ORDER BY em.Carnet ASC, em.MisionID ASC;
    `);

    return {
      estudiantes: estudiantesResult.recordset,
      detalles: detallesResult.recordset,
    };
  }
}

module.exports = new DashboardRepository();
