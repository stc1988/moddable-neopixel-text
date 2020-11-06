import BLEClient from "bleclient";
import { uuid } from 'btutils';
import Timer from 'timer';

const TE_SERVICE_UUID = uuid`3369dff5-f425-4af4-9821-64f2cb52369e`
const TE_CHARACTERISTIC_UUID = uuid`f4c36543-c8d0-452c-ad1f-994ccd5ac4a2`

class TextExchangeClient extends BLEClient {
	constructor(onStatusChange) {
		super();
		this.onStatusChange = onStatusChange;
	}
	onReady() {
		this.OnEvent("ready");
		this.onDisconnected();
	}
	onDiscovered(device) {
		if (device.scanResponse.completeName=="Text") {	
			this.OnEvent("discover");
			this.stopScanning();
			this.connect(device);
		}
	}
	onConnected(device) {
		this.OnEvent("connect");
		device.discoverPrimaryService(TE_SERVICE_UUID);
	}
	onDisconnected() {
		this.OnEvent("disconnect");
		Timer.delay(500);
		this.characteristic = null;
		this.startScanning();
		this.OnEvent("scanning");
	}
	onServices(services) {
		let service = services.find(service => service.uuid.equals(TE_SERVICE_UUID));
		if (service) {
			this.OnEvent("onServices");
			service.discoverCharacteristic(TE_CHARACTERISTIC_UUID);
		}
	}
	onCharacteristics(characteristics) {
		let characteristic = characteristics.find(characteristic => characteristic.uuid.equals(TE_CHARACTERISTIC_UUID));
		if (characteristic) {
			this.OnEvent("enable");
			this.characteristic = characteristic;
			this.characteristic.enableNotifications();
		}
	}
	onCharacteristicNotificationEnabled(characteristic) {
		this.OnEvent("notify");
	}
	onCharacteristicNotification(characteristic, buffer) {
		this.OnEvent("notification");
		const strValue = String.fromArrayBuffer(buffer);
		this.OnEvent(strValue);
	}
	sendText(text) {
		if(this.characteristic) {
			this.characteristic.writeWithoutResponse(ArrayBuffer.fromString(text));
		}
	}
	OnEvent (value) {
		if (typeof this.onStatusChange === 'function') {
		  this.onStatusChange(value);
		}
	}
}

export default TextExchangeClient;


