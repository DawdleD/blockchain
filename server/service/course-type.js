const {CourseType} = require('../model/create-table');
/**
 * 获取课程类别
 * @param where
 */
exports.select = where => {
    return CourseType.findAll({
        where: where,
        raw: true
    })
};
