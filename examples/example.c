/* example.c — CYORE string extraction demo (C) */
#include <stdio.h>
#include <string.h>

static char message[64] = "Hello, world!";

int add(int a, int b) {
    return a + b;
}

int main(void) {
    printf("%s\n", message);
    printf("sum: %d\n", add(1, 2));
    return 0;
}
