#!/usr/bin/env node
/**
 * scripts/ref.js
 * Universal Developer Reference & Tooling Dispatcher
 * Manages bridges, ledgers, duplication checks, and knowledge graphs
 * without exposing .reference paths in package.json.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const REF_DIR = path.join(PROJECT_ROOT, '.reference');
const rawArgs = process.argv.slice(2);

function printHelp() {
  console.log(`
Universal Developer Reference & Tooling Runner
Usage:
  npm run ref -- [command | flag] [options]
  node scripts/ref.js [command | flag] [options]

Available Commands & Flags:
  --bridges, bridges [opts]    Sync workspace OS bridges (--status, --clean, --rebuild)
  --backup, backup             Create isolated git snapshot of reference ledger
  --history, history           Show git commit history of reference ledger
  --status, status             Check git status of reference ledger
  --verify, verify             Verify integrity and secret-scanning on reference ledger
  --restore, restore [hash]    Restore reference ledger to a target commit hash
  --dup, dup                   Run jscpd code duplication analysis (ratchet check)
  --graphify, graphify         Sync codebase AST knowledge graph
  --help, -h                   Display this help message
`);
}

function normalizeCommand(arg) {
  if (!arg) return 'help';
  if (arg === '--help' || arg === '-h') return 'help';
  return arg.replace(/^--/, '').toLowerCase();
}

const mainCommand = normalizeCommand(rawArgs[0]);
const subArgs = rawArgs.slice(1);

function runCommand(bin, cmdArgs, cwd = PROJECT_ROOT) {
  const isWindows = process.platform === 'win32';
  const isNode = bin === process.execPath;
  const useShell = isWindows && !isNode && bin === 'npx';

  const result = spawnSync(bin, cmdArgs, {
    cwd,
    stdio: 'inherit',
    env: process.env,
    shell: useShell
  });
  process.exit(result.status ?? 0);
}

function ensureReferenceDir() {
  if (!fs.existsSync(REF_DIR)) {
    console.log('[ref] .reference directory is not present in this workspace.');
    console.log('[ref] Reference tooling is optional or managed externally via "portal" CLI.');
    process.exit(0);
  }
}

switch (mainCommand) {
  case 'help': {
    printHelp();
    process.exit(0);
    break;
  }

  case 'bridges': {
    ensureReferenceDir();
    const bridgeRunner = path.join(REF_DIR, 'system', 'scripts', 'sync-bridges.js');
    if (!fs.existsSync(bridgeRunner)) {
      console.error(`[ref] Bridge runner not found at: ${bridgeRunner}`);
      process.exit(1);
    }
    const normalizedArgs = subArgs.map(arg => {
      const lower = arg.toLowerCase().replace(/^--/, '');
      if (lower === 'status') return '--status';
      if (lower === 'clean') return '--clean';
      if (lower === 'rebuild') return '--rebuild';
      return arg;
    });
    runCommand(process.execPath, [bridgeRunner, ...normalizedArgs]);
    break;
  }

  case 'backup':
  case 'history':
  case 'status':
  case 'verify':
  case 'restore': {
    ensureReferenceDir();
    const backupRunner = path.join(REF_DIR, 'system', 'scripts', 'ref-backup.js');
    if (!fs.existsSync(backupRunner)) {
      console.error(`[ref] Backup engine not found at: ${backupRunner}`);
      process.exit(1);
    }
    runCommand(process.execPath, [backupRunner, mainCommand, ...subArgs]);
    break;
  }

  case 'dup':
  case 'dup-check':
  case 'dup:check': {
    const rawOutputDir = fs.existsSync(REF_DIR)
      ? path.join(REF_DIR, 'system', 'jscpd')
      : path.join(PROJECT_ROOT, '.jscpd');

    const outputDir = path.relative(PROJECT_ROOT, rawOutputDir).replace(/\\/g, '/');

    const jscpdArgs = [
      '-y',
      'jscpd',
      'src',
      '--min-lines', '15',
      '--min-tokens', '50',
      '--threshold', '5',
      '--reporters', 'console,json',
      '--output', outputDir,
      ...subArgs
    ];
    runCommand('npx', jscpdArgs);
    break;
  }

  case 'graphify':
  case 'graphify-sync':
  case 'graphify:sync': {
    if (process.platform === 'win32') {
      const psScript = path.join(REF_DIR, 'system', 'scripts', '2026-09-21_System_Sync-Graphify_v1.0.ps1');
      if (fs.existsSync(psScript)) {
        runCommand('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', psScript]);
      } else {
        runCommand('python', ['-m', 'graphifyy']);
      }
    } else {
      runCommand('python', ['-m', 'graphifyy']);
    }
    break;
  }

  default: {
    console.error(`[ref] Unknown command or flag: "${rawArgs[0]}". Run "npm run ref -- --help" for available commands.`);
    process.exit(1);
  }
}
