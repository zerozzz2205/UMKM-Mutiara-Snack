import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  plugins: [
    Sitemap({
      hostname: 'https://umkm-mutiara-snack.vercel.app',
      readable: false,
      routes: [
        '/',
        '/register',
        '/dashboard'
      ],
      dynamicRoutes: [
        '/register',
        '/dashboard'
      ],
      exclude: [
        '/google1f6ae9ba765b7679',
        '/google1f6ae9ba765b7679.html'
      ],
      generateRobotsTxt: true
    }),
    {
      name: 'copy-google-verification',
      writeBundle() {
        cleanSitemapAndCopyVerification();
      },
      closeBundle() {
        cleanSitemapAndCopyVerification();
      }
    }
  ]
});

function cleanSitemapAndCopyVerification() {
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

    // Post-process the generated sitemap.xml to clean spacing and remove verification HTML routes
    const sitemapPath = path.join(destDir, 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      let sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');

      // 1. Remove <url> blocks that contain "google" or "google1f6ae9ba765b7679"
      const urlBlockRegex = /<url>[\s\S]*?<\/url>/g;
      sitemapContent = sitemapContent.replace(urlBlockRegex, (match) => {
        if (match.includes('google')) {
          return '';
        }
        return match;
      });

      // 2. Clean spaces and newlines inside all <loc>...</loc> tags perfectly using trim
      sitemapContent = sitemapContent.replace(/<loc>([\s\S]*?)<\/loc>/g, (match, urlLoc) => {
        return `<loc>${urlLoc.trim()}</loc>`;
      });

      // 3. Remove consecutive blank lines resulting from url exclusions
      sitemapContent = sitemapContent.replace(/^\s*[\r\n]/gm, '');

      fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
      console.info('Successfully formatted and sanitized sitemap.xml.');
    }
  } catch (err) {
    console.error('Failed post-processing sitemap.xml or copying verification HTML:', err);
  }
}

