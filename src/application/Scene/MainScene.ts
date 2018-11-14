/// <reference path="../../phaser.d.ts" />

import * as PARAMS from "../Params.js";
import {Player} from "../Player/Player";

export class MainScene extends Phaser.Scene {

    readonly BACKGROUND_SPEED = 100;

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


        this.background = this.add.tileSprite(0,0, PARAMS.GAME_WIDTH * 2, PARAMS.GAME_HEIGHT, 'sea').setOrigin(0, 0);
        this.physics.add.existing(this.background);
        this.background.body.setVelocityX(this.BACKGROUND_SPEED * -1);

        this.player = this.physics.add.sprite(50, PARAMS.GAME_HEIGHT / 2, 'dude');
        this.player.setCollideWorldBounds(true);
        this.player.alpha = 0.9;
        this.player.setScale(0.5, 0.5);

        this.playerModel = new Player(this, this.player);

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
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });


        this.anims.create({
            key: 'bubble-3',
            frames: [ { key: 'bubble', frame: 0 } ],
        });


        this.anims.create({
            key: 'bubble-2',
            frames: [ { key: 'bubble', frame: 1 } ],
        });

        this.anims.create({
            key: 'bubble-1',
            frames: [ { key: 'bubble', frame: 2 } ],
        });


        this.cursors = this.input.keyboard.createCursorKeys();


        this.textLife = this.add.text(16, 16, '', { fontSize: '32px', fill: '#000' });
        this.textShield = this.add.text(50, 16, '', { fontSize: '32px', fill: '#000' });
    }

    update()
    {
        this.processBackground();

        this.processPlayerMovement();

        this.processBubble();

        this.processEnemy();
    }

    private playerTouchedBubble()
    {
        this.playerModel.hitBubble();

        this.destroyBubble();
    }

    private playerTouchedEnemy()
    {
        this.playerModel.hitEnemy();

        this.textLife.setText(this.playerModel.health);
        this.textShield.setText(this.playerModel.shieldHealth());


        this.destroyEnemy();

    }

    private destroyBubble()
    {
        this.bubble.destroy();
        this.bubble = null;
    }

    private destroyEnemy()
    {
        this.enemy.destroy();
        this.enemy = null;
    }

    private processEnemy()
    {
        if (!this.enemy) {
            this.enemy = this
                .physics
                .add
                .sprite(
                    PARAMS.GAME_WIDTH,
                    Phaser.Math.Between(0, PARAMS.GAME_HEIGHT - PARAMS.ENEMY_HEIGHT),
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

            this.enemy.body.setVelocityX(this.BACKGROUND_SPEED * -1);


            this.physics.add.overlap(this.enemy, this.player, this.playerTouchedEnemy, null, this);


            if (this.bubble) {
                this.physics.add.overlap(
                    this.enemy,
                    this.bubble,
                    function () {
                        this.destroyBubble();
                    },
                    null,
                    this
                );
            }
        } else {
            if (this.enemy.x + this.enemy.body.width <= 0) {
                this.destroyEnemy();
            }
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


            if (this.enemy) {
                this.physics.add.overlap(
                    this.enemy,
                    this.bubble,
                    function () {
                        this.destroyEnemy();
                    },
                    null,
                    this
                );
            }
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
}
