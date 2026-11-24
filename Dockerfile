# CYORE extension — Rust backend + VS Code wrapper.
# Build the extension: `docker build` → .vsix in the build context? See CMD.

FROM rust:1-slim AS builder

WORKDIR /app
COPY . .
RUN cargo build

FROM debian:bookworm-slim

WORKDIR /app
# Extension files (manifest, wrapper, sources)
COPY --from=builder /app/package.json /app/extension.js /app/README.md \
                    /app/Cargo.toml /app/Cargo.lock /app/LICENSE /app/icon.png \
                    /app/.gitignore /app/
COPY --from=builder /app/src /app/src
# Rust backend (the extension logic)
COPY --from=builder /app/target/debug/cyore /usr/local/bin/cyore

RUN apt-get update && \
    apt-get install -y --no-install-recommends nodejs npm ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g @vscode/vsce

CMD ["vsce", "package"]
