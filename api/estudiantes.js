const app = require('../src/app');

module.exports = (req, res) => {
  // Asegurar que Express enrute a /estudiantes
  if (!req.url.startsWith('/api') && !req.url.startsWith('/estudiantes')) {
    req.url = '/estudiantes' + (req.url === '/' ? '' : req.url);
  }
  return app(req, res);
};
