const fs = require('fs');
const path = require('path');
const http = require('http');

const OUT_DIR = path.join(process.cwd(), 'html screens');

const routes = [
  { name: 'application form', path: '/jobs/1/apply' },
];

const styles = fs.readFileSync(path.join(process.cwd(), 'src', 'styles.css'), 'utf-8');
const processedStyles = styles.replace('@import "tailwindcss" source(none);', '').replace('@source "../src";', '').replace('@import "tw-animate-css";', '');

const tailwindCDN = '<script src="https://unpkg.com/@tailwindcss/browser@4"></script>';
const fontCDN = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">';

async function fetchRoute(route) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:8080' + route.path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  for (const route of routes) {
    let html = await fetchRoute(route);
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    html = html.replace(/<link rel="stylesheet".*?>/gi, '');
    html = html.replace(/<!--\/?\$-->/g, '');
    const headEnd = html.indexOf('</head>');
    if (headEnd !== -1) {
      const inject = fontCDN + '\n' + tailwindCDN + '\n<style type="text/tailwindcss">\n' + processedStyles + '\n</style>';
      html = html.slice(0, headEnd) + inject + html.slice(headEnd);
    }
    fs.writeFileSync(path.join(OUT_DIR, route.name + '.html'), html);
    console.log('Saved ' + route.name + '.html');
  }
}

run();
