'use strict';

const {CourseDetail, UserInformation, CourseInformation} = require('../model/create-table');


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
        include: [{
            attributes: {exclude: ['createdAt', 'updatedAt']},
            model: CourseDetail,
            where: where
        }],
        raw: true
    })
};

/**
 * 根据教师ID和课程ID查询
 * @param teacherID 教师ID
 * @param courseID 课程ID
 */
exports.isTeacherCourse = async (teacherID, courseID) => {
    let count = await CourseDetail.count({
        where: {courseID, teacherID}
    });
    return count > 0;
};

/**
 * 查询指定老师所上的课程
 * @param teacherID 教师ID
 */
exports.selectTeacherCourse = (teacherID) => {
    return CourseInformation.findAll({
        attributes: ['courseName', 'courseID'],
        include: [{
            model: CourseDetail,
            attributes: [],
            where: {teacherID}
        }],
        raw: true
    })
};
