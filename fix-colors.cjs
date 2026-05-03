const fs = require('fs');
const path = require('path');
const culori = require('culori');

const dir = path.join(process.cwd(), 'html screens');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

function replaceOklch(text) {
  // Match oklch(L C H) or oklch(L C H / A)
  // Also match oklch(L% C H)
  const regex = /oklch\(\s*([0-9.%]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.%]+))?\s*\)/g;
  
  return text.replace(regex, (match, l, c, h, a) => {
    try {
      let lVal = l.endsWith('%') ? parseFloat(l) / 100 : parseFloat(l);
      let cVal = parseFloat(c);
      let hVal = parseFloat(h);
      let aVal = a ? (a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a)) : 1;
      
      const color = { mode: 'oklch', l: lVal, c: cVal, h: hVal, alpha: aVal };
      if (aVal === 1) {
        return culori.formatHex(color);
      } else {
        return culori.formatRgb(color); // rgba(...) string
      }
    } catch(e) {
      return match;
    }
  });
}

for (const file of files) {
  const filePath = path.join(dir, file);
  let html = fs.readFileSync(filePath, 'utf-8');
  
  html = replaceOklch(html);
  
  fs.writeFileSync(filePath, html);
  console.log('Fixed colors in', file);
}
