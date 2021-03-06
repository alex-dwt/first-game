/// <reference path="../../phaser.d.ts" />

import * as PARAMS from "../Params.js";
import {Player} from "../Player/Player";
import {Game} from "../Game";

export class MainScene extends Phaser.Scene {

    readonly BACKGROUND_SPEED = 100;

    readonly PLAYER_SPEED = this.BACKGROUND_SPEED + 20;

    player: Phaser.Physics.Arcade.Sprite;
    background: Phaser.GameObjects.TileSprite;
    bubble: Phaser.Physics.Arcade.Sprite;
    enemy: Phaser.Physics.Arcade.Sprite;
    playerModel: Player;
    textLife: Phaser.GameObjects.Text;
    textShield: Phaser.GameObjects.Text;

    isGameOver: boolean;

    constructor() {
        super({
            key: 'MainScene',
            active: false
        });
    }

    init() {
        this.scene.remove('BootScene');

        this.player = null;
        this.background = null;
        this.bubble = null;
        this.enemy = null;
        this.playerModel = null;
        this.textLife = null;
        this.textShield = null;
        this.isGameOver = false;
    }

    create() {

        this.background = this.add.tileSprite(0,0, Game.width() * 2, Game.height(), 'sea').setOrigin(0, 0);
        this.physics.add.existing(this.background);
        this.background.body.setVelocityX(this.BACKGROUND_SPEED * -1);

        this.player = this.physics.add.sprite(50, Game.height() / 2, 'dude');
        this.player.setCollideWorldBounds(true);
        this.player.alpha = 0.9;

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


        this.textLife = this.add.text(65, 18, PARAMS.PLAYER_INITIAL_HEALTH, { fontSize: '32px', fill: '#FFF' });
        this.textShield = this.add.text(150, 18, '0', { fontSize: '32px', fill: '#FFF' });

        this.events.on('gameover', () => {
            this.isGameOver = true;

            this.anims.pauseAll();
            this.physics.pause();
            this.player.setTint(0xff0000);

            this.cameras.main.shake(250, 0.05, true, (camera, progress) => {
                if (progress === 1) {
                    let gameOverText = this.add.text(Game.width() / 2, 0, 'Game Over', { fontSize: '50px', fill: 'red' });
                    gameOverText.depth = 5;

                    this.tweens.add({
                        targets: gameOverText,
                        x: Game.width() / 2,
                        y: Game.height() / 2,
                        ease: 'Expo.easeOut',
                        duration: 1000,
                        repeat: 0,
                        yoyo: false
                    });



                    let restartText = this.add.text(Game.width() / 2, Game.height() / 2 + 50, 'restart', { fontSize: '50px', fill: 'white' });
                    restartText.depth = 5;
                    restartText.alpha = 0;

                    this.tweens.add({
                        targets: restartText,
                        alpha: 1,
                        ease: 'Phaser.Easing.Linear.None',
                        duration: 1000,
                        repeat: 0,
                        yoyo: false,
                        onComplete: (tween, elements) => {
                            elements[0].setInteractive();
                        },
                    });


                    restartText.on('pointerdown', (pointer) => {
                        this.scene.restart();
                        this.anims.resumeAll();
                    })
                }
            }, this);

        });

        this.add.image(35, 35, 'heart').setScale(0.4, 0.4);
        this.add.image(120, 35, 'shield').setScale(0.4, 0.4);
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

        this.textLife.setText(this.playerModel.health);
        this.textShield.setText(this.playerModel.shieldHealth());

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
                    Game.width(),
                    Phaser.Math.Between(0, Game.height() - PARAMS.ENEMY_HEIGHT),
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
                    Game.width(),
                    Phaser.Math.Between(0, Game.height() - WIDTH),
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
        if (Math.abs(this.background.x) >= Game.width()) {
            this.background.setX(0)
        }
    }

    private processPlayerMovement()
    {
        if (this.isGameOver) {
            return;
        }

        let pointer = this.input.activePointer;

        if (pointer.isDown
            && !Phaser.Geom.Rectangle.ContainsPoint(this.player.getBounds(), {x: pointer.x, y: pointer.y})
        ) {
            this.physics.moveTo(this.player, pointer.x, pointer.y, this.PLAYER_SPEED);
        } else {
            this.player.setVelocity(0, 0);
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
