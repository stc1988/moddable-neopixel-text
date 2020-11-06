
import TextExchangeClient from 'textExchangeClient';
import { Application, Style, Skin, Label } from 'piu/MC'

const application = new Application(null, {
  contents: [
    new Label(null, {
      style: new Style({ font: 'OpenSans-Regular-52', color: 'white' }),
      skin: new Skin({ fill: 'black' }),
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      string: '-'
    })
  ]
});
function onStatusChange(text) {
  trace(text+"\n");
  application.first.string = text;
}
const client = new TextExchangeClient(onStatusChange);

global.button.a.onChanged = function () {
  const v = this.read()
  if (!v) {
      client.sendText('A');
      application.first.string = String('A');
  }
}
global.button.b.onChanged = function () {
    const v = this.read()
    if (!v) {
      client.sendText('B');
      application.first.string = String('B');
    }
}
global.button.c.onChanged = function () {
    const v = this.read()
    if (!v) {
      client.sendText('C');
      application.first.string = String('C');
    }
}