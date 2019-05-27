'use strict';

const {CourseClass, CourseInformation, UserInformation} = require('../model/create-table');

/**
 * 查询用户是否在班级内
 * @param where
 */
exports.inClass = async where => {
    try {
        let rows = await CourseClass.findAll({where});
        return rows.length > 0;
    } catch (e) {
        return false;
    }
};

/**
 * 查询班级
 */
exports.select = where => {
    return CourseClass.findAll({where})
};

/**
 * 为用户添加课程
 */
exports.insert = value => {
    return CourseClass.create(value)
};

/**
 * 查询班级
 */
exports.selectCount = where => {
    return CourseClass.count({where})
};

/**
 * 用户查询自己所选的课程
 */
exports.selectInfo = (userID, page) => {
    return CourseInformation.findAll({
        attributes: ['courseID', 'courseName', 'price', 'courseImage', 'examID'],
        include: [{
            model: UserInformation,
            attributes: [],
            where: {userID}
        }],
        raw: true,
        limit: 4, offset: (4 * (page - 1))
    })
};

/**
 * 查询课程是否为免费课程
 */
exports.isFreeCourse = async courseID => {
    try {
        let rows = await CourseInformation.findAll({
            where: {courseID, price: 0}
        });
        return rows.length > 0;
    } catch (e) {
        return false;
    }
};

/**
 * 用户取消已报名课程
 */
exports.deleteCourse = (userID, courseID) => {
    return CourseClass.destroy({
        where: {userID, courseID}
    })
};

/**
 * 更新班级成员信息
 */
exports.update = (where, row) => {
    return CourseClass.update(row, {where: where})
};
