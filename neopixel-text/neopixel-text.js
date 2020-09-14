import NeoPixel from 'neopixel';
import Timer from 'timer';
import characterTable from 'character_5x5';

export default class NeoPixelText extends NeoPixel {
  #cBK
  #cRD

  constructor(dictionary) {
    super(dictionary);
    this.#cBK = super.makeRGB(0, 0, 0);
    this.#cRD = super.makeRGB(255, 0, 0);
    Timer.delay(100);
  }
  setCharacter(character = ' ', color = this.#cRD) {
    let cp = character.charCodeAt();
    let matrix = characterTable[cp];
    for (let i = 0; i < super.length; i++) {
      super.setPixel(i, (matrix >> (super.length - 1 - i) & 1) ? color : this.#cBK);
    }

    super.update();
  }
  setText(text = " ", color, duraioin = 500, interval = 100) {
    for (let i = 0; i < text.length; i++) {
      this.setCharacter(text[i], color);
      Timer.delay(duraioin);

      super.fill(this.#cBK);
      super.update();
      Timer.delay(interval);
    }
  }
  scrollText(text = "", color = this.#cRD, direction = "left", speed = "200") {
    text = " " + text;
    for (let p = 0; p < text.length; p++) {
      let c = text[p];
      let n = (p != text.length - 1) ? text[p + 1] : " ";
      let c_mtrx = characterTable[c.charCodeAt()];
      let n_mtrx = characterTable[n.charCodeAt()];

      switch (direction) {
        case "left":
          for (let t = 0; t <= 5; t++) {
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
            Timer.delay(speed);
          }
          break;
        default:
          break;
      }
    }
  }
}
