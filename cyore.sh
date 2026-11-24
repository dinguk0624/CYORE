#!/bin/sh
# CYORE CLI - shell wrapper (run: cargo build first)
exec "$(dirname "$0")/target/debug/cyore" "$@"
