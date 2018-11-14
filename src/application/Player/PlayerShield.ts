export class PlayerShield {
    readonly INITIAL_HEALTH = 3;

    private _health: number = 0;
    private _scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this._scene = scene;
    }

    get isActive(): boolean {
        return this._health > 0;
    }

    get health(): number {
        return this._health;
    }

    hit() {
        if (this.isActive) {
            this._health--;
        }
    }

    recharge() {
        this._health = this.INITIAL_HEALTH;
    }
}