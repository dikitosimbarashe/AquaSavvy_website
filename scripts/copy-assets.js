const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy index.html
const indexHtmlSrc = path.join(__dirname, '..', 'index.html');
const indexHtmlDest = path.join(distDir, 'index.html');
fs.copyFileSync(indexHtmlSrc, indexHtmlDest);

// Copy server.js
const serverJsSrc = path.join(__dirname, '..', 'server.js');
const serverJsDest = path.join(distDir, 'server.js');
fs.copyFileSync(serverJsSrc, serverJsDest);

// Copy public folder
const publicSrc = path.join(__dirname, '..', 'public');
const publicDest = path.join(distDir, 'public');
copyDirSync(publicSrc, publicDest);

console.log('Assets copied successfully!');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
