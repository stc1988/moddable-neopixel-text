import Timer from 'timer';
import characterTable from 'character_5x5';

export default class NeoPixelText {
  #neopixel
  #cBK
  #cRD
  #textTimer

  constructor(neopixel) {
    this.#neopixel = neopixel;
    this.#cBK = neopixel.makeRGB(0, 0, 0);
    this.#cRD = neopixel.makeRGB(255, 0, 0);
    this.#textTimer = {running: false, id: null};
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
    let neopixel = this.#neopixel
    let cp = character.charCodeAt();
    let matrix = characterTable[cp];
    for (let i = 0; i < neopixel.length; i++) {
      neopixel.setPixel(i, (matrix >> (neopixel.length - 1 - i) & 1) ? color : this.#cBK);
    }

    neopixel.update();
  }
  async setText(text = " ", dictionary) {
    let neopixel = this.#neopixel;
    let options = {
      color: this.#cRD,
      duration: 500,
      interval: 100,
      loop: false,
      ...dictionary,
    }

    // If this function called while running, stop running and wait until stop complete. 
    if(this.#textTimer.id) {
      this.#timerClear();
      await this.#wait(options.interval);
    }

    return new Promise((resolve, reject) => {
      let count = 0;
      this.#textTimer.running = true;
      this.#textTimer.id = Timer.repeat(id =>{
        if(!this.#textTimer.running) {
          reject();
          this.#timerClear();
        } else {
          this.setCharacter(text[count], options.color);
          Timer.delay(options.duration);
    
          neopixel.fill(this.#cBK);
          neopixel.update();

          if(count++ == text.length) {
            resolve();
            this.#timerClear();
          }
        }
      }, options.interval);
    });
  }
  async scrollText(text = "", dictionary) {
    let neopixel = this.#neopixel;
    let options = {
      color: this.#cRD,
      speed: 500,
      direction: "left",
      loop: false,
      ...dictionary,
    }
    text = ` ${text} `;

    // If this function called while running, stop running and wait until stop complete.
    if(this.#textTimer.id) {
      this.#timerClear();
      await this.#wait(options.speed);
    }

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

          for (let i = 0; i < neopixel.length; i++) {
            if ((i % 5) == (5 - t)) {
              neopixel.setPixel(i, this.#cBK);
            } else if ((i % 5) < (5 - t)) {
              neopixel.setPixel(i, ((c_mtrx << t) >> (neopixel.length - 1 - i) & 1) ? options.color : this.#cBK);
            } else {
              neopixel.setPixel(i, ((n_mtrx >> (5 - t + 1)) >> (neopixel.length - 1 - i) & 1) ? options.color : this.#cBK);
            }
          }
          neopixel.update();

          if(t++ == 5) {
            t = 0;
            if(p++ == text.length - 2) {
              resolve();
              this.#timerClear();
            }
          }
        }
      }, options.speed);
    });
  }
  stop() {
    if(this.#textTimer.id) {
      this.#textTimer.running = false;
    }
  }
}
