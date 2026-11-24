// example.cpp — CYORE string extraction demo (C++)
#include <iostream>
#include <string>
#include <vector>

std::string greet(const std::string& name) {
    return "Hello, " + name + "!";
}

int main() {
    std::string message = greet("CYORE");
    std::vector<std::string> parts = {"hello", "world", "test"};
    for (const auto& part : parts) {
        std::cout << part << "\n";
    }
    std::cout << message << std::endl;
    return 0;
}
