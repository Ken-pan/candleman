export default class Candleman extends Phaser.Physics.Arcade.Sprite {
  stepSounds: Phaser.Sound.BaseSound[] = []
  lastPlayedTime: number = 0 // 记录上一次播放音效的时间
  minTimeBetweenSteps: number = 200 // 最短的播放间隔时间（单位：毫秒）
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
    this.anims.play('candleman-idle', true)

    // Initialize step sounds
    this.stepSounds = []
    for (let i = 1; i <= 8; i++) {
      const soundKey = `stepdirt_${i}`
      const sound = scene.sound.add(soundKey)

      this.stepSounds.push(sound)
    }
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
      this.playStepSound()
    } else if (this.scene.input.keyboard.addKey('right').isDown) {
      this.setVelocityX(120)
      this.anims.play('candleman-right', true)
      this.playStepSound()
    } else if (this.scene.input.keyboard.addKey('up').isDown) {
      this.setVelocityY(-120)
      this.anims.play('candleman-up', true)
      this.playStepSound()
    } else if (this.scene.input.keyboard.addKey('down').isDown) {
      this.setVelocityY(120)
      this.anims.play('candleman-down', true)
      this.playStepSound()
    } else {
      this.anims.play('candleman-idle', true)
    }

    // make the this.waxRate in UIScene = 8
  }

  private playStepSound() {
    const soundIndex = Phaser.Math.Between(0, 7)
    const sound = this.stepSounds[soundIndex]
    const currentTime = this.scene.time.now // 获取当前时间



    if (currentTime - this.lastPlayedTime > this.minTimeBetweenSteps) {
      // 让音量变小一点，并播放sound
      sound.play({ volume: 0.2 })
      this.lastPlayedTime = currentTime
    }
  }
}
