// example.ts — CYORE string extraction demo (TypeScript)
interface Point {
  x: number;
  y: number;
}

interface Config {
  name: string;
  version: string;
}

function greet(name: string): string {
  return `Hello, ${name}!`;
}

export const message = "hello world";

export function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function makePoint(x: number, y: number): Point {
  return { x, y };
}

export function describe(c: Config): string {
  return `${c.name} v${c.version}`;
}
