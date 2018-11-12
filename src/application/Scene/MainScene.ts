/// <reference path="../../phaser.d.ts" />

import {BootScene} from "./BootScene";

export class MainScene extends Phaser.Scene {

    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Input.Keyboard.CursorKeys;
    background1: Phaser.GameObjects.Image;
    background2: Phaser.GameObjects.Image;

    constructor() {
        super({
            key: 'MainScene',
            active: false
        });
    }

    preload() {
        this.scene.remove('BootScene');
    }

    create() {
        this.background1 = this.physics.add.image(0, 0, 'sea').setOrigin(0, 0);
        this.background2 = this.physics.add.image(this.background1.width, 0, 'sea').setOrigin(0, 0);


        this.background1.setVelocityX(-15);
        this.background2.setVelocityX(-15);


        let platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.player, platforms);


        this.cursors = this.input.keyboard.createCursorKeys();


        let stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }, this);


        this.physics.add.collider(stars, platforms);

        this.physics.add.overlap(this.player, stars, this.collectStar, null, this);
    }

    update() {
        // this.background1.x--;
        // this.background2.x--;



        if (this.background1.x + this.background1.width <= 0) {
            this.background1.setX(this.background1.width)
        }


        if (this.background2.x + this.background1.width <= 0) {
            this.background2.setX(this.background1.width)
        }






        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-560);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }

    collectStar(player: Phaser.Physics.Arcade.Sprite, star: Phaser.Physics.Arcade.Sprite) {
        star.disableBody(true, true);
    }
}
