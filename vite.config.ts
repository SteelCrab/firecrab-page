import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsBuildDir = fileURLToPath(new URL('./docs-site/build/', import.meta.url));
const docsPrefixes = ['/docs', '/blog', '/en/docs', '/en/blog', '/assets', '/img', '/en/assets', '/en/img'];
const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

function docsDevPlugin(): Plugin {
  return {
    name: 'serve-built-docs',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = decodeURIComponent((request.url ?? '/').split('?')[0]);
        if (!docsPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
          next();
          return;
        }

        const relativePath = normalize(pathname).replace(/^[/\\]+/, '');
        let filePath = join(docsBuildDir, relativePath);
        if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
        if (!existsSync(filePath) && !extname(filePath)) filePath = join(filePath, 'index.html');

        if (!filePath.startsWith(docsBuildDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
          response.statusCode = 404;
          response.end('Not found');
          return;
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', contentTypes[extname(filePath)] ?? 'application/octet-stream');
        response.end(readFileSync(filePath));
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = decodeURIComponent((request.url ?? '/').split('?')[0]);
        if (!docsPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
          next();
          return;
        }

        const relativePath = normalize(pathname).replace(/^[/\\]+/, '');
        let filePath = join(docsBuildDir, relativePath);
        if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
        if (!existsSync(filePath) && !extname(filePath)) filePath = join(filePath, 'index.html');

        if (!filePath.startsWith(docsBuildDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
          response.statusCode = 404;
          response.end('Not found');
          return;
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', contentTypes[extname(filePath)] ?? 'application/octet-stream');
        response.end(readFileSync(filePath));
      });
    },
  };
}

export default defineConfig({
  plugins: [docsDevPlugin(), react()],
  build: {
    // Docusaurus(docs-site)가 같은 dist에 /assets/ 를 쓰므로 경로를 분리한다.
    assetsDir: 'app-assets',
  },
});
