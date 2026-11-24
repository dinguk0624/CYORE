# Get Started

Kurulum ve kurulum sonrası adımlar — Windows, Mac, Linux.

## 1. Kurulum

### Windows

- [rustup installer](https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe)'i indirip çalıştırın (Rust toolchain).
- Terminal'de: `cargo build`

### Mac

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Linux

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Genel (tüm platformlar)

1. `cargo build` — extension, Rust backend'ini `target/debug/cyore` dosyasından başlatır.
2. VS Code'da `F5` (Extension Development Host) basarak extension'u test edin.

## 2. Provider Bağlama (AI)

`settings.json` içine yapıştırılabilir ayarlar:

```json
{
  "cyore.aiProvider": "claude",
  "cyore.aiApiKey": "your-api-key"
}
```

- `cyore.aiProvider` — `claude`, `qwen` veya `openai`.
- `cyore.aiApiKey` — seçilen provider için API key.
- Varsayılan modeller: Claude için `claude-3-5-sonnet-20241022`, Qwen için `qwen-turbo`, OpenAI için `gpt-4o-mini`.

## 3. Tutorials

### A. String Çıkarma — `CYORE: Extract Strings` (`cyore.extractStrings`)

1. Bir dosya açın.
2. Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) üzerinden `CYORE: Extract Strings` komutunu çalıştırın.
3. Sonuçlar `View -> Output -> CYORE` üzerinde görünür — her satır offset ile bir string: `<offset>\t<string>`.

### B. AI ile Dosyayı Rust'a Dönüştürme — `CYORE: Convert File to Rust with AI` (`cyore.convertToRustAI`)

1. Ayarlarda `cyore.aiProvider` ve `cyore.aiApiKey`'i yapılandırın.
2. Aktif dosyada `CYORE: Convert File to Rust with AI` komutunu çalıştırın.
3. Üretilen Rust kodu `CYORE` output channel'ında görünür; `cargo check` / `cargo build` ile doğrulayın.

Detaylar: [README — Usage](README.md#usage), [INSTALL.md](INSTALL.md), [Troubleshooting](README.md#troubleshooting).

## 4. CLI (PowerShell, CMD, terminal)

Uzantının özellikleri doğrudan shell'den de kullanılabilir — `cargo build` sonrası:

```sh
# Linux/Mac
./target/debug/cyore extract <file>
# Windows
.\target\debug/cyore.exe extract <file>
```
