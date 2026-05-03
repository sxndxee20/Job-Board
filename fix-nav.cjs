const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'html screens');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let html = fs.readFileSync(filePath, 'utf-8');
  
  // Replace fixed positioning with standard flow so Figma plugins won't ignore it
  if (html.includes('fixed bottom-3 left-0 right-0')) {
    html = html.replace(
      /class="fixed bottom-3 left-0 right-0 z-40 px-3"/g, 
      'class="relative w-full mt-12 mb-8 z-40 px-3"'
    );
    
    // Also remove the pb-24 padding from the main wrapper that was leaving space for the fixed nav
    html = html.replace(/pb-24/g, 'pb-8');
    
    fs.writeFileSync(filePath, html);
    console.log('Fixed nav positioning for Figma in', file);
  }
}
