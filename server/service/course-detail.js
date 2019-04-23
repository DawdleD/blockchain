'use strict';

const {CourseDetail, UserInformation} = require('../model/create-table');


/**
 * 查找课程细节
 * @param where
 */
exports.select = where => {
    return CourseDetail.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: where,
        raw: true
    })
};

/**
 * 查找课程老师信息
 */
exports.selectTeacher = where => {
    return UserInformation.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [
            {
                attributes: {exclude: ['createdAt', 'updatedAt']},
                model: CourseDetail,
                where: where
            }
        ],
        raw: true
    })
};
