import Phaser from 'phaser'
import PreloaderScene from './scenes/PreloaderScene'
import MainScene from './scenes/MainScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    width: 400,
    height: 800,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      // debug: true,
    },
  },
  scene: [PreloaderScene, MainScene],
  roundPixels: true, // <-- 设置roundPixels为true
}

const game = new Phaser.Game(config)
export default game
