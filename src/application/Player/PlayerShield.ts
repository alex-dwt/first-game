import * as PARAMS from "../Params.js";
import {Player} from "./Player";

export class PlayerShield {
    readonly INITIAL_HEALTH = 3;

    private _health: number = 0;
    private _scene: Phaser.Scene;

    private _sprite: Phaser.GameObjects.Sprite;
    private _player: Player;

    constructor(scene: Phaser.Scene, player: Player) {
        this._player = player;
        this._scene = scene;
        this._sprite = this
            ._scene
            .add
            .sprite(
                PARAMS.GAME_WIDTH / 2,
                PARAMS.GAME_HEIGHT / 2,
                'bubble'
            )
            .setScale(0.5, 0.5);

        this._sprite.depth = 5;
        this._sprite.alpha = 0.5;

        this._sprite.visible = false;

        this._scene.events.on('update', this.redraw, this);
    }

    redraw() {
        this._sprite.x = this._player.playerSprite.x;
        this._sprite.y = this._player.playerSprite.y;
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

        this.updateAnimation();
    }

    recharge() {
        this._health = this.INITIAL_HEALTH;

        this.updateAnimation();
    }

    updateAnimation() {
        this._sprite.anims.play('bubble-' + this._health, true);

        this._sprite.visible = this.isActive;

        if (this.isActive) {
            this._player.playerSprite.setCircle(150, PARAMS.PLAYER_WIDTH * -1 / 10, PARAMS.PLAYER_HEIGHT * -1 / 2 )
        } else {
            this._player.playerSprite.setSize(230, 150);

        }
    }
}