/// <reference path="../phaser.d.ts" />

import { MainScene } from "./Scene/MainScene";
import { BootScene } from "./Scene/BootScene";

export class Game {
    game: Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(
            {
                type: Phaser.AUTO,
                width: 800,
                height: 600,
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