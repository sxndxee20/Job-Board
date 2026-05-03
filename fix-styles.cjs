const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'html screens');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let html = fs.readFileSync(filePath, 'utf-8');
  
  html = html.replace(/<script src="https:\/\/unpkg\.com\/@tailwindcss\/browser@4"><\/script>\n?/g, '');
  html = html.replace(/<style type="text\/tailwindcss">[\s\S]*?<\/style>/, '<link rel="stylesheet" href="./styles.css">');
  
  fs.writeFileSync(filePath, html);
  console.log('Fixed', file);
}
