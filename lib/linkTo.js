import {useDevice} from './util'
import {hostParam} from './result'
class LinkTo {
    constructor(appType, testnet = false) {
        this.appType = appType || 'zetrix'; // Default to Zetrix
        this.testnet = testnet;
        this.host = null
        this.initHost()
    }
    initHost () {
        let deviceTag = useDevice()

        if (this.appType === 'zetrix') {
            if (this.testnet) {
                // Use testnet URLs
                this.host = deviceTag === 'android' ? hostParam['androidTestnet'] : hostParam['iosTestnet'];
            } else {
                // Use mainnet URLs (default)
                this.host = deviceTag === 'android' ? hostParam['android'] : hostParam['ios'];
            }
        } else if (this.appType === 'pixa') {
            this.host = deviceTag === 'android' ? hostParam['androidpixa'] : hostParam['iospixa'];
        } else if (this.appType === 'myid') {
            this.host = deviceTag === 'android' ? hostParam['androidmyid'] : hostParam['iosmyid'];
        } else if (this.appType === 'muma') {
            if (this.testnet) {
                this.host = deviceTag === 'android' ? hostParam['androidmumaTestnet'] : hostParam['iosmumaTestnet'];
            } else {
                this.host = deviceTag === 'android' ? hostParam['androidmuma'] : hostParam['iosmuma'];
            }
        }
    }

    createHostParam (param) {

        if (!this.host) {
            return false
        }
        try {
            let url = this.host + '?' + this.convertObj(param)
            window.location.href = url

        } catch (e) {
            console.log(e)
        }
    }
    convertObj(data) {
        let _result = [];
        for (let key in data) {
            let value = data[key];
            if (value.constructor == Array) {
                value.forEach(function(_value) {
                    _result.push(key + "=" + _value);
                });
            } else {
                _result.push(key + '=' + value);
            }
        }
        return _result.join('&');
    }
}

export default LinkTo
