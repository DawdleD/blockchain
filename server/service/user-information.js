'use strict';
const {UserInformation} = require('../model/create-table');
const db = require('../config/database');

/**
 * 查找所有
 * @param where
 * @returns *
 */
exports.select = where => {
    return UserInformation.findAll({
        where: where,
        raw: true
    })
};

/**
 * 更新表
 * @param where
 * @param row
 */
exports.update = (where, row) => {
    return UserInformation.update(row, {where: where})
};

/**
 * 注册时添加用户信息
 */
exports.insert = row => {
    return UserInformation.create(row);
};

/**
 * 查询SQL语句
 */
function getSql(sqlType, searchType) {
    let search = '';
    if (searchType === '1') search = ' and UserInformation.nickname like ?';
    else if (searchType === '2') search = 'and CourseInformation.courseName like ?';
    let sql1 = `select UserInformation.nickname,UserInformation.userID,
        CourseInformation.courseID,CourseInformation.courseName,CourseInformation.examID,
        CourseClass.score,CourseClass.joinTime `,
        sql2 = `select count(UserInformation.userID) as count `,
        sql = `from UserInformation
        inner join CourseClass on CourseClass.userID = UserInformation.userID ${searchType === '1' ? search : ''}
        inner join CourseInformation on CourseClass.courseID = CourseInformation.courseID
        inner join CourseDetail on CourseInformation.courseID = CourseDetail.courseID 
        and CourseDetail.teacherID=? ${searchType === '2' ? search : ''}`;
    if (sqlType === 1) return `${sql1}${sql}limit ?,?`;
    else return `${sql2}${sql}`;
}

/**
 * 查找老师所授课程的选课学生信息
 * @param teacherID 教师ID
 * @param page 分页
 * @param searchType 查询方式：学生姓名/课程名
 * @param searchContent 查询内容
 */
exports.selectStudent = (teacherID, page, searchType, searchContent) => {
    let replacements = [];
    if (searchType === '1') replacements = [`%${searchContent}%`, teacherID, 8 * (page - 1), 8 * (page - 1) + 8];
    else if (searchType === '2') replacements = [teacherID, `%${searchContent}%`, 8 * (page - 1), 8 * (page - 1) + 8];
    else replacements = [teacherID, 8 * (page - 1), 8 * (page - 1) + 8];
    let sql = getSql(1, searchType);
    return db.query(sql, {replacements, type: db.QueryTypes.SELECT})
};

/**
 * 查找老师所授课程的选课学生信息总数
 * @param teacherID 教师ID
 * @param searchType 查询方式：学生姓名/课程名
 * @param searchContent 查询内容
 */
exports.selectStudentCount = async (teacherID, searchType, searchContent) => {
    let replacements = [];
    if (searchType === '1') replacements = [`%${searchContent}%`, teacherID];
    else if (searchType === '2') replacements = [teacherID, `%${searchContent}%`];
    else replacements = [teacherID];
    let sql = getSql(2, searchType);
    let result =  await db.query(sql, {replacements, type: db.QueryTypes.SELECT});
    return result[0].count;
};
