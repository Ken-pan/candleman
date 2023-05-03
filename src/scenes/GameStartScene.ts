export default class GameStartScene extends Phaser.Scene {

  constructor() {
    super({ key: 'GameStartScene' })
    console.log("I'm inside my StartScene")
  }

  preload() {
    // 加载背景图片和按钮图像
    this.load.image('background', 'assets/img/cover.png')
    this.load.image('startButton', 'assets/img/startButton.png')
    this.load.image('title', 'assets/img/title.png')
    this.load.audio('backgroundMusic', '/assets/audio/excit.wav')
  }

  create() {
    // 添加背景图片
    const background = this.add.image(0, 0, 'background')
    background.setOrigin(0, 0)
    background.displayWidth = this.sys.canvas.width
    background.displayHeight = this.sys.canvas.height
    

    // 添加标题
    const title = this.add.image(0, 200, 'title')
    title.setOrigin(0, 0)
    title.displayWidth = 400
    title.displayHeight = 80

    // 添加开始按钮
    const startButton = this.add.sprite(100, 600, 'startButton')
    startButton.setOrigin(0, 0)
    startButton.displayWidth = 200
    startButton.displayHeight = 75
    startButton.setInteractive({ useHandCursor: true })
    startButton.on('pointerdown', () => {
      // 当按钮被按下时，切换到游戏场景
      const mainScene = this.scene.get('MainScene')
      const uiScene = this.scene.get('UIScene')
      // 添加背景音乐
      const startBgm = this.sound.add('backgroundMusic', {
        loop: true,
        volume: 1,
      })
      startBgm.stop()
      startBgm.play()
      mainScene.scene.restart()
      uiScene.scene.restart()
      this.scene.stop()
    })
  }
}
