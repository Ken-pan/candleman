import MainScene from "./MainScene"
import UIScene from "./UIScene"

export default class GameWinScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameWinScene' })
    console.log("I'm inside my GameWinScene")
  }

  create() {
     this.scene.remove('MainScene')
     this.scene.remove('UIScene')

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
      this.scene.stop('GameWinScene')
      this.scene.add('MainScene', MainScene, true)
      this.scene.add('UIScene', UIScene, true)
    })

  }
}
