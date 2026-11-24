# Comparison

CYORE's focus: multi-language string extraction as a VS Code extension
and CLI, written in Rust.

## vs `strings(1)`

| Feature | `strings` | CYORE |
| --- | --- | --- |
| Languages | generic | Python, Go, C, C++, JavaScript, Rust, TypeScript |
| Interface | CLI only | VS Code extension + CLI |
| Backend language | C | Rust |
| Offsets in output | with flags | default (`<offset>\t<string>`) |

## vs ripgrep (`rg`)

| Feature | ripgrep | CYORE |
| --- | --- | --- |
| Purpose | grep patterns in text | extract printable strings |
| Languages | text patterns | multi-language |
| VS Code extension | ❌ | ✅ |
