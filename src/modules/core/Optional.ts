export class Optional<T> {
    private readonly value: T;

    constructor(value: T) {
        this.value = value;
    }

    isEmpty(): boolean {
        return !this.value;
    }

    getValue(): T {
        return this.value;
    }
}