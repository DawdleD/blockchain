const {CourseSystem} = require('../model/create-table');
/**
 * 获取课程体系
 */
exports.select = () => {
    return CourseSystem.findAll({raw: true});
};

/**
 * 获取课程体系名
 */
exports.selectName = systemID => {
    return CourseSystem.findAll({
        where: {systemID: systemID},
        raw: true
    })
};
/**
 * 添加课程体系
 */
exports.insert = row => {
    CourseSystem.create(row)
};
