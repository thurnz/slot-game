import imgCheatBg from '../assets/images/CheatToolBackground.png';
import imgCheatInput from '../assets/images/CheatToolInput.png';
import imgArrow from '../assets/images/Arrow.png';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');

    this.curTime = 0;
    this.aReel0 = ['banana', 'cherry', 'blackberry', 'cherry', 'blackberry', 'banana'];
    this.aReel1 = ['blackberry', 'banana', 'banana', 'blackberry', 'cherry', 'cherry'];
    this.aReel2 = ['cherry', 'blackberry', 'banana', 'cherry', 'banana', 'blackberry'];
    this.result = [-1, -1, -1];
  }

  create() {
    this.reel0 = this.add.group().setActive(false);
    this.reel1 = this.add.group().setActive(false);
    this.reel2 = this.add.group().setActive(false);
    this.addReel(this.reel0, 395, this.aReel0);
    this.addReel(this.reel1, 786, this.aReel1);
    this.addReel(this.reel2, 1177, this.aReel2);

    this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'bg').setDisplaySize(this.game.config.width, this.game.config.height);

    this.win = this.add.image(this.game.config.width / 2, 200, 'win').setVisible(false);

    this.spin = this.add.image(this.game.config.width / 2, this.game.config.height - 150, 'spin').setInteractive({useHandCursor: true}).setState('stop');

    let el = `
      <div style="width: 459px; height: 256px; background: url(` + imgCheatBg + `) center no-repeat; position: absolute;">
        <div style="width: 100%; margin-top: 30px; text-align: center; font-size: 24px; color: #fff; font-family: sans-serif;">SYMBOL POSITION IN THE REEL</div>
        <form style="margin: 5px 60px;">
          <input type="text" id="reel0" min="0" max="5" maxLength="1" value="0" style="width: 102px; height: 52px; background: url(` + imgCheatInput + `) center no-repeat; color: #fff; font-size: 24px; text-align: center; border: 0 none;" />
          <input type="text" id="reel1" min="0" max="5" maxLength="1" value="0" style="width: 102px; height: 52px; background: url(` + imgCheatInput + `) center no-repeat; color: #fff; font-size: 24px; text-align: center; border: 0 none;" />
          <input type="text" id="reel2" min="0" max="5" maxLength="1" value="0" style="width: 102px; height: 52px; background: url(` + imgCheatInput + `) center no-repeat; color: #fff; font-size: 24px; text-align: center; border: 0 none;" />
        </form>
        <div style="position: absolute; left: 55px; bottom: 13px; text-align: left; font-size: 28px; color: #fff; font-family: sans-serif;">Tools</div>
        <div id="arrow" style="position: absolute; left: 150px; bottom: 23px; width: 34px; height: 15px; background: url(` + imgArrow + `) center no-repeat;"></div>
        <div id="tools" style="position: absolute; left: 35px; bottom: 0; width: 180px; height: 60px; cursor: pointer;"></div>
      </div>
    `;
    this.tools = this.add.dom(0, -208).createFromHTML(el).setOrigin(0, 0).setState(0);

    this.tools.addListener('click');
    this.tools.addListener('input');

    this.tools.on('click', e => {
      if(e.target.id === 'tools'){
        if(!this.tools.state){
          this.tools.setState(1);
          this.tools.getChildByID('arrow').style.transform = 'rotate(180deg)';
          this.tweens.add({targets: this.tools, y: 0, duration: 250});
        }else{
          this.tools.setState(0);
          this.tools.getChildByID('arrow').style.transform = 'rotate(0)';
          this.tweens.add({targets: this.tools, y: -208, duration: 250});
          this.reset();
        }
      }
    });

    this.tools.on('input', e => {
      this.result[parseInt(e.target.id.substr(-1))] = this.checkNumber(e.target.value) % 6;
    });

    this.input.mouse.disableContextMenu();

    this.spin.on('pointerup', this.spinHandler);
  }

  update(time, delta) {
    if(this.spin.state === 'spin'){
      if(this.curTime === 0){
        this.curTime = time;
        this.result = this.draw();
        this.activate();
      }else if(time > this.curTime + 1300){
        for(let i = 0; i < 3; i++){
          if(this['reel' + i].active){
            const child = this['reel' + i].getChildren()[this.result[i]];
            if(child.y >= 289 && child.y < 389){
              this['reel' + i].setActive(false);
              child.y = 289;
              if(i === 2){
                this.checkWinner();
              }
            }
            break;
          }
        }
      }
      const speed = delta * 4;
      for(let i = 0; i < 3; i++){
        if(this['reel' + i].active) this.moveReel(this['reel' + i], speed);
      };
    }
  }

  spinHandler(e) {
    this.disableInteractive().setAlpha(0.5).setState('spin');
  }

  activate(){
    this.reel0.setActive(true);
    this.reel1.setActive(true);
    this.reel2.setActive(true);
  }

  checkNumber(n){
    return isNaN(n) ? -1 : parseInt(n);
  }

  checkWinner() {
    let delay = 0;
    if(this.aReel0[this.result[0]] === this.aReel1[this.result[1]] && this.aReel1[this.result[1]] === this.aReel2[this.result[2]]){
      this.win.setVisible(true);
      delay = 1000;
    };
    setTimeout(() => {
      this.reset();
    }, delay);
  }

  reset() {
    if(!this.tools.state) this.result = [-1, -1, -1];
    this.win.setVisible(false);
    this.curTime = 0;
    this.spin.setInteractive().clearAlpha().setState('stop');
  }

  draw() {
    let a = [];
    this.result.forEach(value => {
      if(value < 0){
        a.push(Math.floor(Math.random() * 6));
      }else{
        a.push(value);
      }
    });
    return a;
  }

  addReel(group, x, arr) {
    arr.forEach(value => {
      const reel =  this.add.image(x, this.getMinY(group, 289), value).setOrigin(0, 0).setName(value);
      group.add(reel);
    });
  }

  moveReel(group, n) {
    group.getChildren().forEach(child => {
			child.y += n;
      if(child.y > 744){
        child.y = this.getMinY(group, 0);
      }
		});
  }

  getMinY(group, startY) {
    if(!group.getLength()) return startY;
		let y = this.game.config.height;
		group.getChildren().forEach(child => {
			y = Math.min(y, child.y - child.height);
		});
		return y;
  }
}