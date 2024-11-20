import {resultInfo, typeInfo} from './result'
import MobileDetect from './mobileDetect'

export const createSessionId = () => {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    let uuid = s.join("");
    return uuid;
}

export const compatibleSocket = () => {
    if( typeof(WebSocket) != "function" ) {
        console.error(resultInfo.noUseSocket.message)
        return {
          code: resultInfo.noUseSocket.code,
          message: resultInfo.noUseSocket.message
        }
    } else {
      return {
        code: 0
      }
    }
}

export const compatibleStorage = () => {
    if(typeof window.localStorage == 'undefined') {
        console.error(resultInfo.noUseLocalStorage.message)
        return {
            code: resultInfo.noUseLocalStorage.code,
            message: resultInfo.noUseLocalStorage.message
        }
    } else {
        return {
            code: 0
        }
    }
}

export const getWindowUrl = () => {
    return  window.location.protocol + '//' + window.location.host
}

export const getWindowICO = () => {
    let ico = ''
    try {
        ico = document.querySelectorAll("link[rel*='icon']")[0].href || ''
    } catch (e) {
        ico = ''
    }
    return ico
}

export const useDevice = () => {
    let u = navigator.userAgent;
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;

    if(isAndroid) {
       return 'android'
    } else if(isiOS) {
       return 'ios'
    }
}

export const useClientName = () => {
    const md = new MobileDetect(window.navigator.userAgent);
    const client = md.userAgent()
    return client || ''
}

export const warnIncorrectLog = (name) => {
    return `The '${name}' argument is incorrect`
}

export const getSessionId = () => {
    let storageData = window.localStorage.getItem(typeInfo.storageName)
    if (!storageData) {
        return false
    }
    storageData = JSON.parse(storageData)
    if (storageData.sessionId) {
        return storageData.sessionId
    } else {
        return false
    }
}

export const getAddress = () => {
    let storageData = window.localStorage.getItem(typeInfo.storageName)
    if (!storageData) {
        return false
    }
    storageData = JSON.parse(storageData)
    if (storageData.address) {
        return storageData.address
    } else {
        return false
    }
}

export const setAuthData = (sessionId, address) => {
    let storageData = window.localStorage.getItem(typeInfo.storageName)
    if (!storageData) {
        let setData = { sessionId: sessionId, address: address }
        window.localStorage.setItem(typeInfo.storageName, JSON.stringify(setData))
    } else {
        storageData = JSON.parse(storageData)
        storageData.sessionId = sessionId
        storageData.address = address
        window.localStorage.setItem(typeInfo.storageName, JSON.stringify(storageData))
    }
}

export const disconnectRemoveStorage = () => {
    window.localStorage.removeItem(typeInfo.storageName)
}

export const isMobile = () => {
    if ('ontouchstart' in window) {
        return true
    } else {
        return  false
    }
}

export const setLocalStorage = (name, value) => {
    window.localStorage.setItem(name, value)
}

export const getLocalStorage = (name) => {
    let data = window.localStorage.getItem(name)
    if (!data) {
        return ''
    }
    return data
}

export const isJSON = (str) =>  {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }
        } catch(e) {
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
}

export const openInWebview = () => {
    var useragent = navigator.userAgent;
    var rules = ['WebView','(iPhone|iPod|iPad)(?!.*Safari/)','Android.*(wv|.0.0.0)'];
    var regex = new RegExp(`(${rules.join('|')})`, 'ig');
    return Boolean(useragent.match(regex));
}


export const fixedRequestParameters  = (oParams={}) => {
    let mustParameters = {
        data: {
          source: {
           isBackData: true,
           sourceType: 'triggerApp'
          },
          payload: {
            ...oParams
          }
        }
      }
    return JSON.stringify(mustParameters)
}

export const resReturnedData = (res) => {
    let parseRes = res
    console.log(parseRes, 'parseRes1');
    let oParams = {
        code: parseRes.code,
        data: parseRes.data.payload,
        message: parseRes.message
    }
    if (parseRes.data.source.chainId) {
        oParams.data.chainId = parseRes.data.source.chainId
    }
    return oParams
}

export const isAnObject = (obj) => {
    if (obj instanceof Object) {
        return true
    } else {
        return false
    }
}

export const getUrlParameter = (loca, type) => {
    let search = () => (location.href.indexOf('?') === -1 ? '' : location.href.slice(location.href.indexOf('?')));
    let url = loca || location.search || search();
    if (type === 'string') {
        return url;
    }
    let theRequest = new Object();
    if (url.indexOf('?') != -1) {
        let str = url.split('?')[1];
        let strs = str.split('&');
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
        }
    }
    return theRequest;
};
