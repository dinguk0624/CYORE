// example.go — CYORE string extraction demo (Go)
package main

import "fmt"

func greet(name string) string {
	return fmt.Sprintf("Hello, %s!", name)
}

func add(a, b int) int {
	return a + b
}

func main() {
	fmt.Println(greet("CYORE"))
	fmt.Println(add(1, 2))
}
