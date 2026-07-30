import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Docusaurus(docs-site)가 같은 dist에 /assets/ 를 쓰므로 경로를 분리한다.
    assetsDir: 'app-assets',
  },
});
