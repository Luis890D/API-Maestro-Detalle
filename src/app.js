const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const routes = require('./routes/studentMission.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas de la API (siempre tienen prioridad)
app.use('/api', routes);

// Servir frontend compilado de React (Vite) en producción o despliegue en Vercel
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    next();
  });
} else {
  // Ruta base informativa si no hay build del frontend
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
}

// Middleware centralizado de errores
app.use(errorHandler);

module.exports = app;
