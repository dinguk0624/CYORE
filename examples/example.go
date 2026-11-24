// example.go — CYORE string extraction demo (Go)
package main

import (
	"fmt"
	"strings"
)

func greet(name string) string {
	return fmt.Sprintf("Hello, %s!", name)
}

func add(a, b int) int {
	return a + b
}

func contains(list []string, item string) bool {
	for _, v := range list {
		if strings.Contains(v, item) {
			return true
		}
	}
	return false
}

func filterWords(in string) []string {
	return strings.Fields(in)
}

func main() {
	fmt.Println(greet("CYORE"))
	fmt.Println(add(1, 2))
	fmt.Println(contains([]string{"apple", "banana", "cherry"}, "ban"))
	fmt.Println(filterWords("hello world this is go"))
}
