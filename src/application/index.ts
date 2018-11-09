/// <reference path="../phaser.d.ts" />

class SimpleGame {
    game: Phaser.Game;
    scene: Phaser.Scene;
    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Input.Keyboard.CursorKeys;

    constructor() {
        this.scene = new Phaser.Scene('Game');
        this.scene.create = () => this.create();
        this.scene.preload = () => this.preload();
        this.scene.update = () => this.update();

        this.game = new Phaser.Game(
            {
                type: Phaser.AUTO,
                width: 800,
                height: 600,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 302 },
                        debug: false
                    }
                },
                scene: this.scene,
            }
        );
    }


    preload() {
        this.scene.load.image('sky', 'assets/sky.png');
        this.scene.load.image('ground', 'assets/platform.png');
        this.scene.load.image('star', 'assets/star.png');
        this.scene.load.image('bomb', 'assets/bomb.png');
        this.scene.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        this.scene.add.image(400, 300, 'sky');

        let platforms = this.scene.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        this.player = this.scene.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.physics.add.collider(this.player, platforms);


        this.cursors = this.scene.input.keyboard.createCursorKeys();




        let stars = this.scene.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }, this);


        this.scene.physics.add.collider(stars, platforms);

        this.scene.physics.add.overlap(this.player, stars, this.collectStar, null, this);
    }

    update() {
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

window.onload = () => {
    let game = new SimpleGame();
};