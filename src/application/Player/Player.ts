import {PlayerShield} from "./PlayerShield";
import * as PARAMS from "../Params.js";

export class Player {
    private _health: number = PARAMS.PLAYER_INITIAL_HEALTH;
    private _shield: PlayerShield;
    private _scene: Phaser.Scene;

    playerSprite: Phaser.Physics.Arcade.Sprite;

    constructor(scene: Phaser.Scene, playerSprite: Phaser.Physics.Arcade.Sprite) {
        this.playerSprite = playerSprite;
        this._scene = scene;
        this._shield = new PlayerShield(scene, this);
    }

    get health() {
        return this._health;
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
            this._scene.events.emit('gameover');
        }
    }
}