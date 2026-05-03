import fs from 'fs';
import path from 'path';
import http from 'http';

const OUT_DIR = path.join(process.cwd(), 'html screens');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;

const routes = [
  { name: 'splash screen', path: '/' },
  { name: 'login', path: '/login' },
  { name: 'forgot password', path: '/forgot-password' },
  { name: 'register', path: '/signup' },
  { name: 'job seeker home', path: '/home' },
  { name: 'find jobs', path: '/jobs' },
  { name: 'my applications', path: '/applications' },
  { name: 'my profile', path: '/profile' },
  { name: 'job details', path: '/jobs/1' },
  { name: 'application form', path: '/jobs/1/apply' },
  { name: 'success application', path: '/application-success' },
  { name: 'admin dashboard', path: '/admin' },
  { name: 'post job', path: '/admin/jobs/new' },
  { name: 'admin applications', path: '/admin/applications' },
  { name: 'admin profile', path: '/admin/profile' }
];

const styles = fs.readFileSync(path.join(process.cwd(), 'src', 'styles.css'), 'utf-8');
const processedStyles = styles.replace('@import "tailwindcss" source(none);', '').replace('@source "../src";', '').replace('@import "tw-animate-css";', '');

const tailwindCDN = `<script src="https://unpkg.com/@tailwindcss/browser@4"></script>`;
const fontCDN = `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">`;

async function fetchRoute(route) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${route.path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  for (const route of routes) {
    console.log(`Fetching ${route.name}...`);
    try {
      let html = await fetchRoute(route);
      
      // Clean up development scripts from Vite / Tanstack Router
      html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      html = html.replace(/<link rel="stylesheet".*?>/gi, '');
      html = html.replace(/<!--\/?\$-->/g, ''); // React suspense boundaries
      
      // Add standard html shell stuff if missing, but it should be there from SSR
      const headEnd = html.indexOf('</head>');
      if (headEnd !== -1) {
        const inject = `
${fontCDN}
${tailwindCDN}
<style type="text/tailwindcss">
${processedStyles}
</style>
`;
        html = html.slice(0, headEnd) + inject + html.slice(headEnd);
      } else {
         // fallback
         html = `<!DOCTYPE html><html><head>${fontCDN}${tailwindCDN}<style type="text/tailwindcss">${processedStyles}</style></head><body>${html}</body></html>`;
      }
      
      fs.writeFileSync(path.join(OUT_DIR, `${route.name}.html`), html);
      console.log(`Saved ${route.name}.html`);
    } catch (e) {
      console.error(`Failed on ${route.name}: ${e.message}`);
    }
  }
}

run();
