import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  plugins: [
    {
      name: 'copy-google-verification',
      closeBundle() {
        try {
          const srcPath = path.resolve(process.cwd(), 'google1f6ae9ba765b7679.html');
          const destDir = path.resolve(process.cwd(), 'dist');
          const destPath = path.join(destDir, 'google1f6ae9ba765b7679.html');
          
          if (fs.existsSync(srcPath)) {
            if (!fs.existsSync(destDir)) {
              fs.mkdirSync(destDir, { recursive: true });
            }
            fs.copyFileSync(srcPath, destPath);
            console.info('Successfully copied Google verification file to build output: dist/google1f6ae9ba765b7679.html');
          }
        } catch (err) {
          console.error('Failed to copy google verification file in closeBundle plugin hook:', err);
        }
      }
    }
  ]
});
