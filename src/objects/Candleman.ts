export default class Candleman extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'candleman')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setCollideWorldBounds(true)
    this.makeAnimations()
    // 检查物理体是否存在
    if (this.body) {
      this.body.setSize(16, 16) // 设置碰撞体积
      this.setVelocity(0)
      if (this.scene.input.keyboard === null) {
        throw new Error('Trees Layer is null.')
      }
      this.body.setSize(this.width / 2, this.height / 2)
      this.body.setOffset(this.width / 4, this.height / 2)
    }

    // this.update()

    this.anims.play('candleman-idle', true)
  }

  private makeAnimations() {
    this.anims.create({
      key: 'candleman-idle',
      frames: this.anims.generateFrameNames('candleman', {
        start: 0,
        end: 0,
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'candleman-left',
      frames: this.anims.generateFrameNames('candleman', {
        start: 1,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'candleman-right',
      frames: this.anims.generateFrameNames('candleman', {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'candleman-down',
      frames: this.anims.generateFrameNames('candleman', {
        start: 9,
        end: 12,
      }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'candleman-up',
      frames: this.anims.generateFrameNames('candleman', {
        start: 13,
        end: 16,
      }),
      frameRate: 10,
      repeat: -1,
    })
  }
  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt)
    this.setVelocity(0)
    if (this.scene.input.keyboard === null) {
      throw new Error('Trees Layer is null.')
    }

    if (this.scene.input.keyboard.addKey('left').isDown) {
      this.setVelocityX(-120)
      this.anims.play('candleman-left', true)
    } else if (this.scene.input.keyboard.addKey('right').isDown) {
      this.setVelocityX(120)
      this.anims.play('candleman-right', true)
    } else if (this.scene.input.keyboard.addKey('up').isDown) {
      this.setVelocityY(-120)
      this.anims.play('candleman-up', true)
    } else if (this.scene.input.keyboard.addKey('down').isDown) {
      this.setVelocityY(120)
      this.anims.play('candleman-down', true)
    } else {
      this.anims.play('candleman-idle', true)
    }

    // make the this.waxRate in UIScene = 8
  }
}
