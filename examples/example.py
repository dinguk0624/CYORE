# example.py — CYORE string extraction demo (Python)
from typing import List


def greeting(name: str) -> str:
    return f"Hello, {name}!"


def add(a: int, b: int) -> int:
    return a + b


class Counter:
    def __init__(self, start: int = 0):
        self._value = start

    @property
    def value(self) -> int:
        return self._value

    def increment(self) -> int:
        self._value += 1
        return self._value


def main() -> None:
    print(greeting("CYORE"))
    print(add(1, 2))
    counter = Counter()
    counter.increment()
    counter.increment()
    print(counter.value)


MESSAGES = ["hello world", "second message", "third message"]

if __name__ == "__main__":
    main()
