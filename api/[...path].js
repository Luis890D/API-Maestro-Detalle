const app = require('../src/app');

module.exports = (req, res) => {
  // Si Vercel pasa los segmentos en req.query.path, reconstruir la ruta para Express
  if (req.query && req.query.path) {
    const segments = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    req.url = '/' + segments;
  }
  return app(req, res);
};
