import Phaser from 'phaser';
import Preloader from './scenes/Preloader';
import Game from './scenes/Game';

const config = {
  type: Phaser.AUTO,
  scale: {
    width: 1920,
    height: 1080,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#fff',
  parent: 'phaser-example',
  dom: {
    createContainer: true
  }, 
  scene: [Preloader, Game]
};

const game = new Phaser.Game(config);

document.body.style = 'background: #000; padding: 0; margin: 0;';
