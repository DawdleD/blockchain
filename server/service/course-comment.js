'use strict';

const sequelize = require('../config/database');
const Op = require('sequelize').Op;
const {CourseComment, UserInformation} = require('../model/create-table');

/**
 * 处理查询的 where 语句
 */
function dealWhere(courseID, filter) {
    let whereCase = {courseID: courseID};
    if (filter !== undefined && !isNaN(parseInt(filter)))
        switch (parseInt(filter)) {
            case 1:
                whereCase.star = {[Op.in]: [4, 5]};
                break;
            case 2:
                whereCase.star = {[Op.in]: [2, 3]};
                break;
            case 3:
                whereCase.star = 1;
                break;
        }
    return JSON.stringify(whereCase) === '{}' ? undefined : whereCase;
}

/**
 * 查询分数总和
 * @param courseID
 */
exports.selectSum = (courseID) => {
    return sequelize.query(
        `SELECT COUNT(*) AS count,SUM(star) AS sum FROM CourseComment WHERE courseID = ?`,
        {replacements:[courseID], type: sequelize.QueryTypes.SELECT}
    )
};

/**
 * 查询评论和数量
 * @param courseID
 * @param filter
 * @param page
 */
exports.select = (courseID, filter, page) => {
    let offset = !isNaN(parseInt(page)) ? parseInt(page) : 1;
    let where = dealWhere(courseID, filter);
    return CourseComment.findAll({
        where: where,
        limit: 5, offset: (5 * (offset - 1)),
        raw: true
    })
};

/**
 * 查询评论页数
 */
exports.selectCount = (courseID, filter) => {
    let where = dealWhere(courseID, filter);
    return CourseComment.count({
        where: where
    });
};

/**
 * 查询评论的学生信息
 * @param where
 */
exports.selectUser = where => {
    return UserInformation.findAll({
        attributes: {include: ['nickname', 'avatarUrl']},
        where: where,
        raw: true
    })
};


/**
 * 插入评论
 */
exports.insert = value => {
    return CourseComment.create(value);
};

