/// <reference path="../../phaser.d.ts" />

import {BootScene} from "./BootScene";
import * as PARAMS from "../Params.js";

export class MainScene extends Phaser.Scene {

    readonly BACKGROUND_SPEED = 100;
    readonly BACKGROUND_WIDTH = 800;

    readonly PLAYER_SPEED = this.BACKGROUND_SPEED + 20;

    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Input.Keyboard.CursorKeys;

    background: Phaser.GameObjects.TileSprite;

    bubbles: Phaser.Physics.Arcade.Sprite[] = [];

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
        this.background = this.add.tileSprite(0,0, 1600, 600, 'sea').setOrigin(0, 0);
        this.physics.add.existing(this.background);
        this.background.body.setVelocityX(this.BACKGROUND_SPEED * -1);

        this.player = this.physics.add.sprite(50, PARAMS.GAME_HEIGHT / 2, 'dude');
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

        // this.physics.add.collider(this.player, platforms);


        this.cursors = this.input.keyboard.createCursorKeys();

        //
        // let stars = this.physics.add.group({
        //     key: 'star',
        //     repeat: 11,
        //     setXY: { x: 12, y: 0, stepX: 70 }
        // });
        //
        // stars.children.iterate(function (child) {
        //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        // }, this);
        //
        //
        // this.physics.add.collider(stars, platforms);
        //
        // this.physics.add.overlap(this.player, stars, this.collectStar, null, this);
    }

    update()
    {
        this.processBackground();

        this.processPlayerMovement();

        this.processBubbles();

        // if (this.cursors.up.isDown && this.player.body.touching.down)
        // {
        //     this.player.setVelocityY(-330);
        // }
    }

    private processBubbles()
    {
        let idsToRemove = [];
        let i = 0;
        for (const bubble of this.bubbles) {
            if (bubble.x + bubble.body.width <= 0) {
                idsToRemove.push(i);
            }
            i++;
        }
        for (const id of idsToRemove) {
            this.bubbles[id].destroy();
            this.bubbles.splice(id, 1);
        }

        if (!this.bubbles.length) {
            const WIDTH = 170;

            let bubble = this
                .physics
                .add
                .sprite(
                    PARAMS.GAME_WIDTH,
                    Phaser.Math.Between(0, PARAMS.GAME_HEIGHT - WIDTH),
                    'bubble'
                )
                .setOrigin(0, 0)
                .setScale(0.7, 0.7);

            bubble.body.setVelocityX(this.BACKGROUND_SPEED * -1);

            this.bubbles.push(bubble);

            console.log(bubble)
        }
    }

    private processBackground()
    {
        if (Math.abs(this.background.x) >= PARAMS.GAME_WIDTH) {
            this.background.setX(0)
        }
    }

    private processPlayerMovement()
    {
        this.player.setVelocity(0, 0);

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(this.PLAYER_SPEED * -1);
        }

        if (this.cursors.down.isDown) {
            this.player.setVelocityY(this.PLAYER_SPEED);
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(this.PLAYER_SPEED * -1);
        }

        if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.PLAYER_SPEED);
        }

        if (this.player.body.velocity.x > 0) {
            this.player.anims.play('right', true);
        } else if (this.player.body.velocity.x < 0) {
            this.player.anims.play('left', true);
        } else {
            this.player.anims.play('turn');
            this.player.setVelocityX(this.BACKGROUND_SPEED * -1);
        }
    }
    //
    // collectStar(player: Phaser.Physics.Arcade.Sprite, star: Phaser.Physics.Arcade.Sprite) {
    //     star.disableBody(true, true);
    // }
}
