# CYORE — Installation

**Windows, Mac ve Linux** kurulum adımları.

## Gereksinimler

- **VS Code 1.80+** (desktop)
- **Rust toolchain** (`cargo`) — extension'un backend'i Rust'ta
- **Node.js + vsce** (paketleme için: `npm install -g @vscode/vsce`)

## Adımlar

1. **VS Code açın.**
2. **Extension'u derleyin:**
   ```sh
   cargo build
   ```
3. **`.vsix` paketini oluşturun:**
   ```sh
   vsce package
   ```
   → `cyore-0.0.1.vsix` dosyası oluşur.
4. **VS Code'da yükleyin:** Extensions → **Install from VSIX** → `cyore-0.0.1.vsix` seçin.
5. **Kullanın:** Bir dosya açın → komut paletinde **CYORE: Extract Strings** (`cyore.extractStrings`) çalıştırın → Output Channel → **CYORE**.

## Platform Specifics

### Windows

- Rust kurulumu için [rustup installer](https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe) — indirip çalıştırın.
- PowerShell/CMD komutları (`cargo build`, `vsce package`) çalışır.

### Mac

- Rust kurulumu için:
  ```sh
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
- `cargo build` ve `vsce package` komutları var.

### Linux

- Rust kurulumu için:
  ```sh
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
- `cargo build` ve `vsce package` komutları var.

## From Source

```sh
git clone https://github.com/dinguk0624/CYORE.git
cd CYORE
cargo build
vsce package
```
