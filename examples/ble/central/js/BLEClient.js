const DEVICE_NAME = 'SendText'
const SERVICE_UUID = 'ca9b02ae-d7cf-4d77-9495-fbacc2757355'
const CHARACTERISTIC_UUID = 'ca99fa68-c704-485e-9bae-beaceb78f11c'

class BLEClient {
  consturctor () {
    this.isConnected = false
    this.connectedCharacteristic = null
  }
  async sendText (text) {
    const encoder = new TextEncoder('utf-8')
    if (!this.isConnected) {
      return
    }
    const characteristic = this.connectedCharacteristic
    const buf = encoder.encode(text)
    const PACKET_LENGTH = 18
    let idx = 0
    while (true) {
      const subBuf = buf.slice(idx, idx + PACKET_LENGTH)
      if (subBuf.length === 0) {
        break
      }
      try {
        await characteristic.writeValue(subBuf)
      } catch (e) {
        console.error(e)
      }
      idx += PACKET_LENGTH
    }
    await characteristic.writeValue(encoder.encode('\r'))
  }

  async connect () {
    if (navigator.bluetooth == null) {
      console.warn('bluetooth not available')
      return
    }
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: false,
        filters: [{ name: DEVICE_NAME }, { services: [SERVICE_UUID] }]
      })
      device.addEventListener('gattserverdisconnected', () => {
        this._onDisconnected()
      })
      const server = await device.gatt.connect()
      const service = await server.getPrimaryService(SERVICE_UUID)
      const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID)
      this._onConnected(characteristic)
    } catch (e) {
      console.log(e)
    }
  }

  _onConnected (characteristic) {
    this.isConnected = true
    this.connectedCharacteristic = characteristic
    if (this.onConnected != null && typeof this.onConnected === 'function') {
      this.onConnected(characteristic)
    }
  }

  _onDisconnected () {
    this.isConnected = false
    this.connectedCharacteristic = null
    if (
      this.onDisconnected != null &&
      typeof this.onDisconnected === 'function'
    ) {
      this.onDisconnected()
    }
  }
}

export default BLEClient