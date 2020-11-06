import BLEServer from "bleserver";
import {uuid} from "btutils";
import Timer from 'timer';

const DEVICE_NAME = 'Text';
const TE_SERVICE_UUID = uuid`3369dff5-f425-4af4-9821-64f2cb52369e`

class TextExchangeServer extends BLEServer {
  constructor(onStatusChange, onCharacterChange) {
    super();
    this.onStatusChange = onStatusChange;
    this.onCharacterChange = onCharacterChange;
  }
	onReady() {
    this.deviceName = DEVICE_NAME;
    this.onDisconnected();
	}
	onConnected(connection) {
    this.OnEvent("connected");
		this.stopAdvertising();
	}
	onDisconnected (connection) {
    this.OnEvent("disconnected");
    Timer.delay(500);
		this.startAdvertising({
		  advertisingData: {
        flags: 6,
        completeName: DEVICE_NAME,
        completeUUID128List:[TE_SERVICE_UUID]
		  }
    })
    this.OnEvent("ready");
  }
  onCharacteristicNotifyEnabled(characteristic) {
    this.characteristic = characteristic
		this.OnEvent("notifyenabled");
	}
	onCharacteristicNotifyDisabled(characteristic) {
    this.characteristic = null;
		this.OnEvent("notifydisabled");
	}
  onCharacteristicWritten (params, value) {
    if (params.name === 'text') {
      const strValue = String.fromArrayBuffer(value);
      if (typeof this.onCharacterChange === 'function') {
        this.onCharacterChange(strValue);
      }
    }
  }
  sendText(text) {
		if(this.characteristic) {
			this.notifyValue(this.characteristic, (ArrayBuffer.fromString(text)));
		}
	}
  OnEvent (value) {
    if (typeof this.onStatusChange === 'function') {
      this.onStatusChange(value);
    }
  }
}

export default TextExchangeServer