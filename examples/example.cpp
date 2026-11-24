// example.cpp — CYORE string extraction demo (C++)
#include <iostream>
#include <string>
#include <vector>

struct Record {
    std::string name;
    int value;
};

std::string greet(const std::string& name) {
    return "Hello, " + name + "!";
}

int main() {
    std::string message = greet("CYORE");
    std::vector<std::string> parts = {"hello", "world", "test"};
    std::cout << message << "\n";
    for (const auto& part : parts) {
        std::cout << part << "\n";
    }

    std::vector<Record> records = {
        {"first", 1},
        {"second", 2},
        {"third", 3},
    };
    int sum = 0;
    for (const auto& r : records) {
        sum += r.value;
    }
    std::cout << "sum: " << sum << "\n";
    return 0;
}
