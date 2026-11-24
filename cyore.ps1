#!/usr/bin/env pwsh
# CYORE CLI - PowerShell wrapper (run: cargo build first)
$name = if ($IsWindows) { "cyore.exe" } else { "cyore" }
$bin = Join-Path $PSScriptRoot "target/debug" $name
& $bin @args
