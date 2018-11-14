import {PlayerShield} from "./PlayerShield";

export class Player {
    readonly INITIAL_HEALTH = 5;

    private health: number = this.INITIAL_HEALTH;
    private shield: PlayerShield;

    constructor() {
        this.shield = new PlayerShield();
    }

    // 3 2 1 0
    shieldHealth(): number {
        return this.shield.health1();
    }

    hitBubble() {
        this.shield.recharge();
    }

    hitEnemy() {
        if (this.shield.isActive) {
            this.shield.hit();
        } else {
            this.health--;
        }

        if (!this.health) {
            // game over
        }
    }
}