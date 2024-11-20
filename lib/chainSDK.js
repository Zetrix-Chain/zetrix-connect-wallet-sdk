let hostGroup = {
    '1': {
        host: 'https://wallet.zetrix.com'
    },
    '2': {
        host: 'https://test-wallet.zetrix.com'
    }
}

class ChainSDK {
    getAccountNonce(address, chainId) {
        return new Promise((resolve, reject) => {
            ajax({
                url: hostGroup[chainId].host + '/getAccount',
                type: 'GET',
                data: {address: address},
                success: function (respData) {
                    respData = JSON.parse(respData)
                    if (respData.error_code === 4) {
                        resolve(0)
                    }
                    if (!respData.result.nonce) {
                        resolve(0)
                    }
                    resolve(respData.result.nonce)
                },
                error: function (res) {

                }
            })

        })
        // this.ztxQuery = new Query({host: hostGroup[chainId].host})
        // if (address === '') {
        //     return 0
        // }
        // eslint-disable-next-line no-undef
        // return this.ZTXQuery.getNonceByAddress(address)

    }
}


function ajax(options) {
    let params = {
        url: '',
        type: 'get',
        data: {},
        success: function(data) {},
        error: function(err) {}
    }
    options = Object.assign(params,options);

    if (options.url) {
        const xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        let url = options.url,
            type = options.type.toUpperCase(),
            data = options.data,
            dataArr = [];

        for (let key in data) {
            let value = key + '=' + data[key];
            dataArr.push(value);
        }

        if (type === 'GET') {
            url = url + '?' + dataArr.join('&');
            xhr.open(type,url,true);
            xhr.send();
        }

        if (type === 'POST') {
            xhr.open(type,url,true);
            xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
            xhr.send(dataArr.join('&'));
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                options.success(xhr.responseText);
            } else {
                options.error(xhr.responseText);
            }
        }
    }
}

export default ChainSDK
