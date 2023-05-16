export class Currency {
    private readonly value: number;

    constructor(value: number) {
        if (!this.isValid(value)) {
            throw new Error(`Invalid amount: ${value}, needs greater than 0`);
        }

        this.value = value;
    }

    private isValid(value: number): boolean {
        return value > 0;
    }

    getValue(): number {
        return this.value;
    }

    toString(): string {
        return this.value.toString();
    }
}