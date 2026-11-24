# Get Started

Installation and post-install steps — Windows, PowerShell, Anaconda, Miniconda, Linux terminal, macOS terminal.

## 1. Installation

### Windows

- Download and run the [rustup installer](https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe) (Rust toolchain).
- In the terminal: `cargo build`

### PowerShell (Windows)

```powershell
# If no Rust is installed — install Rust
# (or `winget install Rustlang.Rustup`).
# Then:
cargo build
```

### Anaconda

```sh
conda install -c conda-forge rust
```

Or create a new environment: `conda create -n cyore -c conda-forge rust` → `conda activate cyore` → `cargo build`.

### Miniconda

```sh
conda install -c conda-forge rust
```

Then `cargo build`.

### Linux terminal

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo build
```

### macOS terminal

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo build
```

### General (all platforms)

1. `cargo build` — the extension spawns the Rust backend from `target/debug/cyore`.
2. In VS Code, press `F5` (Extension Development Host) to test the extension.

## 2. Provider Connection (AI)

Settings for `settings.json`:

```json
{
  "cyore.aiProvider": "claude",
  "cyore.aiApiKey": "your-api-key"
}
```

- `cyore.aiProvider` — `claude`, `qwen` or `openai`.
- `cyore.aiApiKey` — the API key for the selected provider.
- Default models: Claude — `claude-3-5-sonnet-20241022`, Qwen — `qwen-turbo`, OpenAI — `gpt-4o-mini`.

## 3. Tutorials

### A. String Extraction — `CYORE: Extract Strings` (`cyore.extractStrings`)

1. Open a file in the editor.
2. Run the `CYORE: Extract Strings` command via the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
3. The results appear in `View -> Output -> CYORE` — one line per string with its offset: `<offset>\t<string>`.

### B. Convert File to Rust with AI — `CYORE: Convert File to Rust with AI` (`cyore.convertToRustAI`)

1. Configure `cyore.aiProvider` and `cyore.aiApiKey` in settings.
2. Run the `CYORE: Convert File to Rust with AI` command on the active file.
3. The generated Rust code appears in the `CYORE` output channel; verify with `cargo check` / `cargo build`.

Details: [README — Usage](README.md#usage), [INSTALL.md](INSTALL.md), [Troubleshooting](README.md#troubleshooting).

## 4. CLI (PowerShell, CMD, terminal)

The extension's features are also available from the shell — after `cargo build`:

```sh
# Linux/Mac
./target/debug/cyore extract <file>
# Windows
.\target\debug\cyore.exe extract <file>
```
