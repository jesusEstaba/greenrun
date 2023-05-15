export class Date {
    private readonly value: string;

    constructor(value: string) {
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    toString(): string {
        return this.value;
    }

    static now() {
        const SystemDate = global.Date;

        return new Date(new SystemDate().toISOString());
    }
}