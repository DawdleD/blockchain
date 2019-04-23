'use strict';

const {CourseClass} = require('../model/create-table');

/**
 * 查询用户是否在课程内
 */
exports.select = where => {
    return CourseClass.findAll({
        where: where
    })
};

/**
 * 为用户添加课程
 */
exports.insert = (value) => {
    return CourseClass.create(value)
};

/**
 * 查询班级人数
 */
exports.selectCount = where => {
    return CourseClass.count({where: where})
};
