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

/// Extracts quoted strings: scans for the given quote characters, and for
/// each opening quote finds the closing quote (handling `\` escapes).
fn extract_quoted(data: &[u8], quotes: &[u8], min_len: usize) -> Vec<(usize, String)> {
    let mut found = Vec::new();
    let mut i = 0usize;
    while i < data.len() {
        let b = data[i];
        if quotes.contains(&b) {
            let start = i;
            let q = b;
            let mut j = i + 1;
            let mut closed = false;
            while j < data.len() {
                if data[j] == b'\\' {
                    j += 2;
                    continue;
                }
                if data[j] == q {
                    closed = true;
                    break;
                }
                j += 1;
            }
            if closed && j > i + 1 && j - i - 1 >= min_len {
                found.push((start, String::from_utf8_lossy(&data[i + 1..j]).to_string()));
            }
            i = j + 1;
            continue;
        }
        i += 1;
    }
    found
}

/// Detects a language from a file extension (best effort).
fn detect_lang(path: &str) -> &'static str {
    let ext = path
        .rsplit('.')
        .next()
        .unwrap_or("")
        .to_ascii_lowercase();
    match ext.as_str() {
        "py" => "python",
        "go" => "go",
        "c" => "c",
        "cpp" | "cc" | "cxx" => "cpp",
        "js" | "mjs" | "cjs" => "javascript",
        _ => "generic",
    }
}

/// Language-aware extraction entry point.
fn extract_strings_lang(data: &[u8], lang: &str, min_len: usize) -> Vec<(usize, String)> {
    match lang {
        "python" => extract_quoted(data, &[b'"', b'\''], min_len),
        "go" => extract_quoted(data, &[b'"', b'`'], min_len),
        "javascript" => extract_quoted(data, &[b'"', b'`'], min_len),
        "c" | "cpp" => extract_quoted(data, &[b'"', b'\''], min_len),
        _ => extract_strings(data, min_len),
    }
}

fn main() {
    let stdin = io::stdin();
    let stdout = io::stdout();
    let mut out = stdout.lock();

    let mut min_len: usize = 4;

    for line in stdin.lock().lines() {
        let line = match line {
            Ok(l) => l,
            Err(_) => break,
        };
        let line = line.trim();
        if line == "ping" {
            let _ = writeln!(out, "pong");
        } else if let Some(n) = line.strip_prefix("min ") {
            if let Ok(v) = n.trim().parse::<usize>() {
                min_len = v;
                let _ = writeln!(out, "ok");
            }
        } else if line.starts_with("extract ") {
            let path = line["extract ".len()..].to_string();
            match fs::read(&path) {
                Ok(data) => {
                    let strings = extract_strings_lang(&data, detect_lang(&path), min_len);
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

#[cfg(test)]
mod tests {
    use super::{detect_lang, extract_quoted, extract_strings, extract_strings_lang};

    #[test]
    fn extracts_strings_with_offsets() {
        let data = b"hello world, this is a test\nsecond line with more text\nshort\n";
        assert_eq!(
            extract_strings(data, 4),
            vec![
                (0usize, "hello world, this is a test".to_string()),
                (28usize, "second line with more text".to_string()),
                (55usize, "short".to_string()),
            ]
        );
    }

    #[test]
    fn respects_min_len() {
        let data = b"ab\ncd\nefgh\n";
        assert_eq!(extract_strings(data, 4), vec![(6usize, "efgh".to_string())]);
        assert_eq!(
            extract_strings(data, 2),
            vec![
                (0usize, "ab".to_string()),
                (3usize, "cd".to_string()),
                (6usize, "efgh".to_string()),
            ]
        );
    }

    #[test]
    fn detects_languages() {
        assert_eq!(detect_lang("/a/b/c.py"), "python");
        assert_eq!(detect_lang("/a/b/c.go"), "go");
        assert_eq!(detect_lang("/a/b/c.c"), "c");
        assert_eq!(detect_lang("/a/b/c.cpp"), "cpp");
        assert_eq!(detect_lang("/a/b/c.js"), "javascript");
        assert_eq!(detect_lang("/a/b/c.rs"), "generic");
        assert_eq!(detect_lang("/a/b/noext"), "generic");
    }

    #[test]
    fn extracts_quoted_strings() {
        let data = b"print('hello world')\n";
        assert_eq!(
            extract_quoted(data, &[b'\''], 4),
            vec![(6usize, "hello world".to_string())]
        );
        // Go/JS-style backtick strings and escapes in double quotes.
        let go = b"x := `hello go`\n";
        assert_eq!(extract_quoted(go, &[b'"', b'`'], 3), vec![(5usize, "hello go".to_string())]);
    }

    #[test]
    fn language_extraction_dispatch() {
        let data = b"print('abcdef')\n";
        assert_eq!(
            extract_strings_lang(data, "python", 4),
            vec![(6usize, "abcdef".to_string())]
        );
    }
}
