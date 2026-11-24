# CYORE — VS Code Extension in Rust

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue?logo=visual-studio-code)](https://code.visualstudio.com/)
[![Written in Rust](https://img.shields.io/badge/Written-in-Rust-orange?logo=rust)](https://www.rust-lang.org/)
[![GitHub](https://img.shields.io/badge/Repo-181717?logo=github)](https://github.com/dinguk0624/CYORE)

A VS Code extension written in Rust — the extension is converted to Rust.

## Why CYORE?

- **Written in Rust** — the extension logic lives in `src/main.rs` (Rust);
  `extension.js` just spawns the Rust binary.
- **Local, fast, no network** — extraction runs on your machine — nothing is
  uploaded anywhere.
- **Zero-dependency** — the Rust backend uses only the standard library.

## Table of contents

- [Features](#features)
- [Usage](#usage)
- [Architecture](#architecture)
- [Build](#build)
- [Security](#security)
- [Publishing](#publishing)

## Features

- **CYORE: Extract Strings** (`cyore.extractStrings`) — extracts printable
  strings (length ≥ 4) from the active file and shows them in the **CYORE**
  output channel, prefixed by their offset.

## Usage

1. Open a file in the editor.
2. Run the command **CYORE: Extract Strings** (`cyore.extractStrings`).
3. The extracted strings appear in the **CYORE** output channel
   (`View → Output → CYORE`) — one line per string, `<offset>  <string>`.

## Architecture

The extension is a Rust program; the TS wrapper spawns it:

```
CYORE/
├── package.json       # extension manifest
├── extension.js       # wrapper: spawns the Rust backend
├── src/main.rs        # the extension logic (string extraction, in Rust)
├── Cargo.toml         # cargo manifest
├── README.md
├── .gitignore
└── LICENSE
```

Protocol between `extension.js` and `src/main.rs` (stdio):

- `ping` → `pong`
- `min <n>` → `ok` — minimum string length for extraction (default: `4`; configurable via the `cyore.minStringLength` setting)
- `extract <path>` → one line per string: `<offset>\t<string>`, then `done\t<count>`
- `<anything else>` → ignored

## Build

```sh
cargo build
```

The wrapper spawns `target/debug/cyore`.

## Security

- The extension spawns the Rust binary `target/debug/cyore` (built with
  `cargo build`). If the binary is missing, the extension logs an error in
  the **CYORE** output channel and does nothing else.
- Extraction runs locally on the path of the active document — no network
  requests are made, no data leaves the machine, no files are modified.
- To verify what the extension does, review `src/main.rs` (the extension
  logic) and `extension.js` (the wrapper).
- If you find a security issue, please open an issue on the
  [repository](https://github.com/dinguk0624/CYORE/issues) or use the
  [security advisories](https://github.com/dinguk0624/CYORE/security/advisories/new).

## Publishing

1. Set `publisher` in `package.json` to your marketplace publisher ID.
2. Push the repo to GitHub and publish with `vsce` — like your other
   extensions, but this one is written in Rust.
