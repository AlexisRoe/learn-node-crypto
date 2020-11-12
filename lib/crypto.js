const CryptoJS = require('crypto-js');

function encrypt(keyValue, master) {
    const encryptedValue = CryptoJS.AES.encrypt(keyValue, master).toString();
    return encryptedValue;
}

function hash(pwdInput) {
    const pwdHash = CryptoJS.MD5(pwdInput).toString(CryptoJS.enc.Base64);
    return pwdHash;
}

function decryptPwd(pwd, master) {
    const bytes = CryptoJS.AES.decrypt(pwd, master);
    const encryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    return encryptedPassword;
}

exports.encrypt = encrypt;
exports.hash = hash;
exports.decryptPwd = decryptPwd;
