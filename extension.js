// CYORE — a VS Code extension written in Rust — the extension is converted to Rust.
// The extension logic (string extraction) lives in src/main.rs; this wrapper
// spawns the Rust binary (built with cargo) and talks to it over stdio.
'use strict';

const cp = require('child_process');
const path = require('path');
const vscode = require('vscode');

let proc = null;
let channel = null;

function log(message) {
  if (!channel) {
    channel = vscode.window.createOutputChannel('CYORE');
  }
  channel.appendLine(message);
}

function send(cmd) {
  if (proc && proc.stdin && !proc.killed) {
    proc.stdin.write(cmd + '\n');
  }
}

function ensureBackend() {
  if (proc) return;
  const bin = path.join(__dirname, 'target', 'debug', 'cyore');
  try {
    proc = cp.spawn(bin, { cwd: __dirname });
  } catch (err) {
    vscode.window.showErrorMessage('Failed to start Rust backend: ' + err.message);
    return;
  }
  let buf = '';
  proc.stdout.on('data', (chunk) => {
    buf += chunk.toString();
    let idx;
    while ((idx = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line) continue;
      const tab = line.indexOf('\t');
      const head = tab >= 0 ? line.slice(0, tab) : line;
      const tail = tab >= 0 ? line.slice(tab + 1) : '';
      if (head === 'done') {
        log('CYORE: ' + tail + ' string(s) found');
      } else if (head === 'error') {
        log('CYORE error: ' + tail);
      } else if (head !== 'pong' && head !== 'ok') {
        log(head + '  ' + tail);
      }
    }
  });
  proc.stderr.on('data', (chunk) => log(chunk.toString()));
  proc.on('error', (err) => log('Rust backend error: ' + err.message));
  send('ping');
}

async function extractStrings() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('CYORE: Open a file first');
    return;
  }
  const doc = editor.document;
  if (doc.uri.scheme !== 'file') {
    vscode.window.showInformationMessage('CYORE: Only file: URIs are supported');
    return;
  }
  const filePath = doc.uri.fsPath;
  const minLen = vscode.workspace.getConfiguration().get('cyore.minStringLength', 4);
  log('CYORE: extracting strings from ' + filePath + ' (min length: ' + minLen + ')');
  if (!proc || proc.killed) {
    vscode.window.showErrorMessage('CYORE: Rust backend is not running');
    return;
  }
  send('min ' + minLen);
  send('extract ' + filePath);
}

function activate(context) {
  ensureBackend();
  context.subscriptions.push(
    vscode.commands.registerCommand('cyore.extractStrings', extractStrings)
  );
}

exports.activate = activate;
