const CryptoJS = require('crypto-js');
require('dotenv').config();

// Secret encryption key (use a secure, random key in production)
const secretKey = process.env.ENCRYPTION_SECRET;

// Encrypt data
function encrypt(data) {
    const stringifiedData = JSON.stringify(data);
    const ciphertext = CryptoJS.AES.encrypt(stringifiedData, secretKey).toString();
    return ciphertext;
}

// Decrypt data
function decrypt(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
}

module.exports = { encrypt, decrypt };
