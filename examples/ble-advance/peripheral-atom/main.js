import NeoPixelText from 'neopixel-text';
import TextExchangeServer from 'textExchangeServer';

let led = new NeoPixelText({});
const server = new TextExchangeServer(onStatusChange, onCharacterChange);


global.button.a.onChanged = function () {
    const v = this.read();
    if(!v){
        led.setCharacter('N');
        server.sendText("notify");
    }
}
function onStatusChange(text) {
    trace(text+"\n");
    setBleStatus(text);
}
function onCharacterChange(character) {
    led.setCharacter(character);
}
function setBleStatus(status){
    let ble = [1,0,1,1,0,0,1,1,0,1,0,0,1,1,0,0,1,1,0,1,1,0,1,1,0,];
    let cBK = led.makeRGB(0, 0, 0);
    let color;

    switch(status) {
        case 'ready':
            color = led.makeRGB(0, 128, 0);
            break;
        case 'connected':
            color = led.makeRGB(0, 126, 244);
            break;
        case 'disconnected':
            color = led.makeRGB(255, 69, 0);
            break;
        case 'notifyenabled':
        case 'notifydisabled':
        default:
            return;
    }
    
    for(let i = 0; i<ble.length; i++) {
        led.setPixel(i, ble[i] ? color:cBK);
    }
    led.update();
}


