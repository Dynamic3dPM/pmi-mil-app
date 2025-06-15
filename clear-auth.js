#!/usr/bin/env node

/**
 * Development helper script to clear authentication state
 * Run with: node clear-auth.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🧹 Clearing authentication state...');

// Clear any potential localStorage files (if using node-localstorage)
const localStoragePaths = [
  path.join(process.cwd(), 'localStorage'),
  path.join(os.homedir(), '.aws-amplify'),
  path.join(os.homedir(), '.amplify'),
];

localStoragePaths.forEach(dirPath => {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Cleared: ${dirPath}`);
    }
  } catch (error) {
    console.log(`⚠️  Could not clear ${dirPath}:`, error.message);
  }
});

// Clear node_modules/.cache if it exists
const cacheDir = path.join(process.cwd(), 'node_modules', '.cache');
try {
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log('✅ Cleared node_modules/.cache');
  }
} catch (error) {
  console.log('⚠️  Could not clear cache:', error.message);
}

console.log('✨ Authentication state cleared!');
console.log('💡 Now refresh your browser and try signing in again.');
