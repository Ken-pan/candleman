import Candleman from '../objects/Candleman'

export default class MainScene extends Phaser.Scene {
  plateforms!: Phaser.Physics.Arcade.StaticGroup
  player!: Phaser.Physics.Arcade.Sprite
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  ghosts!: Phaser.Physics.Arcade.Group
  ghost!: Phaser.Physics.Arcade.Sprite
  mainCamera!: Phaser.Cameras.Scene2D.Camera
  mask!: Phaser.GameObjects.Graphics
  ghostSound!: Phaser.Sound.BaseSound
  eatSound!:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
  startBgm!:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound

  // Layers
  groundLayer!: Phaser.Tilemaps.TilemapLayer | null
  waxLayer!: Phaser.Tilemaps.TilemapLayer | null
  doorsLayer!: Phaser.Tilemaps.TilemapLayer | null
  treesLayer!: Phaser.Tilemaps.TilemapLayer | null
  candleman!: Candleman
  foodGroup!: Phaser.Physics.Arcade.StaticGroup
  food!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  map!: Phaser.Tilemaps.Tilemap

  filterRect!: Phaser.GameObjects.Graphics
  spotlightMask!: Phaser.GameObjects.Sprite

  constructor() {
    super({ key: 'MainScene' })
  }

  preload() {
    this.load.audio('backgroundMusic', '/assets/audio/excit.wav')
  }

  create() {
    this.addMusic()

    this.addMap()

    this.candleman = new Candleman(this, 70, 860)
    this.add.existing(this.candleman)

    this.mapCollision()

    this.addCamera()

    this.createDoor(650, 80)

    this.createSpotlight()

    this.addWaxFood()

    this.initialGhost()
  }

  update() {
    this.spotlightMask.x = this.candleman.x - this.cameras.main.scrollX
    this.spotlightMask.y = this.candleman.y - this.cameras.main.scrollY

    this.scene.get('UIScene').events.on('moveUp', () => {
      this.candleman.moveUp()
    })
    this.scene.get('UIScene').events.on('moveDown', () => {
      this.candleman.moveDown()
    })
    this.scene.get('UIScene').events.on('moveLeft', () => {
      this.candleman.moveLeft()
    })
    this.scene.get('UIScene').events.on('moveRight', () => {
      this.candleman.moveRight()
    })

    this.meetGhost()
  }

  private addMusic() {
    this.startBgm = this.sound.add('backgroundMusic', {
      loop: true,
      volume: 1,
    })
    this.startBgm.stop()
    this.startBgm.play()
    this.ghostSound = this.sound.add('ghostSound', {
      loop: false,
      volume: 0.4,
    })
    this.eatSound = this.sound.add('eatSound', {
      loop: false,
      volume: 0.3,
    })
  }

  private addMap() {
    this.map = this.make.tilemap({ key: 'map' })
    const tileset = this.map.addTilesetImage('tileset', 'tileset', 32, 32, 0, 0)

    if (tileset === null) {
      throw new Error('tileset is null')
    }
    this.groundLayer = this.map.createLayer('Ground', tileset)
    this.waxLayer = this.map.createLayer('Wax', tileset)
    this.doorsLayer = this.map.createLayer('Doors', tileset)
    this.treesLayer = this.map.createLayer('Trees', tileset)
  }

  private mapCollision() {
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

    this.waxLayer.setCollisionByProperty({ collides: true })
    this.doorsLayer.setCollisionByProperty({ collides: true })
    this.treesLayer.setCollisionByProperty({ collides: true })
    this.treesLayer.setDepth(3)

    const debugGraphics = this.add.graphics().setAlpha(0.01)

    this.groundLayer.renderDebug(debugGraphics, {
      tileColor: null,
    })
    this.waxLayer.renderDebug(debugGraphics, {
      tileColor: null,
    })
    this.doorsLayer.renderDebug(debugGraphics, {
      tileColor: null,
    })
    this.treesLayer.renderDebug(debugGraphics, {
      tileColor: null,
    })

    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
    )
    this.physics.add.collider(this.candleman, this.groundLayer)
    this.physics.add.collider(this.candleman, this.waxLayer)
    this.physics.add.collider(this.candleman, this.doorsLayer)
    this.physics.add.collider(this.candleman, this.treesLayer)
  }

  private addCamera() {
    this.mainCamera = this.cameras.main
    this.mainCamera.startFollow(this.candleman)
    this.mainCamera.setZoom(1.8)
    this.mainCamera.setFollowOffset(0, 0)
    this.mainCamera.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
    )
  }

  private createDoor(x: number, y: number) {
    const door = this.physics.add.sprite(x, y, 'door')
    door.setOrigin(0, 0)
    door.setDisplaySize(77, 82)
    door.setCollideWorldBounds(true)
    door.setBounce(1, 1)
    door.setImmovable(true)
    door.setInteractive()

    this.physics.add.collider(this.candleman, door, () => {
      // When user touch the dooer, play win scene
      this.scene.get('UIScene').waxIsRunning = false
      this.scene.stop('UIScene')
      this.scene.stop('MainScene')
      this.scene.start('GameWinScene')
    })

    return door
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
      this.eatSound.play()
      if (this.scene.get('UIScene').wax) {
        // Increase user's wax when they touch the food
        this.scene.get('UIScene').wax += 10
        this.scene.get('UIScene').updateWaxBar()
      }
      food.destroy()
    })

    return food
  }

  private createSpotlight() {
    this.spotlightMask = this.add.sprite(0, 0, 'spotlight_mask')
    this.spotlightMask.setBlendMode(Phaser.BlendModes.MULTIPLY)
    this.spotlightMask.setAlpha(0.7)
    this.spotlightMask.setDepth(999)
    this.spotlightMask.setOrigin(0.5, 0.5)
    this.spotlightMask.setScrollFactor(0)
  }

  private addWaxFood() {
    this.foodGroup = this.physics.add.staticGroup()
    const foodObjects = this.map.createFromObjects('Wax', [
      { id: 75, key: 'food' },
    ])

    this.foodGroup.addMultiple(foodObjects as Phaser.GameObjects.GameObject[])

    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, this.physics.world.bounds.width)
      const y = Phaser.Math.Between(0, this.physics.world.bounds.height)
      this.createFood(x, y)
    }
  }

  private createGhost(x: number, y: number): Phaser.Physics.Arcade.Sprite {
    const ghost = this.ghosts.create(
      x,
      y,
      'ghost',
    ) as Phaser.Physics.Arcade.Sprite
    ghost.setOrigin(0, 0)
    ghost.setCollideWorldBounds(true)
    ghost.setBounce(1, 1)
    ghost.setImmovable(true)
    ghost.setInteractive()

    // Set up movement towards the candleman
    this.physics.moveToObject(ghost, this.candleman, 60)

    // Return the ghost object
    return ghost
  }

  private initialGhost() {
    this.ghosts = this.physics.add.group()
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(0, this.physics.world.bounds.width)
      const y = Phaser.Math.Between(0, this.physics.world.bounds.height)
      this.createGhost(x, y)
    }
  }

  private meetGhost() {
    this.ghosts.children.iterate((ghost: Phaser.GameObjects.GameObject) => {
      const sprite = ghost as Phaser.Physics.Arcade.Sprite
      const distance = Phaser.Math.Distance.Between(
        sprite.x,
        sprite.y,
        this.candleman.x,
        this.candleman.y,
      )
      if (distance <= 130 && distance > 80) {
        sprite.alpha = 0.7 - ((distance - 80) / 50) * 0.7
        this.physics.moveToObject(sprite, this.candleman, 1)
      } else if (distance <= 80) {
        sprite.alpha = 1
        this.physics.moveToObject(sprite, this.candleman, 60)
        // play ghostSound
        this.ghostSound.play()
      } else {
        this.physics.moveToObject(sprite, this.candleman, 0)
        sprite.alpha = 0.05
      }
      return null
    })

    this.physics.overlap(this.candleman, this.ghosts, (candleman, ghost) => {
      // Reduce wax and destroy ghost
      if (!this.candleman.invincible) {
        this.scene.get('UIScene').wax -= 20
        this.scene.get('UIScene').updateWaxBar()
      }
      this.candleman.ghostCollide()
      ghost.destroy()

      // Create new ghost at a random position
      const x = Phaser.Math.Between(0, this.physics.world.bounds.width)
      const y = Phaser.Math.Between(0, this.physics.world.bounds.height)
      this.createGhost(x, y)
    })
  }
}
