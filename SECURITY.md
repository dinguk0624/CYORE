# Security

CYORE is a VS Code extension written in Rust. This page documents how to
report security issues and how the extension handles data.

## Reporting issues

Report security issues via:

- [GitHub Issues](https://github.com/dinguk0624/CYORE/issues)
- [Security Advisories](https://github.com/dinguk0624/CYORE/security/advisories/new)

## What the extension does

- **CYORE: Extract Strings** — reads the active file and extracts strings
  locally — no network requests are made, no files are modified.
- **CYORE: Convert File to Rust with AI** — sends the active file to the
  configured provider (Claude, Qwen or OpenAI) when enabled.

## The Rust backend

The extension spawns `target/debug/cyore` and talks to it over stdio
(`ping`, `min`, `extract`).
