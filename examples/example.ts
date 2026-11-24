// example.ts — CYORE string extraction demo (TypeScript)
interface Point {
  x: number;
  y: number;
}

function greet(name: string): string {
  return `Hello, ${name}!`;
}

export const message = "hello world";

export function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
