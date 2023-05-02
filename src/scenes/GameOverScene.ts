export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' })
    console.log("I'm inside my GameOverScene")
  }

  create() {
    // Add background image
    const background = this.add.image(0, 0, 'losebg').setOrigin(0)
    background.displayWidth = this.cameras.main.width
    background.displayHeight = this.cameras.main.height

    // Add game over text
    const gameOverText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Game Over',
      { fontSize: '32px', color: '#fff' },
    )
    gameOverText.setOrigin(0.5)

    // Add time alive text
    const timeAliveText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 50,
      `Time Alive: ${localStorage.getItem('timeAlive')}`,
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
      this.scene.stop('GameOverScene')
      const mainScene = this.scene.get('MainScene')
      const uiScene = this.scene.get('UIScene')
      mainScene.scene.restart()
      uiScene.scene.restart()
    })
  }
}