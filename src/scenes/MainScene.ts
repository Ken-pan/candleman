import Candleman from "../objects/Candleman"

export default class MainScene extends Phaser.Scene {
  plateforms!: Phaser.Physics.Arcade.StaticGroup
  player!: Phaser.Physics.Arcade.Sprite
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  ghost!: Phaser.Physics.Arcade.Group

  score = 0
  scoreText = `Score: ${this.score}`
  scoreUI!: Phaser.GameObjects.Text

  // Layers
  groundLayer!: Phaser.Tilemaps.TilemapLayer | null
  waxLayer!: Phaser.Tilemaps.TilemapLayer | null
  doorsLayer!: Phaser.Tilemaps.TilemapLayer | null
  treesLayer!: Phaser.Tilemaps.TilemapLayer | null
  candleman!: Candleman

  constructor() {
    super({
      key: 'MainScene',
    })
    console.log("I'm inside my MainScene")
  }

  preload() {}

  create() {
    const map = this.make.tilemap({ key: 'map' })

    const tileset = map.addTilesetImage('tileset', 'tileset', 32, 32, 0, 0)

    if (tileset === null) {
      throw new Error('tileset is null')
    }

    // Note: order matters (reverse of what you see in Tiled)
    this.groundLayer = map.createLayer('Ground', tileset)
    this.waxLayer = map.createLayer('Wax', tileset)
    this.doorsLayer = map.createLayer('Doors', tileset)
    this.treesLayer = map.createLayer('Trees', tileset)

    if (this.groundLayer === null) {
      throw new Error('Ground Layer is null.')
    }

    this.groundLayer.setCollisionByProperty({ collides: true })



    this.candleman = new Candleman(this, 100, 100)



    // Collisions
    // this.physics.add.collider(this.candleman, this.groundLayer)
  }
}
