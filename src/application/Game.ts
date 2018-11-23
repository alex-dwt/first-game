/// <reference path="../phaser.d.ts" />

import { MainScene } from "./Scene/MainScene";
import { BootScene } from "./Scene/BootScene";
import * as PARAMS from "./Params.js";

export class Game {
    game: Phaser.Game;

    constructor(width: number, height: number) {
        w = width;
        h = height;

        this.game = new Phaser.Game(
            {
                type: Phaser.AUTO,
                width,
                height,
                physics: {
                    default: 'arcade',
                    arcade: {
                        // debug: true
                    }
                },
                scene: [new BootScene(), new MainScene()],
            }
        );
    }

    static width() {
        return w;
    }

    static height() {
        return h;
    }
}

let w;
let h;