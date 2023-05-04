import MainScene from './MainScene'
import UIScene from './UIScene'

export default class GameOverScene extends Phaser.Scene {
  loseSound!:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
  constructor() {
    super({ key: 'GameOverScene' })
  }

  create() {
    // Remove other scenes
    this.scene.remove('MainScene')
    this.scene.remove('UIScene')
    this.sound.stopAll()

    // Add lose sound
    this.loseSound = this.sound.add('loseSound')
    this.loseSound.play()

    // Add background image
    const background = this.add.image(0, 0, 'losebg').setOrigin(0)
    background.displayWidth = this.cameras.main.width
    background.displayHeight = this.cameras.main.height

    // Add game over text
    const gameOverText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - this.cameras.main.height / 3,
      'Game Over',
      { fontSize: '32px', color: '#fff' },
    )
    gameOverText.setOrigin(0.5)

    // Add time alive text
    const timeAliveText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - this.cameras.main.height / 3 + 50,
      `Time Alive: ${localStorage.getItem('timeAlive')} seconds`,
      { fontSize: '24px', color: '#fff' },
    )
    timeAliveText.setOrigin(0.5)

    // Add restart button
    const restartButton = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 240,
      'restartButton',
    )
    restartButton.setOrigin(0.5)
    restartButton.displayWidth = 200
    restartButton.displayHeight = 75
    restartButton.setInteractive()
    restartButton.on('pointerdown', () => {
      // Restart game
      this.scene.stop('GameOverScene')
      this.scene.add('MainScene', MainScene, true)
      this.scene.add('UIScene', UIScene, true)
      this.scene.get('UIScene').timer.elapsed = 0
    })
  }
}
