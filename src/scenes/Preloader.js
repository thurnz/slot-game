import imgBg from '../assets/images/Background.png';
import imgBanana from '../assets/images/Banana.png';
import imgBlackberry from '../assets/images/Blackberry.png';
import imgCherry from '../assets/images/Cherry.png';
import imgSpin from '../assets/images/Spin.png';
import imgWin from '../assets/images/Win.png';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('bg', imgBg);
    this.load.image('banana', imgBanana);
    this.load.image('blackberry', imgBlackberry);
    this.load.image('cherry', imgCherry);
    this.load.image('spin', imgSpin);
    this.load.image('win', imgWin);
  }

  create() {
    this.scene.stop();
		this.scene.start('game');
  }
}