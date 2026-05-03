const fs = require('fs');
const path = require('path');

try {
  // Read the contents of dist/client
  const entries = fs.readdirSync('dist/client', { withFileTypes: true });
  
  // Copy everything directly into dist/
  for (const entry of entries) {
    const srcPath = path.join('dist/client', entry.name);
    const destPath = path.join('dist', entry.name);
    fs.cpSync(srcPath, destPath, { recursive: true });
  }
  
  console.log('Copied dist/client contents to dist successfully for Vercel deployment.');
} catch (err) {
  console.error('Error copying files:', err);
}
