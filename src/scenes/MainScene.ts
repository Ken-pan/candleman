export default class MainScene extends Phaser.Scene {
  plateforms!: Phaser.Physics.Arcade.StaticGroup
  player!: Phaser.Physics.Arcade.Sprite
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  ghost!: Phaser.Physics.Arcade.Group

  score = 0
  scoreText = `Score: ${this.score}`
  scoreUI!: Phaser.GameObjects.Text

  constructor() {
    super({
      key: 'MainScene',
    })
    console.log("I'm inside my MainScene")
  }

  preload() {}

  create() {
    const map = this.make.tilemap({ key: 'map' })
    console.log('map', map)

    // const tileset2 = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2)
    const tileset = map.addTilesetImage('tileset', 'tileset', 32, 32, 0, 0)

    console.log(tileset)

    if (tileset === null) {
      throw new Error('tileset is null')
    }

    map.createLayer('Ground', tileset)
    map.createLayer('Walls', tileset)
  }
}
