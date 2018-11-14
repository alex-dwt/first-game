/// <reference path="../../phaser.d.ts" />

import * as PARAMS from "../Params.js";
import {Player} from "../Player/Player";


export class MainScene extends Phaser.Scene {

    readonly BACKGROUND_SPEED = 100;
    readonly BACKGROUND_WIDTH = 800;

    readonly PLAYER_SPEED = this.BACKGROUND_SPEED + 20;

    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Input.Keyboard.CursorKeys;

    background: Phaser.GameObjects.TileSprite;

    bubble: Phaser.Physics.Arcade.Sprite;

    enemy: Phaser.Physics.Arcade.Sprite;

    playerModel: Player;

    textLife: Phaser.GameObjects.Text;
    textShield: Phaser.GameObjects.Text;

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
        this.playerModel = new Player(this);


        this.background = this.add.tileSprite(0,0, PARAMS.GAME_WIDTH * 2, PARAMS.GAME_HEIGHT, 'sea').setOrigin(0, 0);
        this.physics.add.existing(this.background);
        this.background.body.setVelocityX(this.BACKGROUND_SPEED * -1);

        this.player = this.physics.add.sprite(50, PARAMS.GAME_HEIGHT / 2, 'dude');
        this.player.setCollideWorldBounds(true);
        this.player.alpha = 0.9;
        this.player.setScale(0.5, 0.5);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 7 }),
            frameRate: 4,
            repeat: -1
        });
        // this.anims.create({
        //     key: 'turn',
        //     frames: [ { key: 'dude', frame: 4 } ],
        //     // frameRate: 20
        // });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        // this.anims.create({
        //     key: 'b',
        //     frames: this.anims.generateFrameNumbers('bubble', { start: 0, end: 2 }),
        //     frameRate: 2,
        //     repeat: -1
        // });


        this.anims.create({
            key: 'bubble-2',
            frames: [ { key: 'bubble', frame: 1 } ],
        });

        this.anims.create({
            key: 'bubble-1',
            frames: [ { key: 'bubble', frame: 2 } ],
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





        this.textLife = this.add.text(16, 16, '', { fontSize: '32px', fill: '#000' });
        this.textShield = this.add.text(50, 16, '', { fontSize: '32px', fill: '#000' });


    }

    update()
    {
        this.processBackground();

        this.processPlayerMovement();

        this.processBubble();

        this.processEnemy();

        // if (this.cursors.up.isDown && this.player.body.touching.down)
        // {
        //     this.player.setVelocityY(-330);
        // }
    }

    private playerTouchedBubble()
    {
        this.playerModel.hitBubble();

        let shieldHealth = this.playerModel.shieldHealth();

        if (shieldHealth) {
            this.player.setCircle(150, PARAMS.PLAYER_WIDTH * -1 / 10, PARAMS.PLAYER_HEIGHT * -1 / 2 )
        } else {

        }

        this.destroyBubble();
    }

    private playerTouchedEnemy()
    {
        if (this.enemy.visible) {
            this.playerModel.hitEnemy();

            this.textLife.setText(this.playerModel.health);
            this.textShield.setText(this.playerModel.shieldHealth());

            this.enemy.destroy();
            this.enemy = null;

            console.log('playerTouchedEnemy')
        }
    }

    private destroyBubble()
    {
        this.bubble.destroy();
        this.bubble = null;
    }

    private processEnemy()
    {
        if (!this.enemy) {





            this.enemy = this
                .physics
                .add
                .sprite(
                    500,
                    500,
                    'enemy'
                )
                .setOrigin(0, 0);


            this.anims.create({
                key: 'test',
                frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 9 }),
                frameRate: 5,
                repeat: -1
            });


            this.enemy.anims.play('test', true);

            this.enemy.alpha = 0.8;


            this.physics.add.overlap(this.enemy, this.player, this.playerTouchedEnemy, null, this);


            this.enemy.visible = false;

            setTimeout(() => {
                this.enemy.visible = true;
            }, 5000);
        }
    }

    private processBubble()
    {
        if (!this.bubble) {
            const WIDTH = PARAMS.BUBBLE_SIZE / 2;

            this.bubble = this
                .physics
                .add
                .sprite(
                    PARAMS.GAME_WIDTH,
                    Phaser.Math.Between(0, PARAMS.GAME_HEIGHT - WIDTH),
                    'bubble'
                )
                .setOrigin(0, 0)
                .setScale(0.5, 0.5);

            this.bubble.body.setVelocityX(this.BACKGROUND_SPEED * -1);

            this.physics.add.overlap(this.bubble, this.player, this.playerTouchedBubble, null, this);


            // this.bubble.anims.play('bubble-1');

        } else {
            if (this.bubble.x + this.bubble.body.width <= 0) {
                this.destroyBubble();
            }
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
            this.player.anims.play('turn', true);
            this.player.setVelocityX(this.BACKGROUND_SPEED * -1);
        }
    }
    //
    // collectStar(player: Phaser.Physics.Arcade.Sprite, star: Phaser.Physics.Arcade.Sprite) {
    //     star.disableBody(true, true);
    // }
}
