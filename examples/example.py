# example.py — CYORE string extraction demo (Python)
from typing import Dict, List, Tuple


def greeting(name: str) -> str:
    return f"Hello, {name}!"


def add(a: int, b: int) -> int:
    return a + b


class Counter:
    def __init__(self, start: int = 0):
        self._value = start
        self._history: List[int] = []

    @property
    def value(self) -> int:
        return self._value

    def increment(self) -> int:
        self._value += 1
        self._history.append(self._value)
        return self._value

    def history(self) -> List[int]:
        return list(self._history)


def stats(numbers: List[int]) -> Tuple[int, float]:
    if not numbers:
        return 0, 0.0
    total = sum(numbers)
    return len(numbers), total / len(numbers)


MESSAGES = [
    "hello world",
    "second message",
    "third message",
    "fourth message with more words",
    "fifth message",
]

CONFIG: Dict[str, str] = {
    "language": "python",
    "description": "CYORE example",
    "version": "1.0",
}


def main() -> None:
    print(greeting("CYORE"))
    print(add(1, 2))
    counter = Counter()
    counter.increment()
    counter.increment()
    print(counter.value)
    print(counter.history())
    print(stats([1, 2, 3, 4, 5]))
    print(MESSAGES)
