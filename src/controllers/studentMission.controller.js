const studentMissionService = require('../services/studentMission.service');
const { validateStudentMasterDetail } = require('../validators/studentMission.validator');
const ApiResponse = require('../utils/apiResponse');

class StudentMissionController {
  /**
   * Endpoint principal: POST JSON Maestro-Detalle
   */
  async handlePost(req, res, next) {
    try {
      // 1. Validación de esquema y normalización
      const validatedPayload = validateStudentMasterDetail(req.body);

      // 2. Procesamiento de negocio (validación catálogo + transacciones upsert)
      const result = await studentMissionService.processMasterDetail(validatedPayload);

      const statusCode = result.estudiante.operacion === 'REGISTRADO' ? 201 : 200;
      const message = `Estudiante ${result.estudiante.operacion.toLowerCase()} y misiones sincronizadas con éxito.`;

      return ApiResponse.success(res, result, message, statusCode);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retorna los datos con el formato exacto del dashboard de la universidad
   */
  async getDashboard(req, res, next) {
    try {
      const data = await studentMissionService.getDashboardData();
      // Formato directo compatible con el dashboard de la universidad
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retorna el catálogo oficial de misiones
   */
  async getCatalogue(req, res, next) {
    try {
      const catalogue = await studentMissionService.getCatalogue();
      return ApiResponse.success(res, catalogue, 'Catálogo oficial de misiones');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retorna la información de un estudiante y el estado de sus misiones
   */
  async getStudent(req, res, next) {
    try {
      const { carnet } = req.params;
      const studentData = await studentMissionService.getStudentByCarnet(carnet);
      return ApiResponse.success(res, studentData, 'Datos del estudiante obtenidos correctamente');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentMissionController();
