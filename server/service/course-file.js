'use strict';

const {CourseFile} = require('../model/create-table');

/**
 * 查询课程文件
 * @param where
 */
exports.select = where => {
    return CourseFile.findAll({
        where: where
    })
};
