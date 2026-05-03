const fs = require('fs');
const path = require('path');
const culori = require('culori');

const filePath = path.join(process.cwd(), 'html screens', 'application form.html');
let html = fs.readFileSync(filePath, 'utf-8');

// 1. Inline CSS (we will read temp-out.css which should be generated)
const cssContent = fs.readFileSync(path.join(process.cwd(), 'temp-out.css'), 'utf-8');
html = html.replace(/<link rel="stylesheet" href="\.\/styles\.css">/g, '');
html = html.replace(/<script src="https:\/\/unpkg\.com\/@tailwindcss\/browser@4"><\/script>/g, '');
html = html.replace(/<style type="text\/tailwindcss">[\s\S]*?<\/style>/g, '');

const styleBlock = `<style>\n${cssContent}\n</style>`;
if (html.includes('</head>')) {
  html = html.replace('</head>', `${styleBlock}\n</head>`);
} else {
  html = html.replace('<body>', `<head>\n${styleBlock}\n</head>\n<body>`);
}

// 2. Fix colors (oklch to hex/rgb)
const colorRegex = /(oklch\([^)]+\))/g;
html = html.replace(colorRegex, (match) => {
  const parsed = culori.parse(match);
  if (parsed) {
    if (parsed.alpha !== undefined && parsed.alpha < 1) {
      const rgb = culori.converter('rgb')(parsed);
      return `rgba(${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)}, ${parsed.alpha})`;
    }
    return culori.formatHex(parsed);
  }
  return match;
});

// 3. Fix nav (fixed to relative)
html = html.replace(/<nav class="fixed/g, '<nav class="relative');

fs.writeFileSync(filePath, html);
console.log('Fixed application form.html');
