#!/usr/bin/env node

// Wrapper script to run webpack-cli with --openssl-legacy-provider on Node 17+
// This is needed because webpack 4 requires the legacy provider on newer Node versions
// but NODE_OPTIONS=--openssl-legacy-provider is disallowed in Node 16+

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

// Only use --openssl-legacy-provider on Node 17+
const useLegacyProvider = majorVersion >= 17;

// Find webpack-cli - use the actual JS file, not the .bin wrapper
const webpackCliModule = path.join(__dirname, '..', 'node_modules', 'webpack-cli', 'bin', 'cli.js');
const webpackCliBin = path.join(__dirname, '..', 'node_modules', '.bin', 'webpack-cli');

let webpackCliPath;
// Prefer the actual JS file so we can control node flags
if (fs.existsSync(webpackCliModule)) {
  webpackCliPath = webpackCliModule;
} else if (fs.existsSync(webpackCliBin)) {
  webpackCliPath = webpackCliBin;
} else {
  console.error('Error: webpack-cli not found');
  process.exit(1);
}

const args = process.argv.slice(2);

if (useLegacyProvider) {
  // Use node with --openssl-legacy-provider flag to run webpack-cli
  const nodeArgs = ['--openssl-legacy-provider', webpackCliPath, ...args];
  const child = spawn('node', nodeArgs, {
    stdio: 'inherit',
    shell: false,
    cwd: path.join(__dirname, '..')
  });
  
  child.on('exit', (code) => {
    process.exit(code || 0);
  });
  
  child.on('error', (err) => {
    console.error('Error spawning webpack:', err);
    process.exit(1);
  });
} else {
  // Node 16 and below - run webpack-cli directly
  const child = spawn(webpackCliPath, args, {
    stdio: 'inherit',
    shell: false,
    cwd: path.join(__dirname, '..')
  });
  
  child.on('exit', (code) => {
    process.exit(code || 0);
  });
  
  child.on('error', (err) => {
    console.error('Error spawning webpack:', err);
    process.exit(1);
  });
}
