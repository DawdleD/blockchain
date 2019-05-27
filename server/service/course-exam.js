'use strict';

const {CourseVideo, CourseInformation, CourseExam} = require('../model/create-table');
const db = require('../config/database');
/**
 * 查找期末考试
 * @param where
 */
exports.selectExam = where => {
    return CourseExam.findAll({
        include: [{
            model: CourseInformation,
            attributes: ['examID'],
            where
        }],
        raw: true
    })
};

/**
 * 查找课后练习
 * @param where
 */
exports.selectExercise = where => {
    return CourseExam.findAll({
        include: [{
            model: CourseVideo,
            attributes: ['examID'],
            where
        }],
        raw: true
    })
};

/**
 * 期末考试时间
 */
exports.selectTime = courseID => {
    return CourseExam.findAll({
        attributes: ['startTime', 'endTime'],
        include: [{
            model: CourseInformation,
            attributes: [],
            where: {courseID}
        }],
        raw: true
    })
};

/**
 * 查找学生的平时成绩
 */
exports.selectExerciseScore = (userID, courseID) => {
    return db.query(`select avg(score) as score
    from Examine where userID = ? and examID in
    (select examID from CourseExam where examID in
    (select examID from CourseVideo where chapterID in
    (select chapterID from CourseChapter where courseID = ?)))`, {
        replacements: [userID, courseID], type: db.QueryTypes.SELECT
    });
};

/**
 * 查找学生的期末成绩
 */
exports.selectExamScore = async (userID, courseID) => {
    return db.query(`select score
    from Examine where userID = ? and examID in
    (select examID from CourseExam where examID in
    (select examID from CourseInformation where courseID = ?))`, {
        replacements: [userID, courseID], type: db.QueryTypes.SELECT
    });
};

