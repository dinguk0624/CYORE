/* example.c — CYORE string extraction demo (C) */
#include <stdio.h>
#include <string.h>

static const char *MESSAGES[] = {
    "first message",
    "second message",
    "third message",
    "fourth message"
};

static int count_messages(void) {
    return (int)(sizeof(MESSAGES) / sizeof(MESSAGES[0]));
}

static void print_all(void) {
    int n = count_messages();
    for (int i = 0; i < n; i++) {
        printf("msg[%d] = %s\n", i, MESSAGES[i]);
    }
}

static int total_length(void) {
    int total = 0;
    for (size_t i = 0; i < sizeof(MESSAGES) / sizeof(MESSAGES[0]); i++) {
        total += (int)strlen(MESSAGES[i]);
    }
    return total;
}

int main(void) {
    printf("messages: %d\n", count_messages());
    print_all();
    printf("total length: %d\n", total_length());
    return 0;
}
