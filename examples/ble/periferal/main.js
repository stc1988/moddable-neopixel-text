import NeoPixelText from 'neopixel-text';
import TextReceiveSever from 'textReceiveSever';

const server = new TextReceiveSever()
server.onTextChange = text => {
  trace(text+"\n");
  scrollText(text);
}

let led = new NeoPixelText({});

let running  = false;

function scrollText(str) {
    running = true;
    trace("start\n");
    led.scrollText(str).then(
        () => {
            trace("done\n");
            running = false
        },
        () => {
            trace("stop\n");
            running = false
        },
    );
}

global.button.a.onChanged = function () {
    const v = this.read();
    if(v){
        if(running){
            led.stop();
        }
    }
}






