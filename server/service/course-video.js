'use strict';

const {CourseVideo} = require('../model/create-table');

/**
 * 查询课程文件
 * @param where
 */
exports.select = where => {
    return CourseVideo.findAll({
        where: where
    })
};
