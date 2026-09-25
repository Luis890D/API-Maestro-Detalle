const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../frontend/dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Entrypoint que importa explícitamente express para satisfacer el AST scanner de Vercel Express
const entryContent = `const express = require('express');
const app = require('../../src/app');

module.exports = app;
`;

fs.writeFileSync(path.join(distDir, 'app.js'), entryContent);
fs.writeFileSync(path.join(distDir, 'index.js'), entryContent);
fs.writeFileSync(path.join(distDir, 'server.js'), entryContent);

console.log('[POSTBUILD] Entrypoints con import de express creados exitosamente en frontend/dist.');
