# CYORE — Reverse Engineering in Rust

A VS Code extension written in Rust — extensions are converted to Rust, the
way reverse engineer converts software into readable evidence (see
[rea-rs](https://github.com/bhubbard/rea-rs)).

## Features

- **CYORE: Extract Strings** (`cyore.extractStrings`) — extracts printable
  strings (length ≥ 4) from the active file — the classic
  reverse-engineering move — and shows them in the **CYORE** output channel,
  prefixed by their offset.

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
- `extract <path>` → one line per string: `<offset>\t<string>`, then `done\t<count>`
- `<anything else>` → ignored

## Build

```sh
cargo build
```

The wrapper spawns `target/debug/cyore`.

## Publishing

1. Set `publisher` in `package.json` to your marketplace publisher ID.
2. Push the repo to GitHub and publish with `vsce` — like your other
   extensions, but this one is written in Rust.
