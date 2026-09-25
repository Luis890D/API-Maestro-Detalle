const { sql, getPool } = require('../config/database');

class StudentRepository {
  /**
   * Busca un estudiante por carnet en la tabla Estudiantes de SQL Server
   */
  async findByCarnet(carnet, transaction = null) {
    const pool = await getPool();
    const request = transaction ? new sql.Request(transaction) : pool.request();

    request.input('carnet', sql.VarChar(50), carnet.trim());
    const result = await request.query(`
      SELECT Carnet AS carnet, Nombre AS nombre, Correo AS correo 
      FROM Estudiantes 
      WHERE LTRIM(RTRIM(Carnet)) = LTRIM(RTRIM(@carnet));
    `);

    return result.recordset[0] || null;
  }

  /**
   * Inserta o actualiza un estudiante (Upsert con MERGE en SQL Server)
   */
  async upsert(student, transaction = null) {
    const { carnet, nombre, correo } = student;
    const existing = await this.findByCarnet(carnet, transaction);

    const pool = await getPool();
    const request = transaction ? new sql.Request(transaction) : pool.request();

    request.input('carnet', sql.VarChar(50), carnet);
    request.input('nombre', sql.NVarChar(150), nombre);
    request.input('correo', sql.NVarChar(150), correo);

    await request.query(`
      MERGE Estudiantes WITH (HOLDLOCK) AS target
      USING (SELECT @carnet AS Carnet, @nombre AS Nombre, @correo AS Correo) AS source
      ON (target.Carnet = source.Carnet)
      WHEN MATCHED THEN
          UPDATE SET Nombre = source.Nombre, Correo = source.Correo
      WHEN NOT MATCHED THEN
          INSERT (Carnet, Nombre, Correo) VALUES (source.Carnet, source.Nombre, source.Correo);
    `);

    return {
      operacion: existing ? 'ACTUALIZADO' : 'REGISTRADO',
      carnet,
      nombre,
      correo,
    };
  }

  /**
   * Obtiene todos los estudiantes
   */
  async findAll(transaction = null) {
    const pool = await getPool();
    const request = transaction ? new sql.Request(transaction) : pool.request();
    const result = await request.query(`
      SELECT Carnet AS carnet, Nombre AS nombre, Correo AS correo 
      FROM Estudiantes 
      ORDER BY Carnet ASC;
    `);
    return result.recordset;
  }
}

module.exports = new StudentRepository();
