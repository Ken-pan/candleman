export default class GameStartScene extends Phaser.Scene {

  constructor() {
    super({ key: 'GameStartScene' })
  }

  preload() {
  }

  create() {
    // Add background
    const background = this.add.image(0, 0, 'background')
    background.setOrigin(0, 0)
    background.displayWidth = this.sys.canvas.width
    background.displayHeight = this.sys.canvas.height

    // Add title
    const title = this.add.image(0, 200, 'title')
    title.setOrigin(0, 0)
    title.displayWidth = 400
    title.displayHeight = 80

    // Add class text
    const classText = this.add.text(
      this.sys.canvas.width / 2,
      this.sys.canvas.height - 30,
      'IDX 528 - Prototyping Interactions | Spring 23 | Ken Pan',
      {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#ffffff',
      },
    )
    classText.setOrigin(0.5, 0.5)


    // Add start button
    const startButton = this.add.sprite(100, 600, 'startButton')
    startButton.setOrigin(0, 0)
    startButton.displayWidth = 200
    startButton.displayHeight = 75
    startButton.setInteractive({ useHandCursor: true })
    startButton.on('pointerdown', () => {
      // Restart game
      const mainScene = this.scene.get('MainScene')
      const uiScene = this.scene.get('UIScene')
      mainScene.scene.restart()
      uiScene.scene.restart()
      this.scene.stop()
    })
  }
}
