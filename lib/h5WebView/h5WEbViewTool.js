import ZetrixWalletConnect from '../h5WebView/index.js'
import NativeMethods from '../h5WebView/externalProvision/native/index.js'
class h5WebView {
  constructor () {
    this.zetrixWalletConnect = new ZetrixWalletConnect()
    window.ZetrixWalletConnect = this.zetrixWalletConnect
    let nativeMethods = new NativeMethods()
    this.apis = {
      native: {
        clientEncryption: nativeMethods.clientEncryption,
        clientDecrypt: nativeMethods.clientDecrypt,
        closeDapp: nativeMethods.closeDapp,
        getPreloadParams: nativeMethods.getPreloadParams
      }
    }
  }
  auth (params={}) {
      return new Promise((resolve, reject) => {
        try {
          this.zetrixWalletConnect.auth(params, (res) => {
            console.log(res, 'resres');
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
  signMessage (params) {
    return new Promise((resolve, reject) => {
      try {
        this.zetrixWalletConnect.signMessage(params, (res) => {
          console.log(res, '------->');
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
  signBlob (params) {
    return new Promise((resolve, reject) => {
      try {
        this.zetrixWalletConnect.signBlob(params, (res) => {
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
  sendTransaction (params) {
    return new Promise((resolve, reject) => {
      try {
        this.zetrixWalletConnect.sendTransaction(params, (res) => {
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
  getNonce (params) {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.zetrixWalletConnect.getNonce(params))
      } catch (e) {
        reject(e)
      }
    })
  }
  verifyVC (params) {
    return new Promise((resolve, reject) => {
      try {
        this.zetrixWalletConnect.verifyVC(params, (res) => {
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
  getVP (params) {
    return new Promise((resolve, reject) => {
      try {
        this.zetrixWalletConnect.getVP(params, (res) => {
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
}

export default h5WebView
