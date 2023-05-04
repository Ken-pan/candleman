export default class Candleman extends Phaser.Physics.Arcade.Sprite {
  stepSounds: Phaser.Sound.BaseSound[] = []
  lastPlayedTime: number = 0
  minTimeBetweenSteps: number = 200
  invincible: boolean = false // if true, candleman can't be eaten by ghosts
  invincibleTimer: number = 0 // timer for invincibility

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'candleman')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setCollideWorldBounds(true)
    this.makeAnimations()

    // check if the body is null
    this.initialCandleman(scene)
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt)

    this.checkInvincible(dt)

    if (this.scene.input.keyboard === null) {
      throw new Error('Keyboard is null.')
    }
    if (this.scene.input.keyboard.addKey('left').isDown) {
      this.moveLeft()
    } else if (this.scene.input.keyboard.addKey('right').isDown) {
      this.moveRight()
    } else if (this.scene.input.keyboard.addKey('up').isDown) {
      this.moveUp()
    } else if (this.scene.input.keyboard.addKey('down').isDown) {
      this.moveDown()
    } else {
      this.idle()
    }
  }

  private initialCandleman(scene: Phaser.Scene) {
    if (this.body) {
      this.body.setSize(16, 16) // set the collision box size
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

  ghostCollide() {
    this.invincible = true
    this.invincibleTimer = 1000 // Keep invincible for 1 second
  }

  private checkInvincible(dt: number) {
    if (this.invincible) {
      let alpha = 1 - this.invincibleTimer / 1000 // calculate alpha for red, 1 is opaque
      let redTint = Phaser.Display.Color.GetColor(255, 255 * alpha, 255 * alpha)
      this.setTint(redTint) // set the tint to red
      this.invincibleTimer -= dt

      if (this.invincibleTimer <= 0) {
        this.invincible = false
        this.clearTint()
      }
    }
  }

  makeAnimations() {
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

  playStepSound() {
    const soundIndex = Phaser.Math.Between(0, 7)
    const sound = this.stepSounds[soundIndex]
    const currentTime = this.scene.time.now // access the current time

    if (currentTime - this.lastPlayedTime > this.minTimeBetweenSteps) {
      // 让音量变小一点，并播放sound
      sound.play({ volume: 0.1 })
      this.lastPlayedTime = currentTime
    }
  }

  moveUp() {
    this.setVelocityY(-90)
    this.anims.play('candleman-up', true)
    this.playStepSound()
  }

  moveDown() {
    this.setVelocityY(90)
    this.anims.play('candleman-down', true)
    this.playStepSound()
  }

  moveLeft() {
    this.setVelocityX(-90)
    this.anims.play('candleman-left', true)
    this.playStepSound()
  }

  moveRight() {
    this.setVelocityX(90)
    this.anims.play('candleman-right', true)
    this.playStepSound()
  }

  idle() {
    this.setVelocity(0)
    this.anims.play('candleman-idle', true)
  }
}
