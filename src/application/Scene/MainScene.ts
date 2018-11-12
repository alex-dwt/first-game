/// <reference path="../../phaser.d.ts" />

import {BootScene} from "./BootScene";
import * as PARAMS from "../Params.js";

export class MainScene extends Phaser.Scene {

    readonly BACKGROUND_SPEED = 180;
    readonly BACKGROUND_WIDTH = 800;

    readonly PLAYER_SPEED = this.BACKGROUND_SPEED * 2;

    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Input.Keyboard.CursorKeys;

    background: [
        Phaser.GameObjects.Image,
        Phaser.GameObjects.Image
    ] = [];

    bubbles: Phaser.GameObjects.Graphics[] = [];

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
        this.background.push(this.physics.add.image(0, 0, 'sea').setOrigin(0, 0));
        this.background.push(this.physics.add.image(this.background[0].width, 0, 'sea').setOrigin(0, 0));

        this.background.map((v) => v.setVelocityX(this.BACKGROUND_SPEED * -1));

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
        // let idsToRemove = [];
        //
        // let i = 0;
        // for (const bubble of this.bubbles) {
        //     console.log(bubble.body.width);
        //
        //     if (Math.abs(bubble.x) >= PARAMS.GAME_WIDTH + bubble.body.width) {
        //         idsToRemove.push(i);
        //     }
        //     i++;
        // }
        //
        // for (const id of idsToRemove) {
        //     console.log(id)
        //     this.bubbles[id].destroy();
        //     this.bubbles.splice(id, 1);
        // }

        if (!this.bubbles.length) {
            const MAX_RADIUS = 50;

            let bubble = this.add.graphics({ fillStyle: { color: 0xff0000 } });

            const radius = 50;//Phaser.Math.Between(30, MAX_RADIUS);
            bubble.fillCircleShape(
                new Phaser.Geom.Circle(
                    PARAMS.GAME_WIDTH - 100 - radius,
                    Phaser.Math.Between(radius * 2, PARAMS.GAME_WIDTH - radius * 2),
                    radius
                )
            );

            console.log(bubble);


            this.physics.world.enable(bubble);

            bubble.body.bounce.set(1)
            bubble.body.setCircle(45)

            // this.physics.world.add(bubble);
            bubble.body.setVelocityX(this.BACKGROUND_SPEED * -1);
            this.bubbles.push(bubble);

            this.physics.add.collider(this.player, bubble,
                function () {console.log(111)}, function () {console.log(2)});


            this.physics.add.overlap(this.player, bubble,
                function () {console.log(111)}, function () {console.log(2)});
            bubble.depth = 0;
            bubble.body.onCollide = true;
            bubble.body.onOverlap = true;

            // bubble.body.onWorldBounds = true;
            // bubble.body.setCollideWorldBounds(true);
            // this.physics.world.on('worldbounds', function(body){
            //     console.log('hello from the edge of the world', body);
            // },this);
            this.physics.world.on('collide', function(body){
                console.log('hello from the edge of the world', body);
            },this);
            this.physics.world.on('overlap', function(body){
                console.log('hello from the edge of the world', body);
            },this);
        }
    }

    private processBackground()
    {
        for (const background of this.background) {
            const diff = background.x + this.BACKGROUND_WIDTH;
            if (diff <= 0) {
                background.setX(this.BACKGROUND_WIDTH + diff);
            }
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
        }
    }
    //
    // collectStar(player: Phaser.Physics.Arcade.Sprite, star: Phaser.Physics.Arcade.Sprite) {
    //     star.disableBody(true, true);
    // }
}
