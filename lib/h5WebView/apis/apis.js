import Native from './native'


class Apis {
  constructor() {
    this.native = {}
    let native = new Native()
    this.native.clientEncryption = native.clientEncryption
    this.native.clientDecrypt = native.clientDecrypt
    this.native.closeDapp = native.closeDapp
    this.native.getPreloadParams = native.getPreloadParams
  }
}

export default Apis