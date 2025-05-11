// build.js - Custom build script for Vercel deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Copy the root index.html to dist
fs.copyFileSync('index.html', path.join('dist', 'index.html'));

// Build the frontend
console.log('Building frontend...');
execSync('npm run build', { stdio: 'inherit' });

// Copy API files to dist/api
console.log('Copying API files...');
if (!fs.existsSync('dist/api')) {
  fs.mkdirSync('dist/api', { recursive: true });
}

// Copy all API files
const apiFiles = fs.readdirSync('api');
apiFiles.forEach(file => {
  fs.copyFileSync(path.join('api', file), path.join('dist/api', file));
});

console.log('Build completed successfully!');
