const app = require('../src/app');

module.exports = (req, res) => {
  // Asegurar que Express enrute a /dashboard
  if (!req.url.startsWith('/api') && !req.url.startsWith('/dashboard')) {
    req.url = '/dashboard' + (req.url === '/' ? '' : req.url);
  }
  return app(req, res);
};
