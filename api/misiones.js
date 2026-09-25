const app = require('../src/app');

module.exports = (req, res) => {
  // Asegurar que Express enrute a /misiones
  if (!req.url.startsWith('/api') && !req.url.startsWith('/misiones')) {
    req.url = '/misiones' + (req.url === '/' ? '' : req.url);
  }
  return app(req, res);
};
