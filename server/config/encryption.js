'use strict';
const crypto = require('crypto');

/**
 * 获取随机hash值
 * @returns {string}
 */
function getRandomHash() {
    let md5 = crypto.createHash('md5');
    let number = Math.random().toString().slice(2, 7);
    md5.update(number);
    return md5.digest('hex');
}

/**
 * 加密密码
 * @param salt 盐值
 * @param password 密码
 * @returns {string}
 */
function encryptPassword(salt, password) {
    const saltPassword = password + ':' + salt;
    const md5 = crypto.createHash('md5');
    return md5.update(saltPassword).digest('hex');
}
/**
 * 加密文本
 * @returns {string}
 */
function encrypt() {
    let text = getRandomHash();
    const md5 = crypto.createHash('md5');
    return md5.update(text).digest('hex');
}

module.exports = {encryptPassword, getRandomHash, encrypt};
