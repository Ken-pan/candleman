import Candleman from '../objects/Candleman'

export default class MainScene extends Phaser.Scene {
  plateforms!: Phaser.Physics.Arcade.StaticGroup
  player!: Phaser.Physics.Arcade.Sprite
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  ghost!: Phaser.Physics.Arcade.Group
  mainCamera!: Phaser.Cameras.Scene2D.Camera
  mask!: Phaser.GameObjects.Graphics
  uiScene!: any

  // Layers
  groundLayer!: Phaser.Tilemaps.TilemapLayer | null
  waxLayer!: Phaser.Tilemaps.TilemapLayer | null
  doorsLayer!: Phaser.Tilemaps.TilemapLayer | null
  treesLayer!: Phaser.Tilemaps.TilemapLayer | null
  candleman!: Candleman
  darkmask!: any
  light!: any
  foodGroup!: Phaser.Physics.Arcade.StaticGroup
  food!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

  constructor() {
    super({ key: 'MainScene' })
    console.log("I'm inside my MainScene")
  }

  preload() {}

  create() {
    const map = this.make.tilemap({ key: 'map' })
    this.uiScene = this.scene.get('UIScene')

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
    this.waxLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    })
    this.doorsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    })
    this.treesLayer.renderDebug(debugGraphics, {
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

    this.createSpotlight()

    this.foodGroup = this.physics.add.staticGroup()
    const foodObjects = map.createFromObjects('Wax', [{ id: 75, key: 'food' }])
    this.foodGroup.addMultiple(foodObjects as Phaser.GameObjects.GameObject[])
    // log the foodGroup
    console.log(this.foodGroup)

    this.createFood(200, 200)
    this.createFood(300, 300)
    this.createFood(400, 400)
  }

  update() {
    this.light.x = this.candleman.x
    this.light.y = this.candleman.y

    // throw an error if this.input.keyboard is null
    if (this.input.keyboard === null) {
      throw new Error('keyboard is null')
    }
    //if user click the space, the candleman will light up
    if (this.input.keyboard.addKey('SPACE').isDown) {
      alert('Candleman light up')
    }

    // // log the Collision element
    // if (this.waxLayer === null) {
    //   throw new Error('waxLayer is null')
    // }
    // this.physics.overlap(
    //   this.candleman,
    //   this.foodGroup,
    //   this.handleFoodCollision
    // )
  }

  private createFood(x: number, y: number) {
    const food = this.physics.add.sprite(x, y, 'tile', 75)
    food.setOrigin(0, 0)
    food.setDisplaySize(32, 32)
    food.setCollideWorldBounds(true)
    food.setBounce(1, 1)
    food.setImmovable(true)
    food.setInteractive()

    this.physics.add.collider(this.candleman, food, () => {
      console.log('Candleman eats food!')
      this.uiScene.wax += 100
      food.destroy()
    })

    return food
  }

  createGhost(position: Phaser.Math.Vector2) {
    const ghost = this.physics.add.sprite(position.x, position.y, 'ghost')
    ghost.setCollideWorldBounds(true)
    ghost.setBounce(1, 1)
    ghost.setImmovable(true)
    ghost.setInteractive()

    // Set up collision between the ghost and the world layers
    // this.physics.add.collider(ghost, this.groundLayer)
    // this.physics.add.collider(ghost, this.waxLayer)
    // this.physics.add.collider(ghost, this.doorsLayer)
    // this.physics.add.collider(ghost, this.treesLayer)

    // Set up movement towards the candleman
    this.physics.moveToObject(ghost, this.candleman, 100)

    // Return the ghost object
    return ghost
  }

  handleFoodCollision() // food: Phaser.Physics.Arcade.Sprite, // candleman: Candleman,
  {
    // 让食物消失
    // food.destroy()
    // 让 Candleman 吃掉食物
    // this.candleman.eatFood()
    console.log('Candleman eats food!')
  }
  // eatFood() {

  // }

  createSpotlight() {
    // Create the darkmask if it doesn't exist
    if (!this.darkmask) {
      this.darkmask = this.add.graphics()
      this.darkmask.fillStyle(0x000000, 1)
      this.darkmask.setDepth(1)
      this.darkmask.setAlpha(0.6)
      this.darkmask.setBlendMode(Phaser.BlendModes.MULTIPLY)
    }

    // Create the light if it doesn't exist
    if (!this.light) {
      this.light = this.add.graphics()
      this.light.fillStyle(0xffffff, 1)
      this.light.setDepth(2)
    }

    // Clear the darkmask and redraw it
    this.darkmask.clear()
    this.darkmask.fillRect(
      0,
      0,
      this.game.scale.width * 2,
      this.game.scale.height * 2,
    )

    // Add the light as a child of the scene and clear it
    this.add.existing(this.light)
    this.light.clear()

    // Draw the light and set its blend mode
    this.light.fillCircle(0, 0, 120)
    this.light.setBlendMode(Phaser.BlendModes.ADD)

    // Create a geometry mask using the darkmask and set it on the light
    const mask = new Phaser.Display.Masks.GeometryMask(this, this.darkmask)
    this.light.setMask(mask)

    // Create a circular mask to show only the center of the light
    const maskGraphics = this.add.graphics()
    maskGraphics.fillStyle(0xffffff, 1)
    maskGraphics.fillCircle(0, 0, 120)
    maskGraphics.setScrollFactor(1)
    maskGraphics.setDepth(1)
    maskGraphics.setAlpha(0.2)
    maskGraphics.setBlendMode(Phaser.BlendModes.MULTIPLY)
    this.mask = maskGraphics
  }
}
