// example.js — CYORE string extraction demo (JavaScript)
function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

const messages = [
  "first message",
  "second message",
  "third message",
  "fourth message"
];

function sum(list) {
  return list.reduce((acc, x) => acc + x, 0);
}

function filterEven(numbers) {
  return numbers.filter((n) => n % 2 === 0);
}

module.exports = { greet, add, sum, filterEven, messages };
