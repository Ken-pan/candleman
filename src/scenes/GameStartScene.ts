export default class GameStartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameStartScene' })
    console.log("I'm inside my StartScene")
  }

  preload() {
    // 加载背景图片和按钮图像
    this.load.image('background', 'assets/img/cover.png')
    this.load.image('startButton', 'assets/img/startButton.png')
    this.load.audio(
      'backgroundMusic',
      '/assets/audio/the_field_of_dreams.mp3',
    ) // 请将文件路径替换为您的背景音乐文件路径
  }

  create() {
    // 添加背景图片
    const background = this.add.image(0, 0, 'background')
    background.setOrigin(0, 0)
    background.displayWidth = this.sys.canvas.width
    background.displayHeight = this.sys.canvas.height
    
    // 添加背景音乐
    const bgm = this.sound.add('backgroundMusic', { loop: true, volume: 0.5 })
    bgm.play()

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

      mainScene.scene.restart()
      uiScene.scene.restart()
      this.scene.stop()
    })
  }
}
