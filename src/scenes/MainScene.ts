import Candleman from '../objects/Candleman'
let waxIsRunning = true
let waxRate = 1/60

export default class MainScene extends Phaser.Scene {
  plateforms!: Phaser.Physics.Arcade.StaticGroup
  player!: Phaser.Physics.Arcade.Sprite
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  ghost!: Phaser.Physics.Arcade.Group
  waxBar!: Phaser.GameObjects.Graphics
  waxBarBackground!: Phaser.GameObjects.Graphics
  wax = 100
  scoreUI!: Phaser.GameObjects.Text
  mainCamera!: Phaser.Cameras.Scene2D.Camera
  mask!: Phaser.GameObjects.Graphics

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

    // UI
    const uiContainer = this.add.container(0, 0)
    uiContainer.setScrollFactor(1)

    // Wax bar
    this.waxBar = this.add.graphics()
    this.waxBar.fillStyle(0xff0000, 1)
    this.waxBar.fillRect(10, 10, 200, 20)
    this.waxBar.setScrollFactor(0)
    this.waxBar.setDepth(100)
    uiContainer.add(this.waxBar)

    // Wax bar background
    this.waxBarBackground = this.add.graphics()
    this.waxBarBackground.fillStyle(0x000000, 0.5)
    this.waxBarBackground.fillRect(10, 10, 200, 20)
    this.waxBarBackground.setScrollFactor(0)
    this.waxBarBackground.setDepth(99)
    uiContainer.add(this.waxBarBackground)

    //UI
    this.scoreUI = this.add.text(16, 13, `WAX: ${this.wax}`, {
      fontSize: '16px',
      color: '#fff',
    })
    this.scoreUI.setDepth(100)
    this.scoreUI.setScrollFactor(0)
    uiContainer.add(this.scoreUI)

    // Position the container
    uiContainer.setPosition(0, 0)
  }
  update() {
    this.candleman.update()
    const mainCamera = this.cameras.main

    // create dark mask


    // this.mask.clear()
    // this.mask = this.add.graphics()
    // this.mask.fillStyle(0xff0000, 1)
    // this.mask.visible = false
    // this.cameras.main.setMask(new Phaser.Display.Masks.GeometryMask(this, this.mask))
    this.mask.setDepth(1)
    this.mask.x = this.candleman.x - mainCamera.scrollX
    this.mask.y = this.candleman.y - mainCamera.scrollY
    console.log(`mask's position: x:${ this.mask.x }, y:${ this.mask.y }}`)

    this.waxBar.clear()
    this.waxBar.fillStyle(0xff0000, 1)
    this.waxBar.fillRect(0, 0, this.wax * 2, 20)
    this.waxBar.setScrollFactor(0)
    this.waxBar.setDepth(100)
    this.waxBar.x = 10
    this.waxBar.y = 10

    // Wax timer
    this.time.addEvent({
      delay: 100, // 1 second
      callback: () => {
        if (!waxIsRunning) return
        this.wax -= 1 * waxRate
        if (this.wax <= 0) {
          // Game over
          alert('Game over')
          waxIsRunning = false
        } else {
          this.waxBar.clear()
          this.waxBar.fillStyle(0xff0000, 1)
          this.waxBar.fillRect(10, 10, this.wax * 2, 20)
          this.scoreUI.setText(`WAX: ${Math.floor(this.wax)}`)

        }
      },
      loop: false,
    })

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
