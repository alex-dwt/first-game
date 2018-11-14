export class PlayerShield {
    readonly INITIAL_HEALTH = 3;

    /*private*/ health: number;

    constructor() {
        this.health = 0;
    }

    get isActive(): boolean {
        return this.health > 0;
    }

    health1(): number {
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