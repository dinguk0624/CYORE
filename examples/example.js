// example.js — CYORE string extraction demo (JavaScript)
function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

const messages = ["hello world", "second message", "third message"];

if (typeof module !== "undefined") {
  module.exports = { greet, add };
}
