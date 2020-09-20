import NeoPixel from 'neopixel';
import Timer from 'timer';
import characterTable from 'character_5x5';

export default class NeoPixelText extends NeoPixel {
  #cBK
  #cRD
  #textTimer

  constructor(dictionary) {
    super(dictionary);
    this.#cBK = super.makeRGB(0, 0, 0);
    this.#cRD = super.makeRGB(255, 0, 0);
    this.#textTimer = {running:false, id:null};
  }
  #wait(ms) {
    return new Promise(resolve => Timer.set(resolve, ms));
  }
  #timerClear() {
    Timer.clear(this.#textTimer.id);
    this.#textTimer.id = null;
    this.#textTimer.running = false;
  }
  setCharacter(character = ' ', color = this.#cRD) {
    let cp = character.charCodeAt();
    let matrix = characterTable[cp];
    for (let i = 0; i < super.length; i++) {
      super.setPixel(i, (matrix >> (super.length - 1 - i) & 1) ? color : this.#cBK);
    }

    super.update();
  }
  async setText(text = " ", color, duraioin = 500, interval = 100) {
    if(this.#textTimer.id) {
      this.#timerClear();
      await this.#wait(interval);
    }

    return new Promise((resolve, reject) => {
      let i = 0;
      this.#textTimer.running = true;
      this.#textTimer.id = Timer.repeat(id =>{
        if(!this.#textTimer.running) {
          reject();
          this.#timerClear();
        } else {
          this.setCharacter(text[i], color);
          Timer.delay(duraioin);
    
          super.fill(this.#cBK);
          super.update();

          if(i++ == text.length) {
            resolve();
            this.#timerClear();
          }
        }
      }, interval);
    });
  }
  async scrollText(text = "", color = this.#cRD, speed = "150", direction = "left") {
    if(this.#textTimer.id) {
      this.#timerClear();
      await this.#wait(speed);
    }

    text = " " + text + " ";
    return new Promise((resolve, reject) => {
      let p = 0;
      let t = 0;
      
      this.#textTimer.running = true;
      this.#textTimer.id = Timer.repeat(id =>{
        if(!this.#textTimer.running) {
          reject();
          this.#timerClear();
        } else {
          let c = text[p];
          let n = text[p + 1];
          let c_mtrx = characterTable[c.charCodeAt()];
          let n_mtrx = characterTable[n.charCodeAt()];

          for (let i = 0; i < super.length; i++) {
            if ((i % 5) == (5 - t)) {
              super.setPixel(i, this.#cBK);
            } else if ((i % 5) < (5 - t)) {
              super.setPixel(i, ((c_mtrx << t) >> (super.length - 1 - i) & 1) ? color : this.#cBK);
            } else {
              super.setPixel(i, ((n_mtrx >> (5 - t + 1)) >> (super.length - 1 - i) & 1) ? color : this.#cBK);
            }
          }
          super.update();

          if(t++ == 5) {
            t = 0;
            if(p++ == text.length - 2) {
              resolve();
              this.#timerClear();
            }
          }
        }
      }, speed);
    });
  }
  stop() {
    if(this.#textTimer.id) {
      this.#textTimer.running = false;
    }
  }
}
