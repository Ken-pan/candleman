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
  }

  create() {
    this.scene.start('GameStartScene')
  }

  update() {}
}
