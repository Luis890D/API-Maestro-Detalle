const { sql, getPool } = require('../config/database');

class MissionRepository {
  /**
   * Obtiene todas las misiones del catálogo oficial en SQL Server
   */
  async findAll(transaction = null) {
    const pool = await getPool();
    const request = transaction ? new sql.Request(transaction) : pool.request();
    const result = await request.query(`
      SELECT MisionID AS id, Nombre AS nombre, Descripcion AS descripcion 
      FROM Misiones 
      ORDER BY MisionID ASC;
    `);
    return result.recordset;
  }

  /**
   * Valida cuáles de los IDs dados existen en la tabla Misiones
   * @param {number[]} ids
   */
  async findExistingIds(ids, transaction = null) {
    if (!ids || ids.length === 0) return [];

    const pool = await getPool();
    const request = transaction ? new sql.Request(transaction) : pool.request();

    // Crear parámetros parametrizados para la consulta IN (@id0, @id1, ...)
    const paramNames = ids.map((id, index) => {
      const name = `id_${index}`;
      request.input(name, sql.Int, id);
      return `@${name}`;
    });

    const result = await request.query(`
      SELECT MisionID AS id 
      FROM Misiones 
      WHERE MisionID IN (${paramNames.join(', ')});
    `);

    return result.recordset.map((r) => r.id);
  }
}

module.exports = new MissionRepository();
