import { existsSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';

function run(args) {
  const result = spawnSync('npm', args, { cwd: process.cwd(), stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (!existsSync('docs-site/node_modules/.bin/docusaurus')) {
  run(['--prefix', 'docs-site', 'ci']);
}

run(['--prefix', 'docs-site', 'run', 'clear']);
run(['--prefix', 'docs-site', 'run', 'build']);

const landing = spawn('npm', ['run', 'dev:landing'], {
  cwd: process.cwd(),
  stdio: 'inherit',
});

process.on('SIGINT', () => landing.kill('SIGINT'));
process.on('SIGTERM', () => landing.kill('SIGTERM'));
landing.on('exit', (code) => { process.exitCode = code ?? 0; });
