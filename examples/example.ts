// example.ts — CYORE example (string extraction demo)
interface Greeter {
  name: string;
}

function greet(g: Greeter): string {
  return `Hello, ${g.name}!`;
}

export const message = "hello world";
