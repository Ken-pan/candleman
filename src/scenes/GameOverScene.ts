export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' })
    console.log("I'm inside my GameOverScene")
  }

  create() {
    // Add game over text
    const gameOverText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Game Over',
      { fontSize: '32px', color: '#fff' },
    )
    gameOverText.setOrigin(0.5)

    // Add restart button
    const restartButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 50,
      'Restart',
      { fontSize: '24px', color: '#fff' },
    )
    restartButton.setOrigin(0.5)
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
