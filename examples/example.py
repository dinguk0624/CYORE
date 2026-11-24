# example.py — CYORE example (string extraction demo)
def greet(name: str) -> str:
    return f"Hello, {name}!"


class Greeter:
    def __init__(self, prefix: str = "Hi"):
        self.prefix = prefix

    def greet(self, name: str) -> str:
        return f"{self.prefix}, {name}!"


MESSAGE = "hello world"
