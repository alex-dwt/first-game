export class PlayerShield {
    readonly INITIAL_HEALTH = 3;

    private health: number = 0;

    constructor() {
    }

    get isActive(): boolean {
        return this.health > 0;
    }

    get health(): number {
        return this.health;
    }

    hit() {
        if (this.isActive) {
            this.health--;
        }
    }

    recharge() {
        this.health = this.INITIAL_HEALTH;
    }
}