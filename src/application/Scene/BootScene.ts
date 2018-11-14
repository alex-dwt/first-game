/// <reference path="../../phaser.d.ts" />

import * as PARAMS from "../Params.js";

export class BootScene extends Phaser.Scene {

    constructor(key = 'BootScene') {
        super({
            key,
            active: true
        });
    }

    preload() {
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        this.load.on('progress', function (value: number) {
            progressBar.clear();
            progressBar.fillStyle(0xFFFFFF, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', (value: number) => {
            this.scene.setVisible(false)
            this.scene.start('MainScene')
        });

        this.load.image('sea', 'assets/sea.jpg');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.spritesheet('bubble',
            'assets/bubble.png',
            { frameWidth: PARAMS.BUBBLE_SIZE, frameHeight: PARAMS.BUBBLE_SIZE }
        );
    }
}
