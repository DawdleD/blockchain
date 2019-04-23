'use strict';
const {UserPassport} = require('../model/create-table');
const Op = require('sequelize').Op;
/**
 * 自定义查找
 * @param where
 */
exports.select = where => {
    return UserPassport.findAll({
        where: where
    })
};

/**
 * 或查找
 * @param or or语句
 */
exports.selectOr = or => {
    return UserPassport.findAll({
        where: {
            [Op.or]: or
        },
        raw: true
    });
};

/**
 * 添加用户
 * @param row 需要添加的行对象
 */
exports.insert = row => {
    return UserPassport.create(row)
};

/**
 * 通过用户ID更改用户信息
 * @param where where语句对象
 * @param row 需要更新的行对象
 */
exports.update = (where, row) => {
    return UserPassport.update(row, {where: where})
};
