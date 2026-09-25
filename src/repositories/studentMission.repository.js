const { sql, getPool } = require('../config/database');

class StudentMissionRepository {
  /**
   * Inserta o actualiza una misión para un estudiante (Upsert en EstudianteMisiones)
   */
  async upsert(carnet, misionId, estado, transaction = null) {
    const pool = await getPool();
    const request = transaction ? new sql.Request(transaction) : pool.request();
    const estadoBit = Boolean(estado) ? 1 : 0;

    request.input('carnet', sql.VarChar(50), carnet);
    request.input('misionId', sql.Int, misionId);
    request.input('estado', sql.Bit, estadoBit);

    await request.query(`
      MERGE EstudianteMisiones WITH (HOLDLOCK) AS target
      USING (SELECT @carnet AS Carnet, @misionId AS MisionID, @estado AS Estado) AS source
      ON (target.Carnet = source.Carnet AND target.MisionID = source.MisionID)
      WHEN MATCHED THEN
          UPDATE SET Estado = source.Estado, FechaRegistro = GETDATE()
      WHEN NOT MATCHED THEN
          INSERT (Carnet, MisionID, Estado, FechaRegistro) 
          VALUES (source.Carnet, source.MisionID, source.Estado, GETDATE());
    `);

    return {
      carnet_estudiante: carnet,
      id_mision: misionId,
      estado: Boolean(estadoBit),
    };
  }

  /**
   * Obtiene las misiones de un estudiante con el nombre de la misión
   */
  async findByStudent(carnet, transaction = null) {
    const pool = await getPool();
    const request = transaction ? new sql.Request(transaction) : pool.request();

    request.input('carnet', sql.VarChar(50), carnet);
    const result = await request.query(`
      SELECT 
        em.Carnet,
        em.MisionID,
        m.Nombre AS MisionNombre,
        CAST(em.Estado AS INT) AS Estado,
        em.FechaRegistro
      FROM EstudianteMisiones em
      INNER JOIN Misiones m ON em.MisionID = m.MisionID
      WHERE em.Carnet = @carnet
      ORDER BY em.MisionID ASC;
    `);

    return result.recordset;
  }
}

module.exports = new StudentMissionRepository();
