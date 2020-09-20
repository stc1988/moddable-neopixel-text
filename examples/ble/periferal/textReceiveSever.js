import BLEServer from 'bleserver';
import { uuid } from 'btutils';

const DEVICE_NAME = 'SendText';
const SERVICE_UUID = 'ca9b02ae-d7cf-4d77-9495-fbacc2757355';

class TextReceiveSever extends BLEServer {
  onReady () {
    this.text = '';
    this.deviceName = DEVICE_NAME;
    this.onDisconnected();
  }
  onConnected (connection) {
    this.stopAdvertising();
  }
  onDisconnected (connection) {
    this.startAdvertising({
      advertisingData: {
        flags: 6,
        completeName: DEVICE_NAME,
        completeUUID128List: [uuid([SERVICE_UUID])]
      }
    })
  }
  onCharacteristicWritten (params, value) {
    if (params.name === 'text') {
      const strValue = String.fromArrayBuffer(value)
      if (strValue === '\r') {
        if (typeof this.onTextChange === 'function') {
          this.onTextChange(this.text)
        }
        this.text = ''
      }
      this.text += strValue
    }
  }
}

export default TextReceiveSever