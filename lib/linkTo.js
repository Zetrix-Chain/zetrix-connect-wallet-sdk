import {useDevice} from './util'
import {hostParam} from './result'
class LinkTo {
    constructor() {
        this.host = null
        this.initHost()
    }
    initHost () {
        let deviceTag = useDevice()
        this.host = hostParam['android']
        // if (deviceTag === 'android') {
        //     this.host = hostParam['android']
        // } else if (deviceTag === 'ios') {
        //     this.host = hostParam['ios']
        // }
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
