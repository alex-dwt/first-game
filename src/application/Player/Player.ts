import {PlayerShield} from "./PlayerShield";

export class Player {
    readonly INITIAL_HEALTH = 5;

    private _health: number = this.INITIAL_HEALTH;
    private _shield: PlayerShield;
    private _scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this._scene = scene;
        this._shield = new PlayerShield(scene);
    }

    // 3 2 1 0
    shieldHealth(): number {
        return this._shield.health;
    }

    hitBubble() {
        this._shield.recharge();
    }

    hitEnemy() {
        if (this._shield.isActive) {
            this._shield.hit();
        } else {
            this._health--;
        }

        if (!this._health) {
            // game over
        }
    }
}