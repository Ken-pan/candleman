import Phaser from 'phaser'
import PreloaderScene from './scenes/PreloaderScene'
import GameStartScene from './scenes/GameStartScene'
import MainScene from './scenes/MainScene'
import UIScene from './scenes/UIScene'
import GameOverScene from './scenes/GameOverScene'
import GameWinScene from './scenes/GameWinScene'


const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    width: 400,
    height: 800,
    parent: 'phaser-game', // 添加 parent 属性
    autoCenter: Phaser.Scale.CENTER_BOTH, // 游戏画面居中
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      // debug: true,
    },
  },
  scene: [
    PreloaderScene,
    GameStartScene,
    MainScene,
    UIScene,
    GameOverScene,
    GameWinScene,
  ],
  roundPixels: true, // <-- 设置roundPixels为true
}

const game = new Phaser.Game(config)
export default game
