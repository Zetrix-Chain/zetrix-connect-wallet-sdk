'use strict'
import {compatibleSocket, compatibleStorage, getAddress, getSessionId} from './util'
import {sdkType} from './result'
class WalletSocket {
    constructor (url) {
        this.url = url
        this._websocket = null

        this.closeConfig = {
            resolve: null,
            closing: false
        }

        this.promisePool = {}
    }
    connect () {
        return new Promise((resolve, reject) => {

            let socketResult = compatibleSocket()
            if (socketResult.code !== 0) {
                reject(socketResult)
            }

            let locResult = compatibleStorage()
            if (locResult.code !== 0) {
                reject(locResult)
            }


            if (typeof(WebSocket) == "function") {
                this._websocket = new WebSocket(this.url)
                this._websocket.onopen = () => {
                    console.log('ws open successfully')
                    this.closeConfig.closing = false

                    let authResult = this.callbackAuthInfo()
                    resolve(authResult)

                    this.afterOpenToBind()
                }
                this._websocket.onerror = (e) => {
                    reject(e)
                }
                this._websocket.onclose = () => {
                    console.warn('Websocket closed')
                    if (!this.closeConfig.closing) {
                        console.warn('Websocket reconnect')
                        this.connect().then()
                    }

                }
                this._websocket.onmessage = (evt) => {

                    try {
                        let resp = JSON.parse(evt.data)
                        if (!resp.type) {
                            return false
                        }

                        let type = resp.type.split('_')[1]
                        if (type === 'auth') {
                            type = 'bind'
                        }
                        type = 'H5_' + type

                        let req = this.promisePool[type]

                        if (!req) {
                            return
                        }

                        req.resolve(resp)

                    } catch (e) {
                        console.error(e)
                    }
                }
            }

        })
    }
    // changeCallBackData (resp) {
    //     if (resp.data.isAuth === 1) {
    //         resp.type = 'H5_' + sdkType.bind
    //         return resp
    //     } else {
    //         return resp
    //     }
    // }
    send (method, data) {
        return new Promise((resolve, reject) => {
            this.promisePool[method] = {
                resolve,
                reject
            }
            data.type = method
            let req = JSON.stringify(data)
            this._websocket.send(req)
        })
    }



    disconnect () {
        this.closeConfig.closing = true
        this._websocket.close()
    }
    h5Bind (data) {
        return this.send('H5_'+ sdkType.bind, data)
    }
    afterOpenToBind () {
        if (getSessionId()) {
            let sendBind = {
                type: 'H5_bind',
                sessionId: getSessionId()
            }
            this._websocket.send(JSON.stringify(sendBind))
        }
    }
    callbackAuthInfo () {
        let addressStr = getAddress()
        let sessionIdStr = getSessionId()
        if (addressStr && sessionIdStr){
            return {
                code: 0,
                data: {
                    address: addressStr
                }
            }
        } else {
            return {
                code: 0,
                data: {}
            }
        }
    }
}

export default WalletSocket
