
export default class UIScene extends Phaser.Scene {
  wax = 100
  waxIsRunning = true
  waxRate = 4 // 1=1s 0.5=2s 2=0.5s

  waxBar!: Phaser.GameObjects.Graphics
  waxBarBackground!: Phaser.GameObjects.Graphics
  scoreUI!: Phaser.GameObjects.Text
  uiContainer!: Phaser.GameObjects.Container
  mainScene!: any

  constructor() {
    super({ key: 'UIScene' })
    console.log("I'm inside my UIScene")
  }

  create() {
    this.createContainer()
    this.createWaxBarBackground()
    this.createWaxBar()
    this.createScoreUI()
    this.createTimers()
  }

  setWaxRate(rate: number) {
    this.waxRate = rate
  }

  private createTimers() {
    var looptime = 1000 / this.waxRate

    // Wax timer
    this.time.addEvent({
      delay: looptime,
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
    this.waxBar.fillRect(10, 10, 300, 20)
    this.waxBar.setScrollFactor(0)
    this.waxBar.setDepth(100)
    this.uiContainer.add(this.waxBar)
  }

  // Wax bar background
  private createWaxBarBackground() {
    this.waxBarBackground = this.add.graphics()
    this.waxBarBackground.fillStyle(0x000000, 0.5)
    this.waxBarBackground.fillRect(10, 10, 300, 20)
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

  resetWax() {
    this.wax = 100
    this.updateWaxBar()
  }

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

      this.scene.start('GameOverScene')
    } else {
      if (this.wax > 100) {
        this.wax = 100
      }
      this.waxBar.clear()
      this.waxBar.fillStyle(0xff0000, 1)
      this.waxBar.fillRect(10, 10, this.wax * 3, 20)
      this.scoreUI.setText(`WAX: ${Math.floor(this.wax)}`)
    }
  }
}
