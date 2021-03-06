const CryptoJS = require('crypto-js');
const passMatch = 'HMCHUSSAIN';
const keySize = 256;
const iterations = 100;

const decrypt = (encryptContent) => {
    let salt = CryptoJS.enc.Hex.parse(encryptContent.substr(0, 32));
    let iv = CryptoJS.enc.Hex.parse(encryptContent.substr(32, 32))
    let encrypted = encryptContent.substring(64);

    let key = CryptoJS.PBKDF2(passMatch, salt, {
        keySize: keySize / 32,
        iterations: iterations
    });

    let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    })
    return decrypted.toString(CryptoJS.enc.Utf8);
}

const getTimestamp = () => {
    return parseInt(new Date().getTime() / 1000)
}

module.exports = {
    decrypt,
    getTimestamp
}