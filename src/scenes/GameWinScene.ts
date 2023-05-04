import MainScene from './MainScene'
import UIScene from './UIScene'

export default class GameWinScene extends Phaser.Scene {
  winSound!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound
  constructor() {
    super({ key: 'GameWinScene' })

  }

  create() {
    // Remove other scenes
    this.scene.remove('MainScene')
    this.scene.remove('UIScene')
    this.sound.stopAll()
    
    // Add win sound
    this.winSound = this.sound.add('winSound', {
      loop: false,
      volume: 1,
    })
    this.winSound.play()

    // Add background image
    const background = this.add.image(0, 0, 'winbg').setOrigin(0)
    background.displayWidth = this.cameras.main.width
    background.displayHeight = this.cameras.main.height

    // Add game Win text
    const gameWinText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'You Win!',
      { fontSize: '32px', color: '#fff' },
    )
    gameWinText.setOrigin(0.5)

    // Add time alive text
    const timeAliveText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 50,
      `You spend: ${localStorage.getItem('timeAlive')} seconds`,
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
      this.scene.stop('GameWinScene')
      this.scene.add('MainScene', MainScene, true)
      this.scene.add('UIScene', UIScene, true)
      this.scene.get('UIScene').timer.elapsed = 0
    })
  }
}
