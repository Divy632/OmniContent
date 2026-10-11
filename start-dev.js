const { spawn } = require('child_process');
const path = require('path');

console.log('================================================================');
console.log('🚀 Starting AI-Powered Universal Content Creation Platform (MERN)');
console.log('================================================================');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 1. Launch Backend Server
const serverDir = path.join(__dirname, 'server');
const serverProc = spawn(npmCmd, ['start'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true
});

// 2. Launch Frontend Client
const clientDir = path.join(__dirname, 'client');
const clientProc = spawn(npmCmd, ['run', 'dev'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\n🛑 Shutting down server and client processes...');
  if (serverProc) serverProc.kill();
  if (clientProc) clientProc.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
