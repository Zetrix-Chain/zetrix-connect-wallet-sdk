import {qrcanvas} from 'qrcanvas'
import {resultInfo, appName} from './result'


export const appendCode = (data, callBack, appType = 'Zetrix Wallet') => {
    const code = createQrcode(data)
    let hasDom = document.getElementById('zetrixWalletConnectQr')
    if (hasDom) {
        document.body.removeChild(hasDom)
    }
    let divDom = document.createElement("div");
    divDom.className = 'zetrix_wallet_connect_wrapper'
    divDom.setAttribute('id', 'zetrixWalletConnectQr')
    divDom.innerHTML = "<div class='zetrix_wallet_connect_box'>" +
        `<h2>Scan with the ${appName[appType]} app</h2>` +
        "<img src='"+code+"' width='100%' />" +
        "</div>"
    let bodyDom = document.body
    bodyDom.insertBefore(divDom, bodyDom.lastChild);

    divDom.onclick = function(){
        let hasDom = document.getElementById('zetrixWalletConnectQr')
        document.body.removeChild(hasDom)
        if (callBack) {
            callBack(resultInfo.closeNotice)
        }
    }
}

export const loadQrCss = () => {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML=".zetrix_wallet_connect_wrapper{\n" +
        "    width: 100%;\n" +
        "    height:100%;\n" +
        "    background: rgba(0,0,0,.8);\n" +
        "    position: fixed;\n" +
        "    left:0;\n" +
        "    top:0;\n" +
        "    z-index: 9999999999;\n" +
        "    user-select: none;\n" +
        "    transition: .2s ease-in-out;\n" +
        "}\n" +
        ".zetrix_wallet_connect_box{\n" +
        "    width: 400px;\n" +
        "    padding: 20px;\n" +
        "    border-radius: 20px;\n" +
        "    background-color: #FFF;\n" +
        "    position: absolute;\n" +
        "    left: 50%;\n" +
        "    top:50%;\n" +
        "    transform: translate(-50%, -50%);\n" +
        "}\n" +
        ".zetrix_wallet_connect_box h2 {\n" +
        "    font-size: 18px;\n" +
        "    text-align: center;\n" +
        "     margin: 0 0 15px 0;\n" +
        "    color:#999;\n" +
        "}";
    document.getElementsByTagName('HEAD').item(0).appendChild(style);
}

export const closeQr = () => {
    let hasDom = document.getElementById('zetrixWalletConnectQr')
    if (hasDom) {
        document.body.removeChild(hasDom)
    }
}

const createQrcode = (data) => {
    const canvas = qrcanvas({
        data: data
    })
    return canvas.toDataURL("image/png")
}
