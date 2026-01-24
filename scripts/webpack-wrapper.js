#!/usr/bin/env node

// Wrapper script to run webpack-cli with --openssl-legacy-provider on Node 17+
// This is needed because webpack 4 requires the legacy provider on newer Node versions
// but NODE_OPTIONS=--openssl-legacy-provider is disallowed in Node 16+

const { spawn } = require('child_process');
const path = require('path');

const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

// Only use --openssl-legacy-provider on Node 17+
const useLegacyProvider = majorVersion >= 17;

const webpackCliPath = path.join(__dirname, '..', 'node_modules', '.bin', 'webpack-cli');
const args = process.argv.slice(2);

if (useLegacyProvider) {
  // Use node with --openssl-legacy-provider flag
  const nodeArgs = ['--openssl-legacy-provider', webpackCliPath, ...args];
  const child = spawn('node', nodeArgs, {
    stdio: 'inherit',
    shell: false
  });
  
  child.on('exit', (code) => {
    process.exit(code || 0);
  });
} else {
  // Node 16 and below - run webpack-cli directly
  const child = spawn(webpackCliPath, args, {
    stdio: 'inherit',
    shell: false
  });
  
  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}
