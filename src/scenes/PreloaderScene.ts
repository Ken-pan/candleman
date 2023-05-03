export default class PreloaderScene extends Phaser.Scene {
  plateforms!: Phaser.Physics.Arcade.StaticGroup
  player!: Phaser.Physics.Arcade.Sprite
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  ghost!: Phaser.Physics.Arcade.Group

  constructor() {
    super({ key: 'PreloaderScene' })
    console.log("I'm inside my PreloaderScene")
  }

  preload() {
    this.load.image('tileset', 'assets/tilemaps/tileset.png')
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.json')
    this.load.image('ghost', 'assets/img/ghost.png')
    this.load.image('door', 'assets/img/door.png')
    this.load.image('winbg', 'assets/img/success.png')
    this.load.image('losebg', 'assets/img/fail.png')
    this.load.image('restartButton', 'assets/img/restart.png')
    this.load.spritesheet('candleman', 'assets/img/candleman.png', {
      frameWidth: 24,
      frameHeight: 36,
    })
    this.load.spritesheet('tile', 'assets/tilemaps/tileset.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.audio('stepdirt_1', ['/assets/audio/stepdirt_1.wav'])
    this.load.audio('stepdirt_2', ['/assets/audio/stepdirt_2.wav'])
    this.load.audio('stepdirt_3', ['/assets/audio/stepdirt_3.wav'])
    this.load.audio('stepdirt_4', ['/assets/audio/stepdirt_4.wav'])
    this.load.audio('stepdirt_5', ['/assets/audio/stepdirt_5.wav'])
    this.load.audio('stepdirt_6', ['/assets/audio/stepdirt_6.wav'])
    this.load.audio('stepdirt_7', ['/assets/audio/stepdirt_7.wav'])
    this.load.audio('stepdirt_8', ['/assets/audio/stepdirt_8.wav'])
    this.load.audio('ghostSound', ['/assets/audio/ghost_2.flac'])
    this.load.audio('eatSound', ['/assets/audio/crunch.6.ogg'])
  }

  create() {
    this.scene.start('GameStartScene')
  }

  update() {}
}
