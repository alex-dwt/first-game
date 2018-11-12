/// <reference path="../phaser.d.ts" />

import { MainScene } from "./Scene/MainScene";
import { BootScene } from "./Scene/BootScene";
import * as PARAMS from "./Params.js";

export class Game {
    game: Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(
            {
                type: Phaser.AUTO,
                width: PARAMS.GAME_WIDTH,
                height: PARAMS.GAME_HEIGHT,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 0 },
                        debug: false
                    }
                },
                scene: [new BootScene(), new MainScene()],
            }
        );
    }
}