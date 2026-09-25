const { sql, getPool } = require('../config/database');
const studentRepository = require('../repositories/student.repository');
const missionRepository = require('../repositories/mission.repository');
const studentMissionRepository = require('../repositories/studentMission.repository');
const dashboardRepository = require('../repositories/dashboard.repository');

class StudentMissionService {
  /**
   * Procesa el JSON Maestro-Detalle dentro de una transacción ACID en SQL Server
   */
  async processMasterDetail(payload) {
    const { estudiante, misiones } = payload;
    const requestedIds = [...new Set(misiones.map((m) => m.idMision))];

    // 1. VALIDACIÓN DE CATÁLOGO: Verificar que los IDs existan en la tabla Misiones
    const existingIds = await missionRepository.findExistingIds(requestedIds);
    const missingIds = requestedIds.filter((id) => !existingIds.includes(id));

    if (missingIds.length > 0) {
      const error = new Error('Error de referencia: Uno o más IDs de misión no existen en el catálogo oficial de SQL Server.');
      error.statusCode = 422; // Unprocessable Entity / Error de referencia
      error.details = {
        mensaje: 'Los siguientes IDs de misión no son válidos',
        misionesNoValidas: missingIds,
      };
      throw error;
    }

    // 2. TRANSACCIÓN ATÓMICA EN SQL SERVER
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // 2.1 Upsert Maestro (Estudiantes)
      const studentResult = await studentRepository.upsert(estudiante, transaction);

      // 2.2 Upsert Detalle (EstudianteMisiones)
      const detailResults = [];
      for (const m of misiones) {
        const detailResult = await studentMissionRepository.upsert(
          estudiante.carnet,
          m.idMision,
          m.estado,
          transaction
        );
        detailResults.push(detailResult);
      }

      await transaction.commit();

      return {
        estudiante: {
          carnet: estudiante.carnet,
          nombre: estudiante.nombre,
          correo: estudiante.correo,
          operacion: studentResult.operacion,
        },
        misionesActualizadas: detailResults.length,
        detalles: detailResults,
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /**
   * Obtiene todos los datos para el Dashboard desde SQL Server
   */
  async getDashboardData() {
    return await dashboardRepository.getDashboardData();
  }

  /**
   * Obtiene el catálogo completo de misiones activas
   */
  async getCatalogue() {
    return await missionRepository.findAll();
  }

  /**
   * Obtiene la información y misiones de un estudiante específico
   */
  async getStudentByCarnet(carnet) {
    const estudiante = await studentRepository.findByCarnet(carnet);
    if (!estudiante) {
      const error = new Error(`Estudiante con carnet '${carnet}' no encontrado`);
      error.statusCode = 404;
      throw error;
    }

    const misiones = await studentMissionRepository.findByStudent(carnet);
    return {
      estudiante,
      misiones,
    };
  }
}

module.exports = new StudentMissionService();
