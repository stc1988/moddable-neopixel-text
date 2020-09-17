import NeoPixelText from 'neopixel-text';

let led = new NeoPixelText({});

const str = "HELLOWORLD";
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
        } else {
            scrollText(str);
        }
    }
}

scrollText(str);





