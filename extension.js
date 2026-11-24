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

async function aiConvert(provider, apiKey, filePath, code) {
  const prompt =
    'Convert the following file to Rust. Return only the Rust code, in a code block.\n\nFile: ' +
    filePath + '\n\n' +
    code;
  let url, headers, body;
  if (provider === 'claude') {
    url = 'https://api.anthropic.com/v1/messages';
    headers = {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    };
    body = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    };
  } else {
    const model = provider === 'qwen' ? 'qwen-turbo' : 'gpt-4o-mini';
    url = provider === 'qwen'
      ? 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    headers = {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    };
    body = {
      model,
      messages: [{ role: 'user', content: prompt }]
    };
  }
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data.error && data.error.message) || ('HTTP ' + res.status);
    throw new Error(msg);
  }
  if (provider === 'claude') {
    const blocks = data.content || [];
    return blocks.map((b) => b.text || '').join('\n');
  }
  const choices = data.choices || [];
  return choices.map((c) => (c.message && c.message.content) || '').join('\n');
}

async function convertToRustAI() {
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
  const config = vscode.workspace.getConfiguration('cyore');
  const provider = config.get('aiProvider', 'claude');
  const apiKey = config.get('aiApiKey', '');
  if (!apiKey) {
    vscode.window.showErrorMessage('CYORE: Set cyore.aiApiKey in settings');
    return;
  }
  let code;
  try {
    code = Buffer.from(await vscode.workspace.fs.readFile(doc.uri)).toString('utf8');
  } catch (err) {
    vscode.window.showErrorMessage('CYORE: Failed to read file: ' + err.message);
    return;
  }
  log('CYORE: converting file to Rust with ' + provider + ' ...');
  try {
    const result = await aiConvert(provider, apiKey, doc.uri.fsPath, code);
    log('--- AI converted (' + provider + ') ---\n' + result);
    vscode.window.showInformationMessage('CYORE: AI conversion done — see the CYORE output channel.');
  } catch (err) {
    vscode.window.showErrorMessage('CYORE: AI conversion failed: ' + err.message);
  }
}

function activate(context) {
  ensureBackend();
  context.subscriptions.push(
    vscode.commands.registerCommand('cyore.extractStrings', extractStrings),
    vscode.commands.registerCommand('cyore.convertToRustAI', convertToRustAI)
  );
}

exports.activate = activate;
