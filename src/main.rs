// CYORE — the Rust backend of a VS Code extension "written in Rust".
// The wrapper (extension.js) spawns this binary and talks to it over
// stdin/stdout.
use std::fs;
use std::io::{self, BufRead, Write};

fn is_printable(b: u8) -> bool {
    (0x20..0x7f).contains(&b)
}

fn push_if_long(
    data: &[u8],
    start: usize,
    len: usize,
    min_len: usize,
    found: &mut Vec<(usize, String)>,
) {
    if len >= min_len {
        let s = String::from_utf8_lossy(&data[start..start + len]).to_string();
        found.push((start, s));
    }
}

fn extract_strings(data: &[u8], min_len: usize) -> Vec<(usize, String)> {
    let mut found = Vec::new();
    let mut start = 0usize;
    let mut len = 0usize;
    let mut in_str = false;

    for (i, &b) in data.iter().enumerate() {
        if is_printable(b) {
            if !in_str {
                start = i;
                in_str = true;
            }
            len += 1;
        } else if in_str {
            push_if_long(data, start, len, min_len, &mut found);
            in_str = false;
            len = 0;
        }
    }
    if in_str {
        push_if_long(data, start, len, min_len, &mut found);
    }
    found
}

fn main() {
    let stdin = io::stdin();
    let stdout = io::stdout();
    let mut out = stdout.lock();

    for line in stdin.lock().lines() {
        let line = match line {
            Ok(l) => l,
            Err(_) => break,
        };
        let line = line.trim();
        if line == "ping" {
            let _ = writeln!(out, "pong");
        } else if line.starts_with("extract ") {
            let path = line["extract ".len()..].to_string();
            match fs::read(&path) {
                Ok(data) => {
                    let strings = extract_strings(&data, 4);
                    let count = strings.len();
                    for (offset, s) in &strings {
                        let _ = writeln!(out, "{}\t{}", offset, s);
                    }
                    let _ = writeln!(out, "done\t{}", count);
                }
                Err(e) => {
                    let _ = writeln!(out, "error\t{}", e);
                }
            }
        }
        let _ = out.flush();
    }
}
