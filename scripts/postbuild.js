const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../frontend/dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Crear entrypoints para que el detector de Express de Vercel siempre los encuentre en frontend/dist
const entryContent = `const app = require('../../src/app');
module.exports = app;
`;

fs.writeFileSync(path.join(distDir, 'app.js'), entryContent);
fs.writeFileSync(path.join(distDir, 'index.js'), entryContent);
fs.writeFileSync(path.join(distDir, 'server.js'), entryContent);

console.log('[POSTBUILD] Entrypoints app.js, index.js y server.js creados exitosamente en frontend/dist para Vercel.');
