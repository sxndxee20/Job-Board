const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'html screens');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const cssContent = fs.readFileSync(path.join(process.cwd(), 'temp-out.css'), 'utf-8');

for (const file of files) {
  const filePath = path.join(dir, file);
  let html = fs.readFileSync(filePath, 'utf-8');
  
  // Remove existing link tag for styles.css if present
  html = html.replace(/<link rel="stylesheet" href="\.\/styles\.css">/g, '');
  
  // Inject the style block before </head>
  const styleBlock = `<style>\n${cssContent}\n</style>`;
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${styleBlock}\n</head>`);
  } else {
    // Fallback if no </head>
    html = html.replace('<body>', `<head>\n${styleBlock}\n</head>\n<body>`);
  }
  
  fs.writeFileSync(filePath, html);
  console.log('Inlined CSS into', file);
}

// remove the standalone styles.css
const oldStylesPath = path.join(dir, 'styles.css');
if (fs.existsSync(oldStylesPath)) {
  fs.unlinkSync(oldStylesPath);
}
