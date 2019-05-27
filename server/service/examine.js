'use strict';

const {CourseExam, Examine} = require('../model/create-table');

/**
 * 查询用户答题情况
 * @param where
 */
exports.select = where => {
    return Examine.findAll({where, raw: true});
};

/**
 * 存入用户答案
 */
exports.insert = rows => {
    return Examine.create(rows);
};

/**
 * 查询用户是否答完课程所有题目
 */
exports.selectState = async (userID, examID) => {
    try {
        let count1 = await Examine.count({where: {userID, examID}});
        let count2 = await CourseExam.count({where: {examID}});
        if (count1 === 0 && count2 === 0) return 0;
        else if (count1 === 0 && count2 > 0) return 1;
        else if (count1 < count2) return 2;
        else return 3;
    } catch (e) {
        console.log(e);
        return -1;
    }
};

/**
 * 获取用户测试成绩
 */
exports.selectScore = async (userID, examID) => {
    try {
        return await Examine.sum('score', {where: {userID, examID}});
    } catch (e) {
        console.log(e);
        return -1;
    }
};
