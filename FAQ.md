# FAQ

## Which languages are supported?

Python, Go, C, C++, JavaScript, Rust, TypeScript — with generic string
extraction for other files.

## Why is the extension written in Rust?

The extension logic (string extraction, language detection) lives in Rust —
`src/main.rs` — and the TS wrapper (`extension.js`) just spawns the binary.

## How do I use the CLI?

```sh
./target/debug/cyore extract <file>
./target/debug/cyore ping
./target/debug/cyore version
```

## Where do the extracted strings appear?

In the **CYORE** output channel (`View → Output → CYORE`), one line per
string: `<offset>  <string>`.

## Is the extension safe to install?

Yes — see [Security](SECURITY.md): extraction runs locally, no data leaves
the machine by default.
