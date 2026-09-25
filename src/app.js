const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes/studentMission.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ruta base informativa / health check
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    mensaje: 'API Maestro-Detalle — Registro y Progreso de Retos Estudiantiles',
    endpoints: {
      postMasterDetail: 'POST /api/estudiantes (o /api/estudiantes/misiones)',
      getDashboard: 'GET /api/dashboard',
      getCatalogo: 'GET /api/misiones',
      getEstudiante: 'GET /api/estudiantes/:carnet',
    },
  });
});

// Rutas de la API (compatible con entorno local /api y serverless de Vercel)
app.use('/api', routes);
app.use('/', routes);

// Middleware centralizado de errores
app.use(errorHandler);

module.exports = app;
