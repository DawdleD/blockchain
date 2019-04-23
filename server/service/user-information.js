'use strict';
const {UserInformation} = require('../model/create-table');
/**
 * 查找所有
 * @param where
 * @returns *
 */
exports.select = where => {
    return UserInformation.findAll({
        where: where,
        raw: true
    })
};

/**
 * 更新表
 * @param where
 * @param row
 */
exports.update = (where, row) => {
    return UserInformation.update(row, {where: where})
};

/**
 * 注册时添加用户信息
 */
exports.insert = row => {
    return UserInformation.create(row);
};
