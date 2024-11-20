class NativeMethods {
  clientEncryption (params) {
    return new Promise((resolve, reject) => {
      try {
        window.ZetrixWalletConnect.apis.native.clientEncryption(params, (res) => {
          if (res.code == '0') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }
  clientDecrypt (params) {
    return new Promise((resolve, reject) => {
      try {
        window.ZetrixWalletConnect.apis.native.clientDecrypt(params, (res) => {
          if (res.code == '0') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }
  closeDapp (params={}) {
    return new Promise((resolve, reject) => {
      try {
        window.ZetrixWalletConnect.apis.native.closeDapp(params, (res) => {
          if (res.code == '0') {
            resolve(res)
          } else {
            reject(res)
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }
  getPreloadParams () {
    return new Promise((resolve, reject) => {
      try {
        let p = window.ZetrixWalletConnect.apis.native.getPreloadParams()
        resolve(p)
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default NativeMethods