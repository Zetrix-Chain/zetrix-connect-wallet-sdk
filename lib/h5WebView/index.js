import { useDevice, fixedRequestParameters, resReturnedData, isJSON, isAnObject, getUrlParameter, getWindowUrl, getWindowICO } from '../util'
import { resultInfo } from '../result'
import { webViewPoolName, storageName } from './poolName'
import ObserverMode from './utils/observerMode'
import  Apis from './apis/apis'
import ChainSDK from "../chainSDK";
const Base64 = require('./utils/base64').Base64
const chainSDK = new ChainSDK()
class ZetrixWebView {
  constructor() {
    this.observer = new ObserverMode()
    this.apis = new Apis()
    this.operatingSystem = useDevice()
    this.isAuth = sessionStorage.getItem('is_auth')
    let paramUrl = getUrlParameter()
    let appType = sessionStorage.getItem(storageName.APP_TYPE)
    if (paramUrl && paramUrl.appType) {
      sessionStorage.setItem(storageName.APP_TYPE, paramUrl.appType)
      appType = sessionStorage.getItem(storageName.APP_TYPE)
    }
    this.appType = appType
  }
  auth (data, callback) {
    if (!this.isAuth) {
      return new Promise((resolve, reject) => {
      if (isJSON(data)) {
        let res = JSON.parse(data)
        if (res.data&&res.data.source.sourceType === 'client') {
          let req = this.observer.promisePool[webViewPoolName.auth]
          sessionStorage.setItem('is_auth', 1)
          this.isAuth = sessionStorage.getItem('is_auth')
          return req.resolve(resReturnedData(res))
        }
      } else {
          this.observer.send(webViewPoolName.auth).then(res => {
            callback(res)
          })
          let oParams = fixedRequestParameters()
          if (this.appType == 1) {
            window.flutter_inappwebview.callHandler('sendAuth', oParams)
          } else {
            if (this.operatingSystem === 'ios') {
              window.webkit.messageHandlers.sendAuth.postMessage(oParams)
            } else {
              window.platformChannel.sendAuth(oParams)
            }
          }
        }
      })
    }
  };
  signMessage (data, callback) {
    return new Promise((resolve, reject) => {
      if (isJSON(data)) {
        let res = JSON.parse(data)
        if (res.data&&res.data.source.sourceType === 'client') {
          let req = this.observer.promisePool[webViewPoolName.signMessage]
          req.resolve(resReturnedData(res))
        }
      } else {
        if (!isAnObject(data)) {
          reject ({
            code: resultInfo.h5ParametersMastObject.code,
            message: `${resultInfo.h5ParametersMastObject.message}`
          })
          return false
        }
        if (data.message == undefined) {
          reject ({
            code: resultInfo.h5RequiredParametersError.code,
            message: `${resultInfo.h5RequiredParametersError.message}-->message`
          })
          return false
        }
        this.observer.send(webViewPoolName.signMessage).then(res => {
          callback(res)
        })
        let appParams = {
          message: data.message
        }
        let oParams = fixedRequestParameters(appParams)
        console.log(oParams, 'sing签名');
        if (this.appType == 1) {
          window.flutter_inappwebview.callHandler('sendMessageSign', oParams)
        } else {
          if (this.operatingSystem === 'ios') {
            window.webkit.messageHandlers.sendMessageSign.postMessage(oParams)
          } else {
            window.platformChannel.sendMessageSign(oParams)
          }
        }
      }
    })
  }
  signBlob (data, callback) {
    return new Promise((resolve, reject) => {
      if (isJSON(data)) {
        let res = JSON.parse(data)
        if (res.data&&res.data.source.sourceType === 'client') {
          let req = this.observer.promisePool[webViewPoolName.signBlob]
          req.resolve(resReturnedData(res))
        }
      } else {
        if (!isAnObject(data)) {
          reject ({
            code: resultInfo.h5ParametersMastObject.code,
            message: `${resultInfo.h5ParametersMastObject.message}`
          })
          return false
        }
        if (data.message == undefined) {
          reject ({
            code: resultInfo.h5RequiredParametersError.code,
            message: `${resultInfo.h5RequiredParametersError.message}-->message`
          })
          return false
        }
        this.observer.send(webViewPoolName.signBlob).then(res => {
          callback(res)
        })
        let appParams = {
          message: data.message
        }
        let oParams = fixedRequestParameters(appParams)
        console.log(oParams);
        if (this.appType == 1) {
          window.flutter_inappwebview.callHandler('sendMessageSign', oParams)
        } else {
          if (this.operatingSystem === 'ios') {
            window.webkit.messageHandlers.sendMessageSign.sendBlobSign(oParams)
          } else {
            window.platformChannel.sendBlobSign(oParams)
          }
        }
      }
    })
  }
  // 5.transfer accounts
  sendTransaction (data, callback) {
    return new Promise((resolve, reject) => {
      if (isJSON(data)) {
        let res = JSON.parse(data)
        if (res.data&&res.data.source.sourceType === 'client') {
          let req = this.observer.promisePool[webViewPoolName.sendTransaction]
          req.resolve(resReturnedData(res))
        }
      } else {
        if (!isAnObject(data)) {
          reject ({
            code: resultInfo.h5ParametersMastObject.code,
            message: `${resultInfo.h5ParametersMastObject.message}`
          })
          return false
        }
        this.verifyTransactionParam(data)
        this.observer.send(webViewPoolName.sendTransaction).then(res => {
          callback(res)
        })
        let appParams = {
          from: data.from,
          to: data.to,
          nonce: data.nonce,
          amount: data.amount,
          gasFee: data.gasFee,
          data: data.data,
          icon: getWindowICO(),
          host: getWindowUrl(),
        }
        let mustParameters = {
          data: {
            source: {
             isBackData: true,
             sourceType: 'triggerApp'
            },
            payload: {
              tranData: Base64.encode(JSON.stringify(appParams))
            }
          }
        }
        let oParams = JSON.stringify(mustParameters)
        console.log(oParams);
        if (this.appType == 1) {
          window.flutter_inappwebview.callHandler('sendTransaction', oParams)
        } else {
          if (this.operatingSystem === 'ios') {
            window.webkit.messageHandlers.sendTransaction.postMessage(oParams)
          } else {
            window.platformChannel.sendTransaction(oParams)
          }
        }
      }
    })
  }
  verifyTransactionParam (param) {
    let warnInfo = ''

    if (!param.from) {
        warnInfo = 'from'
    } else if (!param.to) {
        warnInfo = 'to'
    } else if (!param.amount && param.amount != '0' && param.amount != 0 ) {
        warnInfo = 'amount'
    } else if (!param.gasFee && param.gasFee != '0' && param.gasFee != 0 ) {
        warnInfo = 'gasFee'
    } else if (!param.nonce) {
        warnInfo = 'nonce'
    }
    return warnInfo
  }
  async getNonce (data) {
    let walletInfo = sessionStorage.getItem('walletInfo')
    let oParams = {
      address: data.address,
      chainId: walletInfo ? walletInfo.chainId : '1'
    }
    return await chainSDK.getAccountNonce(oParams.address, oParams.chainId)
  }
}
export default ZetrixWebView
