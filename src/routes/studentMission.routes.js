const { Router } = require('express');
const studentMissionController = require('../controllers/studentMission.controller');

const router = Router();

// Endpoint Principal: Procesar JSON Maestro-Detalle en un solo POST
router.post('/estudiantes', (req, res, next) => studentMissionController.handlePost(req, res, next));
router.post('/estudiantes/misiones', (req, res, next) => studentMissionController.handlePost(req, res, next));
router.post('/reto', (req, res, next) => studentMissionController.handlePost(req, res, next));

// Endpoint del Dashboard (Estructura idéntica al servidor de referencia)
router.get('/dashboard', (req, res, next) => studentMissionController.getDashboard(req, res, next));
router.post('/dashboard', (req, res, next) => studentMissionController.handlePost(req, res, next));

// Catálogo oficial de misiones
router.get('/misiones', (req, res, next) => studentMissionController.getCatalogue(req, res, next));

// Consulta individual de un estudiante por su carnet
router.get('/estudiantes/:carnet', (req, res, next) => studentMissionController.getStudent(req, res, next));

module.exports = router;
