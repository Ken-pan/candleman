export default class UIScene extends Phaser.Scene {
  wax = 100
  waxIsRunning = true
  waxRate = 10

  waxBar!: Phaser.GameObjects.Graphics
  waxBarBackground!: Phaser.GameObjects.Graphics
  scoreUI!: Phaser.GameObjects.Text
  uiContainer!: Phaser.GameObjects.Container

  constructor() {
    super({ key: 'UIScene' })
    console.log("I'm inside my UIScene")
  }

  create() {
    this.createContainer()
    this.createWaxBar()
    this.createWaxBarBackground()
    this.createScoreUI()
    this.createTimers()
  }

  private createTimers() {
    // Wax timer
    this.time.addEvent({
      delay: this.waxRate,
      loop: true,
      callback: this.updateWaxBar,
      callbackScope: this,
    })
  }

  // UI container
  private createContainer() {
    this.uiContainer = this.add.container(0, 0)
    this.uiContainer.setScrollFactor(1)

    // Position the container
    // this.uiContainer.setPosition(0, 0)
  }

  // Wax bar
  private createWaxBar() {
    this.waxBar = this.add.graphics()
    this.waxBar.fillStyle(0xff0000, 1)
    this.waxBar.fillRect(10, 10, 200, 20)
    this.waxBar.setScrollFactor(0)
    this.waxBar.setDepth(100)
    this.uiContainer.add(this.waxBar)
  }

  // Wax bar background
  private createWaxBarBackground() {
    this.waxBarBackground = this.add.graphics()
    this.waxBarBackground.fillStyle(0x000000, 0.5)
    this.waxBarBackground.fillRect(10, 10, 200, 20)
    this.waxBarBackground.setScrollFactor(0)
    this.waxBarBackground.setDepth(99)
    this.uiContainer.add(this.waxBarBackground)
  }

  // UI
  private createScoreUI() {
    this.scoreUI = this.add.text(16, 13, `WAX: ${this.wax}`, {
      fontSize: '16px',
      color: '#fff',
    })
    this.scoreUI.setDepth(100)
    this.scoreUI.setScrollFactor(0)

    this.uiContainer.add(this.scoreUI)
  }

  update() {}

  private updateWaxBar() {
    if (this.waxIsRunning === false) {
      return
    }

    this.wax -= 1

    if (this.wax < 0) {
      this.waxIsRunning = false

      // Game over
      this.scene.pause()
      this.scene.pause('MainScene')

      // TODO: Add game over scene
      // this.scene.start('GameOverScene')
    } else {
      this.waxBar.clear()
      this.waxBar.fillStyle(0xff0000, 1)
      this.waxBar.fillRect(10, 10, this.wax * 2, 20)
      this.scoreUI.setText(`WAX: ${Math.floor(this.wax)}`)
    }
  }
}
