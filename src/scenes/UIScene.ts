import GameOverScene from './GameOverScene'
export default class UIScene extends Phaser.Scene {
  wax = 100
  waxIsRunning = true
  waxRate = 6 // 1=1s 0.5=2s 2=0.5s 4=0.25s

  waxBar!: Phaser.GameObjects.Graphics
  waxBarBackground!: Phaser.GameObjects.Graphics
  scoreUI!: Phaser.GameObjects.Text
  uiContainer!: Phaser.GameObjects.Container
  timerText!: Phaser.GameObjects.Text
  timer!: Phaser.Time.TimerEvent
  gameOverScene!: GameOverScene
  controlCircle!: Phaser.GameObjects.Ellipse

  constructor() {
    super({ key: 'UIScene' })
  }

  create() {
    this.createContainer()

    this.createWaxBarBackground()

    this.createWaxBar()

    this.createScoreUI()

    this.loopTimers()

    this.addSurviveTimer()
  }

  update() {
    this.waxBar.clear()
    this.waxBar.fillStyle(0xf4b982, 1)
    this.waxBar.fillRoundedRect(10, 10, (this.wax * 260) / 100, 20, 6)
    this.scoreUI.setText(`WAX`)
  }

  updateTimer() {
    const elapsedSeconds = Math.floor(this.time.now / 1000)
    localStorage.setItem('timeAlive', elapsedSeconds.toString())
    this.timerText.setText(`Time: ${elapsedSeconds}s`)
  }

  // UI container
  private createContainer() {
    this.uiContainer = this.add.container(0, 0)
    this.uiContainer.setScrollFactor(1)
  }

  // Wax bar background
  private createWaxBarBackground() {
    this.waxBarBackground = this.add.graphics()
    this.waxBarBackground.fillStyle(0x000000, 0.5)
    this.waxBarBackground.fillRoundedRect(10, 10, 260, 20, 6)
    this.waxBarBackground.setScrollFactor(0)
    this.waxBarBackground.setDepth(99)
    this.uiContainer.add(this.waxBarBackground)
  }

  // Wax bar
  private createWaxBar() {
    this.waxBar = this.add.graphics()
    this.waxBar.fillRoundedRect(10, 10, 260, 20, 6)
    this.waxBar.setScrollFactor(0)
    this.waxBar.setDepth(100)
    this.uiContainer.add(this.waxBar)
  }

  // UI
  private createScoreUI() {
    this.scoreUI = this.add.text(16, 13, `WAX: ${this.wax}`, {
      fontSize: '16px',
      color: '#5B2C00',
    })
    this.scoreUI.setDepth(100)
    this.scoreUI.setScrollFactor(0)

    this.uiContainer.add(this.scoreUI)
  }

  private createControlCircle() {
    const circleSize = 75
    const circleX = this.cameras.main.centerX
    const circleY = this.cameras.main.height - circleSize
    this.controlCircle = this.add.ellipse(
      circleX,
      circleY,
      circleSize,
      circleSize,
      0xd2d5e2,
      0.8,
    )
    this.controlCircle.setStrokeStyle(2, 0xcccccc, 1)
    this.controlCircle.setDepth(999)
    this.controlCircle.setScrollFactor(0)
    this.controlCircle.setInteractive()
    this.input.setDraggable(this.controlCircle)

    this.input.on(
      'drag',
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Ellipse,
        dragX: number,
        dragY: number,
      ) => {
        // Emit the appropriate event based on the drag direction
        const dragDirection = Phaser.Math.Angle.Between(
          circleX,
          circleY,
          gameObject.x,
          gameObject.y,
        )
        const dragTolerance = Math.PI / 8

        if (Math.abs(dragDirection) <= dragTolerance) {
          this.events.emit('moveRight')
        } else if (Math.abs(dragDirection) >= Math.PI - dragTolerance) {
          this.events.emit('moveLeft')
        } else if (
          dragDirection >= Math.PI / 2 - dragTolerance &&
          dragDirection <= Math.PI / 2 + dragTolerance
        ) {
          this.events.emit('moveDown')
        } else if (
          dragDirection <= -Math.PI / 2 + dragTolerance &&
          dragDirection >= -Math.PI / 2 - dragTolerance
        ) {
          this.events.emit('moveUp')
        }

        // Limit the drag distance to the circle radius
        const distance = Phaser.Math.Distance.Between(
          circleX,
          circleY,
          dragX,
          dragY,
        )
        const maxDistance = circleSize / 2
        if (distance <= maxDistance) {
          gameObject.x = dragX
          gameObject.y = dragY
        } else {
          const angle = Phaser.Math.Angle.Between(
            circleX,
            circleY,
            dragX,
            dragY,
          )
          gameObject.x = circleX + Math.cos(angle) * maxDistance
          gameObject.y = circleY + Math.sin(angle) * maxDistance
        }
      },
    )

    this.input.on(
      'dragend',
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Ellipse,
      ) => {
        gameObject.x = circleX
        gameObject.y = circleY
      },
    )

    this.uiContainer.add(this.controlCircle)
  }

  updateWaxBar() {
    if (this.waxIsRunning === false) {
      return
    }

    this.wax -= 1

    if (this.wax < 0) {
      this.waxIsRunning = false
      this.scene.stop('UIScene')
      this.scene.stop('MainScene')
      this.scene.get('GameOverScene').scene.start()
    } else {
      if (this.wax > 100) {
        this.wax = 100
      }
    }
  }

  setWaxRate(rate: number) {
    this.waxRate = rate
  }

  private loopTimers() {
    var looptime = 1000 / this.waxRate

    // Wax timer
    this.time.addEvent({
      delay: looptime,
      loop: true,
      callback: this.updateWaxBar,
      callbackScope: this,
    })
  }

  private addSurviveTimer() {
    this.timerText = this.add.text(
      this.cameras.main.width - 100,
      10,
      'Time: 0s',
      { fontSize: '16px', color: '#fff' },
    )
    this.uiContainer.add(this.timerText)

    if (this.timer !== undefined) {
      this.timer.elapsed = 0
    }
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    })
  }

  reset() {
    this.wax = 100
    this.waxIsRunning = true
    this.waxBar.clear()
    this.waxIsRunning = true
    this.timer.remove()
    if (localStorage.getItem('timeAlive') !== null) {
      this.timerText.setText(`Time: ${localStorage.getItem('timeAlive')}s`)
    } else {
      this.timerText.setText('Time: 0s')
    }
  }
}
