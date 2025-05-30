export const resultInfo = {
    noUseSocket: {
        code: 90001,
        message: 'Your browser does not support the Websocket communication protocol'
    },
    noUseLocalStorage: {
        code: 90002,
        message: 'Your browser does not support window.localStorage'
    },
    nonceNotActivated: {
        code: 10010,
        message: 'Account not activated'
    },
    nonceNotAuth: {
        code: 10011,
        message: 'Unexecuted authorization'
    },
    closeNotice: {
        code: 1,
        message: 'Cancelled'
    },
    h5ParametersMastObject: {
        code: 2000,
        message: 'Parameter format error, parameter format is object'
    },
    h5RequiredParametersError: {
        code: 2001,
        message: 'Missing required parameters'
    },
}

export const typeInfo = {
    storageName: 'zetrixWalletConnect',
    mobileSource: 'mobile'
}

export const hostParam = {
    android: 'zetrixnew://zetrix.com/app/flutter',
    ios: 'zetrixnew://zetrix.com/app/flutter',
    androidpixa: 'pixa://pixa.com/app/flutter',
    iospixa: 'pixa://pixa.com/app/flutter'
}

export const sdkType = {
    bind: 'bind',
    auth: 'auth',
    signMessage: 'signMessage',
    signBlob: 'signBlob',
    sendTransaction: 'sendTransaction',
    setQr: 'put',
    bindAndSignMessage: 'bindAndSignMessage'
}

export const errorCode = -1

export const systemErrorInfo = {
    abnormalOperation: 'Abnormal operation',
    iosSupportError: 'Sorry, IOS is not currently supported'
}
