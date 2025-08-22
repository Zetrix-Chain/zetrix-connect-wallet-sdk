import WalletSocket from './socket'
import {
    sdkType,
    resultInfo,
    errorCode,
    systemErrorInfo,
    typeInfo
} from './result'
import {
    createSessionId,
    warnIncorrectLog,
    getWindowUrl,
    getWindowICO,
    getSessionId,
    getAddress,
    setAuthData,
    disconnectRemoveStorage,
    useDevice,
    isMobile,
    setLocalStorage,
    getLocalStorage,
    openInWebview,
    useClientName
} from './util'
import LinkTo from "./linkTo";
import ChainSDK from "./chainSDK";
import {hmacStr} from "./cryptoStr";
import {appendCode, loadQrCss, closeQr} from './qrcode'
import ZetrixWebView from './h5WebView/h5WEbViewTool'
const chainSDK = new ChainSDK()
const webViewName = 'webView'


class ZetrixWalletConnect {
    constructor(opts) {
        this.callMode = opts ? opts.callMode : ''
        if (this.callMode === webViewName) {
            this.zetrixWebView = new ZetrixWebView()
            this.apis = {
            native: {
                    clientEncryption: this.zetrixWebView.apis.native.clientEncryption,
                    clientDecrypt: this.zetrixWebView.apis.native.clientDecrypt,
                    closeDapp: this.zetrixWebView.apis.native.closeDapp,
                    getPreloadParams: this.zetrixWebView.apis.native.getPreloadParams
                }
            }
        }
        this.opts = opts
        this.appType = opts && opts.appType ? opts.appType : 'zetrix'; // Default to Zetrix
        this.isQrcode = opts && opts.qrcode ? true : false
        this.connected = false
        this.sessionId = null
        this.initSocket()
        this.linkTo = new LinkTo(this.appType)
    }
    initSocket () {
        let bridge = this.opts && this.opts.bridge ? this.opts.bridge : 'wss://test-wscw.zetrix.com'
        this.walletSocket = new WalletSocket(bridge + '/api/websocket/server')
        window.onunload = function(){
            this.walletSocket.disconnect()
        }
    }
    connect () {
        if (this.isQrcode) {
            loadQrCss()
        }
        if ('ontouchstart' in window) {
            if (useDevice() === 'ios' && useClientName() !== 'Chrome') {
                if (getLocalStorage('zetrixWalletFirstVisit')){

                } else {
                    setLocalStorage('zetrixWalletFirstVisit','1')
                }

            }
        }
        return this.walletSocket.connect()
    }
    auth () {
        if (this.callMode == webViewName) {
            return this.zetrixWebView.auth()
        } else {
            return new Promise((resolve, reject) => {
                let obj = {
                    linkTo: 'H5_' + sdkType.bind,
                    type: 'H5_' + sdkType.bind,
                    host: getWindowUrl(),
                    icon: getWindowICO(),
                    sessionId: createSessionId(),
                    source: isMobile() ? typeInfo.mobileSource : ''
                }
                this.walletSocket.h5Bind({
                    type: obj.type,
                    sessionId: obj.sessionId,
                    source: obj.source
                }).then(res => {
                    closeQr()
                    if (res.code === 0) {
                        setAuthData(res.sessionId, res.data.address)
                        resolve({
                            code: 0,
                            data: {
                                sessionId: res.sessionId,
                                address: res.data.address
                            }
                        })
                    } else {
                        reject({
                            code: res.code,
                            message: res.message
                        })
                    }
                }).catch(error => {
                    closeQr()
                    reject({
                        code: errorCode,
                        message: systemErrorInfo.abnormalOperation
                    })
                })

                if (this.isQrcode) {
                    this.authQr(obj).then(res => {
                        resolve(res)
                    })
                } else {
                    this.linkTo.createHostParam(obj)
                }
            })
        }
    }

    /*
    * sign message sdk
    * param: {message: ''}
    * */
    signMessage (param) {
        if (this.callMode == webViewName) {
            return this.zetrixWebView.signMessage(param)
        } else {
            return new Promise((resolve, reject) => {
                if (!getSessionId()) {
                    reject({
                        code: resultInfo.nonceNotAuth.code,
                        message: resultInfo.nonceNotAuth.message
                    })
                    return false
                }
                let verifyInfo = this.verifyBlobParam(param)
                if (verifyInfo) {
                    let warnMessage = warnIncorrectLog(verifyInfo)
                    reject({
                        code: errorCode,
                        message: warnMessage
                    })
                    return false
                }

                let obj = this.createSocketData({
                    type: 'H5_' + sdkType.signMessage,
                    data: {
                        message: param.message,
                        address: getAddress(),
                        source: isMobile() ? typeInfo.mobileSource : ''
                    }
                })
                this.walletSocket.send(`H5_${sdkType.signMessage}`, obj).then(res => {
                    if (res.code === 0) {
                        resolve({
                            code: 0,
                            data: {
                                address: res.data.address,
                                publicKey: res.data.publicKey,
                                signData: res.data.signData
                            }
                        })
                    } else {
                        reject({
                            code: res.code,
                            message: res.message
                        })
                    }
                }).catch(error => {
                    console.error(error)
                    reject({
                        code: errorCode,
                        message: systemErrorInfo.abnormalOperation
                    })
                })

                let urlObj = {
                    linkTo: 'H5_' + sdkType.signMessage,
                    sessionId: getSessionId(),
                    host: getWindowUrl(),
                    icon: getWindowICO()
                }

                if (!this.isQrcode) {
                    this.linkTo.createHostParam(urlObj)
                }
            })
        }
    }
    /*
    * connect and sign message
    * param: {message: ''}
    * */
    authAndSignMessage (param) {
        if (this.callMode == webViewName) {
            return this.zetrixWebView.authAndSignMessage(param)
        } else {
            return new Promise((resolve, reject) => {
                let obj = {
                    linkTo: 'H5_' + sdkType.bindAndSignMessage,
                    type: 'H5_' + sdkType.bindAndSignMessage,
                    host: getWindowUrl(),
                    icon: getWindowICO(),
                    sessionId: createSessionId(),
                    source: isMobile() ? typeInfo.mobileSource : '',
                    message: param.message
                }                

                this.walletSocket.h5Bind({
                    type: obj.type,
                    sessionId: obj.sessionId,
                    source: obj.source
                }).then(res => {
                    closeQr()
                    if (res.code === 0) {
                        setAuthData(res.sessionId, res.data.address)
                    } else {
                        reject({
                            code: res.code,
                            message: res.message
                        })
                    }
                    
                    this.signMessage(param).then(signRes => {
                        resolve({
                            code: 0,
                            data: {
                                sessionId: res.sessionId,
                                address: signRes.data.address,
                                publicKey: signRes.data.publicKey,
                                signData: signRes.data.signData
                            }
                        })
                    }).catch(signError => {
                        reject({
                            code: signError.code,
                            message: signError.message
                        })
                    })
                }).catch(error => {
                    closeQr()
                    reject({
                        code: errorCode,
                        message: systemErrorInfo.abnormalOperation
                    })
                })

                if (this.isQrcode) {
                    this.authQr(obj).then(res => {
                        resolve(res)
                    })
                } else {
                    this.linkTo.createHostParam(obj)
                }
            })
        }
    }
    /*
    * sign blob sdk
    * param: {message: ''}
    * */
    signBlob (param) {
        if (this.callMode == webViewName) {
            return this.zetrixWebView.signBlob(param)
        } else {
            return new Promise((resolve, reject) => {
                if (!getSessionId() || !getAddress()) {
                    reject({
                        code: resultInfo.nonceNotAuth.code,
                        message: resultInfo.nonceNotAuth.message
                    })
                    return false
                }
                let verifyInfo = this.verifyBlobParam(param)
                if (verifyInfo) {
                    let warnMessage = warnIncorrectLog(verifyInfo)
                    reject({
                        code: errorCode,
                        message: warnMessage
                    })
                    return false
                }

                let obj = this.createSocketData({
                    type: 'H5_' + sdkType.signBlob,
                    data: {
                        message: param.message,
                        address: getAddress(),
                        source: isMobile() ? typeInfo.mobileSource : ''
                    }
                })

                this.walletSocket.send(`H5_${sdkType.signBlob}`, obj).then(res => {
                    if (res.code === 0) {
                        resolve({
                            code: 0,
                            data: {
                                address: res.data.address,
                                publicKey: res.data.publicKey,
                                signData: res.data.signData
                            }
                        })
                    } else {
                        reject({
                            code: errorCode,
                            message: res.message
                        })
                    }
                }).catch(error => {
                    console.error(error)
                    reject({
                        code: errorCode,
                        message: systemErrorInfo.abnormalOperation
                    })
                })
                let urlObj = {
                    linkTo: 'H5_' + sdkType.signBlob,
                    sessionId: getSessionId(),
                    host: getWindowUrl(),
                    icon: getWindowICO()
                }

                if (!this.isQrcode) {
                    this.linkTo.createHostParam(urlObj)
                }

            })
        }
    }
    getNonce (param) {
        if (this.callMode == webViewName) {
            return this.zetrixWebView.getNonce(param)
        } else {
            return new Promise((resolve, reject) => {
                chainSDK.getAccountNonce(param.address, param.chainId || 1).then(res => {
                    resolve ({
                        code: 0,
                        data: {
                            nonce: res
                        }
                    })
                })
            })
         }
    }
    /*
   * send transaction sdk
   * param: {
        from: "<Transaction originator account address>",
        to: "<Recipient account address>",
        nonce: 0,
        amount: 0,
        gasFee: 1,
        data: `{
            "method": "mint",
            "params": {
                "platform": true,
                "to": "ZTX3TsiTDZUWfnftYcxR2EaD7ujLDMHGLqPSF",
                "id": "XH000000001",
                "value": "1",
                "uri": "https://ipfs.com/xxxxx"
            {
        }`,
        chainId: "<Zetrix Mainnet ID>"
   * }
   * */
    async sendTransaction (param) {
        if (this.callMode == webViewName) {
            return this.zetrixWebView.sendTransaction(param)
        } else {
            return new Promise((resolve, reject) => {
                if(!getSessionId() || !getAddress()){
                    reject({
                        code: resultInfo.nonceNotAuth.code,
                        message: resultInfo.nonceNotAuth.message
                    })
                    return false
                }

                let verifyInfo = this.verifyTransactionParam(param)
                if (verifyInfo) {
                    let warnMessage = warnIncorrectLog(verifyInfo)
                    reject({
                        code: errorCode,
                        message: warnMessage
                    })
                    return false
                }

                param.hmac = hmacStr(param.to + '&' + param.amount).toString()

                let obj = this.createSocketData({
                    type: 'H5_' + sdkType.sendTransaction,
                    data: {
                        ...param,
                        source: isMobile() ? typeInfo.mobileSource : ''
                    }
                })

                this.walletSocket.send(`H5_${sdkType.sendTransaction}`, obj).then(res => {
                    if (res.code === 0) {
                        resolve({
                            code: 0,
                            data: {
                                hash: res.data.hash
                            }
                        })
                    } else {
                        reject({
                            code: errorCode,
                            message: res.message
                        })
                    }
                }).catch(error => {
                    console.error(error)
                    reject({
                        code: errorCode,
                        message: systemErrorInfo.abnormalOperation
                    })
                })
                let urlObj = {
                    linkTo: 'H5_' + sdkType.sendTransaction,
                    sessionId: getSessionId(),
                    host: getWindowUrl(),
                    icon: getWindowICO(),
                    tag: param.to
                }

                if (!this.isQrcode) {
                    this.linkTo.createHostParam(urlObj)
                }
            })
        }
    }

    /*
    * param: {templateId: ''}
    * */
    verifyVC(param) {
        if (this.callMode == webViewName) {
            return this.zetrixWebView.verifyVC(param)
        } else {
            return new Promise((resolve, reject) => {
                if (!getSessionId()) {
                    reject({
                        code: resultInfo.nonceNotAuth.code,
                        message: resultInfo.nonceNotAuth.message
                    })
                    return false
                }

                if(!param.templateId){
                    reject({
                        code: errorCode,
                        message: 'templateId is required'
                    })
                    return false
                }

                let obj = {
                    type: 'H5_' + sdkType.verifyVC,
                    sessionId: getSessionId(),
                    data: {
                        host: getWindowUrl(),
                        icon: getWindowICO(),
                        address: getAddress(),
                        templateId: param.templateId,
                        source: isMobile() ? typeInfo.mobileSource : ''
                    }
                }

                this.walletSocket.send(`H5_${sdkType.verifyVC}`, obj).then(res => {
                    if (res.code === 0) {
                        resolve({
                            code: 0,
                            data: {
                                status: res.data.status,
                                details: res.data.details,
                            }
                        })
                    } else {
                        reject({
                            code: res.code,
                            message: res.message
                        })
                    }
                }).catch(error => {
                    console.error(error)
                    finishReject({ code: errorCode, message: systemErrorInfo.abnormalOperation })
                })

                const urlObj = {
                    linkTo: 'H5_' + sdkType.verifyVC,
                    sessionId: getSessionId(),
                    host: getWindowUrl(),
                    icon: getWindowICO(),
                    address: getAddress(),
                    templateId: param.templateId
                }

                this.linkTo.createHostParam(urlObj)
            })
        }
    }

    authQr(obj) {
        return new Promise((resolve) => {
            let param  = this.createQrSocketData({
                sessionId: obj.sessionId,
                type: obj.type,
                data: {
                    icon: obj.icon,
                    host: obj.host,
                    type: 'H5_' + sdkType.auth
                }
            })
            this.qrSocket(obj, param).then(res => {
                resolve(res)
            })
        })
    }

    qrSocket (obj, param) {
        return new Promise((resolve) => {
            this.walletSocket.send(`H5_${sdkType.setQr}`, param).then(res => {
                appendCode(`${res.rms}&${obj.sessionId}&${obj.type}`,(res) => {
                    resolve(res)
                })
            })
        })
    }
    verifyBlobParam (param) {
        if (!param.message) {
            return 'message'
        } else {
            return ''
        }
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
    disconnect () {
        disconnectRemoveStorage()
    }
    closeConnect () {
        this.walletSocket.disconnect()
    }

    createSocketData (param) {
        return {
            type: param.type,
            isH5Connect: !this.isQrcode,
            sessionId: getSessionId(),
            data: {
                host: getWindowUrl(),
                icon: getWindowICO(),
                address: getAddress(),
                ...param.data
            }
        }
    }
    createQrSocketData (param) {
        return {
            type:'H5_'+ sdkType.setQr,
            sessionId: param.sessionId,
            isH5Connect: !this.isQrcode,
            data: {
                sessionId: param.sessionId,
                sdkType: param.type,
                data: param.data
            }
        }
    }
}

export default ZetrixWalletConnect
// module.exports = ZetrixWalletConnect

