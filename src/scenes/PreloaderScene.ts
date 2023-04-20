import Phaser from 'phaser'

export default class PreloaderScene extends Phaser.Scene {
  plateforms!: Phaser.Physics.Arcade.StaticGroup
  player!: Phaser.Physics.Arcade.Sprite
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  ghost!: Phaser.Physics.Arcade.Group

  constructor() {
    super({
      key: 'PreloaderScene',
    })
    console.log("I'm inside my PreloaderScene")
  }

  preload() {
    this.load.image('tileset', 'assets/tilemaps/tileset.png')
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.json')
  }

  create() {
    this.scene.start('MainScene')
  }

  update() {}
}
