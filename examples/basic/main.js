import NeoPixelText from 'neopixel-text';

let npt = new NeoPixelText(global.lights);

const str = "HELLOWORLD";
let running  = false;

function scrollText(str) {
    running = true;
    trace("start\n");
    npt.scrollText(str).then(
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
            npt.stop();
        } else {
            scrollText(str);
        }
    }
}

scrollText(str);





