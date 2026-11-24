# CYORE — VS Code Extension in Rust

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue?logo=visual-studio-code)](https://code.visualstudio.com/)
[![Written in Rust](https://img.shields.io/badge/Written-in-Rust-orange?logo=rust)](https://www.rust-lang.org/)
[![GitHub](https://img.shields.io/badge/Repo-181717?logo=github)](https://github.com/dinguk0624/CYORE)

A VS Code extension written in Rust — the extension's logic is Rust (`src/main.rs`).
Installation steps: [INSTALL.md](INSTALL.md).

## Quick Start

```sh
cargo install --git https://github.com/dinguk0624/CYORE
```

or open the repo: [dinguk0624/CYORE](https://github.com/dinguk0624/CYORE)

## Table of contents

- [Features](#features)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
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

### Quick Start (Prerequisites)

1. Run `cargo build` — the extension spawns the Rust backend from `target/debug/cyore`.
2. In VS Code, press `F5` (Extension Development Host) to test the extension.

### A. Extract Strings (`cyore.extractStrings`)

1. Open a file in the editor.
2. Run the command via the Command Palette (`Ctrl+Shift+P` on Windows/Linux, `Cmd+Shift+P` on macOS).
3. The results appear in `View -> Output -> CYORE` — each line is a string with its offset:

```
<offset>\t<string>
done\t<count>
```

4. Adjust the minimum string length with `cyore.minStringLength` (default: 4).

### B. Convert File to Rust with AI (`cyore.convertToRustAI`)

1. Open a file in the editor.
2. Run the command via the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
3. Configure `cyore.aiProvider` (Claude, Qwen, OpenAI) and `cyore.aiApiKey`; the generated Rust code appears in the `CYORE` output channel.
4. Verify the generated code with `cargo check` or `cargo build`.

### C. CLI — terminal, PowerShell, CMD

The extension also has a CLI. After `cargo build`, run the binary directly:

```sh
# Linux/macOS
./target/debug/cyore extract <file>
```

```powershell
.\target\debug\cyore.exe extract <file>
```

Other commands: `cyore ping` (health check), `cyore version`.

### Command Search Tips

In the Command Palette, quick access:

- `extract` — `CYORE: Extract Strings` (`cyore.extractStrings`)
- `strings` — same command
- `rust` — `CYORE: Convert File to Rust with AI` (`cyore.convertToRustAI`)
- `ai` — same command

### Backend / Stdio Test (no VS Code)

Test the Rust backend directly with stdin:

```sh
echo "ping" | target/debug/cyore
echo "extract <file-path>" | target/debug/cyore
```

Expected output: `pong`; for `extract` — `<offset>\t<string>` lines followed by `done\t<count>`.

### Scope Clarity

Both **Extract Strings** and **Convert File to Rust with AI** operate on the **active file** only — nothing is modified or saved by the extension.

### Copy-Paste Settings

Settings for `settings.json`:

```json
{
  "cyore.minStringLength": 4,
  "cyore.aiProvider": "claude",
  "cyore.aiApiKey": "<your-api-key>"
}
```

### Visual Demo Area

<!-- ![CYORE Demo](assets/demo.gif) -->

## Troubleshooting

- `CYORE: Rust backend is not running` — run `cargo build` first, then reload the window (`Developer: Reload Window`).
- No strings found — the file has no printable strings longer than `cyore.minStringLength`.
- `CYORE: AI conversion failed` / `Set cyore.aiApiKey in settings` — check `cyore.aiProvider` and `cyore.aiApiKey`.
- Verify AI output — run `cargo check` or `cargo build` after applying the generated code.

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
