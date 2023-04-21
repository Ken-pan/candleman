export default class Candleman extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'candleman')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setCollideWorldBounds(true)
    this.makeAnimations()

    this.anims.play('candleman-idle', true)
  }

  private makeAnimations() {
    this.anims.create({
      key: 'candleman-idle',
      frames: [{ key: 'candleman', frame: 0 }],
      frameRate: 20,
    })

    this.anims.create({
      key: 'candleman-left',
      frames: this.anims.generateFrameNumbers('candleman', {
        start: 1,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'candleman-right',
      frames: this.anims.generateFrameNumbers('candleman', {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'candleman-down',
      frames: this.anims.generateFrameNumbers('candleman', {
        start: 9,
        end: 12,
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'candleman-up',
      frames: this.anims.generateFrameNumbers('candleman', {
        start: 13,
        end: 16,
      }),
      frameRate: 10,
      repeat: -1,
    })
  }
}
