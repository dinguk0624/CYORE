# CYORE — VS Code Extension in Rust

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue?logo=visual-studio-code)](https://code.visualstudio.com/)
[![Written in Rust](https://img.shields.io/badge/Written-in-Rust-orange?logo=rust)](https://www.rust-lang.org/)
[![GitHub](https://img.shields.io/badge/Repo-181717?logo=github)](https://github.com/dinguk0624/CYORE)

A VS Code extension written in Rust — the extension's logic is Rust (`src/main.rs`).
Installation steps: [INSTALL.md](INSTALL.md).

## Table of contents

- [Features](#features)
- [Usage](#usage)
- [Architecture](#architecture)
- [Build](#build)
- [Security](#security)
- [Publishing](#publishing)

## Features

- **CYORE: Extract Strings** (`cyore.extractStrings`) — extracts strings from
  the active file and shows them in the **CYORE** output channel with their
  offsets.
- **Multi-language** — language-aware extraction for Python, Go, C, C++,
  JavaScript (generic otherwise).
- **AI conversion** — **CYORE: Convert File to Rust with AI**
  (`cyore.convertToRustAI`) — sends the active file to the selected AI
  provider (Claude, Qwen or OpenAI; via `cyore.aiProvider` and
  `cyore.aiApiKey`) and shows the generated Rust code.

## Usage

### Preconditions

The extension spawns the Rust backend from `target/debug/cyore` — run
`cargo build` first so the binary exists.

### CYORE: Extract Strings

1. Open a file in the editor.
2. Run **CYORE: Extract Strings** (`cyore.extractStrings`) from the Command Palette.
3. Extracted strings appear in the **CYORE** output channel (`View → Output → CYORE`) — one line per string: `<offset>  <string>`.
4. Minimum string length: `cyore.minStringLength` (default: 4).

Example output:

```
12	hello world
29	second string
```

### CYORE: Convert File to Rust with AI

1. Set `cyore.aiProvider` (Claude, Qwen, OpenAI) and `cyore.aiApiKey` in the extension settings.
2. Run **CYORE: Convert File to Rust with AI** (`cyore.convertToRustAI`) on the active file.
3. The generated Rust code appears in the **CYORE** output channel.

## Architecture

The extension is a Rust program; the wrapper spawns it:

```
CYORE/
├── package.json       # extension manifest
├── extension.js       # wrapper: spawns the Rust backend
├── src/main.rs        # the extension logic (in Rust)
├── Cargo.toml         # cargo manifest
├── README.md
├── README.tr
├── INSTALL.md
├── CHANGELOG.md
├── icon.png
├── .github/
├── .gitignore
└── LICENSE
```

Protocol between `extension.js` and `src/main.rs` (stdio):

- `ping` → `pong`
- `min <n>` → `ok` — minimum string length for extraction (default: `4`; configurable via `cyore.minStringLength`)
- `extract <path>` → one line per string: `<offset>\t<string>`, then `done\t<count>`
- `<anything else>` → ignored

## Build

```sh
cargo build
```

## Security

- The extension spawns `target/debug/cyore`; if the binary is missing, it
  logs an error in the **CYORE** output channel and does nothing else.
- Extraction runs locally — no network requests are made, no files are
  modified.
- See `src/main.rs` and `extension.js` for the implementation.
- Security issues: open an issue on the
  [repository](https://github.com/dinguk0624/CYORE/issues).

## Publishing

1. Set `publisher` in `package.json` to your marketplace publisher ID.
2. Push to GitHub and publish with `vsce`.
