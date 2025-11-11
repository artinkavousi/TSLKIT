#!/usr/bin/env node

/**
 * Simple HTTP server for testing TSL-Kit in the browser
 * Properly handles parent directory access for dist/ files
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.map': 'application/json',
};

const server = http.createServer((req, res) => {
  // Remove query string
  let url = req.url.split('?')[0];
  
  // Decode URL to handle encoded characters
  url = decodeURIComponent(url);
  
  // Default to index.html for root
  if (url === '/') {
    url = '/index.html';
  }
  
  // Map /dist/ requests to parent directory's dist/
  let filePath;
  if (url.startsWith('/dist/')) {
    // Serve from parent directory's dist folder
    filePath = path.join(__dirname, '..', url);
  } else {
    // Serve from test-browser directory
    filePath = path.join(__dirname, url);
  }
  
  // Normalize the path to resolve .. and ensure it's safe
  filePath = path.normalize(filePath);
  
  // Security check: ensure path is within allowed directories
  const testBrowserDir = path.normalize(__dirname);
  const tslKitDir = path.normalize(path.join(__dirname, '..'));
  const normalizedPath = path.normalize(filePath);
  
  // Allow access to test-browser and parent tsl-kit directory (including dist/)
  const isAllowed = normalizedPath.startsWith(testBrowserDir) || 
                    normalizedPath.startsWith(tslKitDir);
  
  if (!isAllowed) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access denied');
    return;
  }
  
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'text/plain';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`File not found: ${url}`);
        console.log(`404: ${url} -> ${filePath}`);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error: ' + error.code);
        console.error(`Error serving ${url}:`, error);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cache-Control': 'no-cache',
      });
      res.end(content, 'utf-8');
      console.log(`✓ ${url}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ Test server running at http://localhost:${PORT}/`);
  console.log(`📊 Open the browser to run the test suite`);
  console.log(`📁 Serving: test-browser/ and ../dist/`);
  console.log(`Press Ctrl+C to stop\n`);
});

