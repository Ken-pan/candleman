import Candleman from '../objects/Candleman'

export default class MainScene extends Phaser.Scene {
  plateforms!: Phaser.Physics.Arcade.StaticGroup
  player!: Phaser.Physics.Arcade.Sprite
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  ghost!: Phaser.Physics.Arcade.Group
  mainCamera!: Phaser.Cameras.Scene2D.Camera
  mask!: Phaser.GameObjects.Graphics

  // Layers
  groundLayer!: Phaser.Tilemaps.TilemapLayer | null
  waxLayer!: Phaser.Tilemaps.TilemapLayer | null
  doorsLayer!: Phaser.Tilemaps.TilemapLayer | null
  treesLayer!: Phaser.Tilemaps.TilemapLayer | null
  candleman!: Candleman

  constructor() {
    super({ key: 'MainScene' })
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
    console.log(this)
    if (this.groundLayer === null) {
      throw new Error('Ground Layer is null.')
    }
    if (this.waxLayer === null) {
      throw new Error('Wax Layer is null.')
    }
    if (this.doorsLayer === null) {
      throw new Error('Doors Layer is null.')
    }
    if (this.treesLayer === null) {
      throw new Error('Trees Layer is null.')
    }

    // this.groundLayer.setCollisionByProperty({ collides: true })
    this.waxLayer.setCollisionByProperty({ collides: true })
    this.doorsLayer.setCollisionByProperty({ collides: true })
    // this.treesLayer.setCollisionByProperty({ collides: true })

    const debugGraphics = this.add.graphics().setAlpha(0.75)

    this.groundLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    })

    this.candleman = new Candleman(this, 100, 100)
    this.add.existing(this.candleman)

    // Collisions
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.physics.add.collider(this.candleman, this.groundLayer)
    this.physics.add.collider(this.candleman, this.waxLayer)
    this.physics.add.collider(this.candleman, this.doorsLayer)
    this.physics.add.collider(this.candleman, this.treesLayer)

    // Camera
    this.mainCamera = this.cameras.main
    this.mainCamera.startFollow(this.candleman)
    // camera.setZoom(1.5)
    this.mainCamera.setFollowOffset(0, 0)
    this.mainCamera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

    // mask
    this.mask = this.add.graphics()
    this.mask.fillStyle(0x000000, 1)
    this.mask.fillCircle(0, 0, 120)
    this.mask.setScrollFactor(1)
    this.mask.setDepth(1)
    this.mask.setAlpha(0.2)
    this.mask.setBlendMode(Phaser.BlendModes.MULTIPLY)
  }

  update() {
    // this.candleman.update()

    // create dark mask

    // this.mask.clear()
    // this.mask = this.add.graphics()
    // this.mask.fillStyle(0xff0000, 1)
    // this.mask.visible = false
    // this.cameras.main.setMask(new Phaser.Display.Masks.GeometryMask(this, this.mask))
    this.mask.setDepth(1)
    this.mask.x = this.candleman.x - this.cameras.main.scrollX
    this.mask.y = this.candleman.y - this.cameras.main.scrollY
    console.log(`mask's position: x:${this.mask.x}, y:${this.mask.y}}`)

    //if user click the space, the candleman will light up
    // throw an error if this.input.keyboard is null

    if (this.input.keyboard === null) {
      throw new Error('keyboard is null')
    }

    if (this.input.keyboard.addKey('SPACE').isDown) {
      alert('Candleman light up')
    }
  }
}
