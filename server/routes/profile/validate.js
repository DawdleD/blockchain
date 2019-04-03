'use strict';

/**
 * 验证长度
 * @param text 需要验证的文本
 * @param minLength 最小长度
 * @param maxLength 最大长度
 * @returns {boolean}
 */
function validateLength(text, minLength, maxLength) {
    return !(text.length > maxLength || text.length < minLength);
}

/**
 * 验证性别
 * @param sex 性别
 * @returns {boolean}
 */
function validateSex(sex) {
    return (sex === 'S' || sex === 'F' || sex === 'M');
}

module.exports = {
    validateLength, validateSex
};
