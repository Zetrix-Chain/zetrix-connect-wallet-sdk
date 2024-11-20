import { resultInfo } from '../../result'
import { useDevice, isJSON, resReturnedData, fixedRequestParameters, isAnObject, getUrlParameter } from '../../util'
import { webViewPoolName, storageName } from '../poolName'
let operatingSystem = useDevice()
class Native {
  constructor() {
    this.appType = sessionStorage.getItem('app_type')
  }
  clientEncryption (data, callback) {
    return new Promise((resolve, reject) => {
      // JSON DATA ?
      if (isJSON(data)) {
        let res = JSON.parse(data)
        if (res.data&&res.data.source.sourceType === 'client') {
          let req = window.ZetrixWalletConnect.observer.promisePool[webViewPoolName.nativeClientEncryption]
          req.resolve(resReturnedData(res))
        }
      }else {
        if (!isAnObject(data)) {
          reject ({
            code: resultInfo.h5ParametersMastObject.code,
            message: `${resultInfo.h5ParametersMastObject.message}`
          })
          return false
        }
        if (data.originStr == undefined) {
          reject ({
            code: resultInfo.h5RequiredParametersError.code,
            message: `${resultInfo.h5RequiredParametersError.message}-->originStr`
          })
          return false
        }
        if (data.type == undefined) {
          reject ({
            code: resultInfo.h5RequiredParametersError.code,
            message: `${resultInfo.h5RequiredParametersError.message}-->type`
          })
          return false
        }
        window.ZetrixWalletConnect.observer.send(webViewPoolName.nativeClientEncryption).then(res => {
          callback(res)
        })
        let appParams = {
          originStr: data.originStr,
          type: data.type
        }
        let oParams = fixedRequestParameters(appParams)
        console.log(oParams);
        let appType = sessionStorage.getItem(storageName.APP_TYPE)
        if (appType == 1) {
          window.flutter_inappwebview.callHandler('sendEncryption', oParams)
        } else {
          if (operatingSystem === 'ios') {
            window.webkit.messageHandlers.sendEncryption.postMessage(oParams)
          } else {
            window.platformChannel.sendEncryption(oParams)
          }
        }
      }
    })
  }
  clientDecrypt (data, callback) {
    return new Promise((resolve, reject) => {
      if (isJSON(data)) {
        let res = JSON.parse(data)
        if (res.data&&res.data.source.sourceType === 'client') {
          let req = window.ZetrixWalletConnect.observer.promisePool[webViewPoolName.nativeClientDecrypt]
          req.resolve(resReturnedData(res))
        }
      }else {
        if (!isAnObject(data)) {
          reject ({
            code: resultInfo.h5ParametersMastObject.code,
            message: `${resultInfo.h5ParametersMastObject.message}`
          })
          return false
        }
        if (data.originStr == undefined) {
          reject ({
            code: resultInfo.h5RequiredParametersError.code,
            message: `${resultInfo.h5RequiredParametersError.message}-->originStr`
          })
          return false
        }
        if (data.type == undefined) {
          reject ({
            code: resultInfo.h5RequiredParametersError.code,
            message: `${resultInfo.h5RequiredParametersError.message}-->type`
          })
          return false
        }
        let appParams = {
          originStr: data.originStr,
          type: data.type
        }
        let oParams = fixedRequestParameters(appParams)
        console.log(oParams);
        window.ZetrixWalletConnect.observer.send(webViewPoolName.nativeClientDecrypt).then(res => {
          callback(res)
        })
        let appType = sessionStorage.getItem(storageName.APP_TYPE)
        if (appType == 1) {
          window.flutter_inappwebview.callHandler('sendDecryption', oParams)
        } else {
          if (operatingSystem === 'ios') {
            window.webkit.messageHandlers.sendDecryption.postMessage(oParams)
          } else {
            window.platformChannel.sendDecryption(oParams)
          }
        }
      }
    })
  }

  scanQRCode () {}

  closeDapp (data, callback) {
    return new Promise((resolve, reject) => {
      if (isJSON(data)) {
        let res = JSON.parse(data)
        if (res.data&&res.data.source.sourceType === 'client') {
          let req = window.ZetrixWalletConnect.observer.promisePool[webViewPoolName.closeDapp]
          req.resolve(resReturnedData(res))
        }
      }else {
        window.ZetrixWalletConnect.observer.send(webViewPoolName.closeDapp).then(res => {
          callback(res)
        })
        let oParams = fixedRequestParameters()
        console.log(oParams);
        let appType = sessionStorage.getItem(storageName.APP_TYPE)
        if (appType == 1) {
          window.flutter_inappwebview.callHandler('sendClose', oParams)
        } else {
          if (operatingSystem === 'ios') {
            window.webkit.messageHandlers.sendClose.postMessage(oParams)
          } else {
            window.platformChannel.sendClose(oParams)
          }
        }
      }
    })
  }

  getPreloadParams () {
    let path = window.location.href
    let urlPara = getUrlParameter(path)
    if (urlPara&&urlPara.navHeight) {
      return urlPara
    }
  }

}
export default Native
