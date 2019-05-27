'use strict';

const UserInfo = require('../../service/user-information');
const Class = require('../../service/course-class');
const Detail = require('../../service/course-detail');
const Passport = require('../../service/user-passport');
const Exam = require('../../service/course-exam');
const moment = require('moment');

/**
 * 获取选课学生信息
 */
exports.getStudentInfo = async (req, res) => {
    let teacherID = req.session.userID;
    let page = req.query.page;
    let searchContent = req.query.content;
    let searchType = req.query.type;
    if (teacherID === undefined || req.session.level !== 1) res.json({status: 0, msg: '非法访问'});
    else {
        try {
            let result = await UserInfo.selectStudent(teacherID, page, searchType, searchContent);
            let count = await UserInfo.selectStudentCount(teacherID, searchType, searchContent);
            res.json({status: 1, info: result, count});
        } catch (e) {
            console.log(e);
            res.json({status: 0, msg: '服务器错误'})
        }
    }
};

/**
 * 添加选课学生
 */
exports.addStudent = async (req, res) => {
    let teacherID = req.session.userID;
    let courseID = req.body.courseID;
    let account = req.body.studentID;
    try {
        if (teacherID === undefined || req.session.level !== 1) res.json({status: 0, msg: '非法访问'});
        else {
            if (await Detail.isTeacherCourse(teacherID, courseID)) {
                let user = await Passport.selectUser(account);
                if (user === null)
                    res.json({status: 0, msg: '该学员不存在'});
                else if (await Class.inClass({userID: user.userID, courseID}))
                    res.json({status: 0, msg: '该学员已报名该课程'});
                else {
                    await Class.insert({userID: user.userID, courseID, score: 0, joinTime: moment()});
                    res.json({status: 1, msg: '添加成功'});
                }
            } else {
                res.json({status: 0, msg: '非法操作'})
            }
        }
    } catch (e) {
        console.log(e);
        res.json({status: 0, msg: '服务器错误'})
    }
};

/**
 * 查询老师课程
 */
exports.getTeacherCourse = async (req, res) => {
    let teacherID = req.session.userID;
    try {
        let course = await Detail.selectTeacherCourse(teacherID);
        res.json({status: 1, course})
    } catch (e) {
        console.log(e);
        res.json({status: 0, msg: '服务器错误'})
    }
};

/**
 * 从课程中删除学生
 */
exports.deleteStudent = async (req, res) => {
    let studentID = req.body.userID;
    let courseID = req.body.courseID;
    let teacherID = req.session.userID;
    try {
        if (teacherID === undefined || req.session.level !== 1) res.json({status: 0, msg: '非法访问'});
        else {
            await Class.deleteCourse(studentID, courseID);
            res.json({status: 1, msg: '删除成功'});
        }
    } catch (e) {
        console.log(e);
        res.json({status: 0, msg: '服务器错误'})
    }
};

/**
 * 获取课后测验成绩
 */
exports.getExerciseScore = async (req, res) => {
    let courseID = req.body.courseID;
    let studentID = req.body.userID;
    let teacherID = req.session.userID;
    try {
        if (teacherID === undefined || req.session.level !== 1) res.json({status: 0, msg: '非法访问'});
        else {
            let rows = await Exam.selectExerciseScore(studentID, courseID);
            res.json({status: 1, score: rows[0].score.toFixed(1)});
        }
    } catch (e) {
        console.log(e);
        res.json({status: 0, msg: '服务器错误'})
    }
};

/**
 * 设置学生的平时成绩
 */
exports.updateScore = async (req, res) => {
    let courseID = req.body.courseID;
    let studentID = req.body.userID;
    let teacherID = req.session.userID;
    try {
        if (teacherID === undefined || req.session.level !== 1) res.json({status: 0, msg: '非法访问'});
        else {
            let rows = await Exam.selectExerciseScore(studentID, courseID);
            let usualScore = rows[0].score;
            usualScore = usualScore === null ? 0 : usualScore;
            rows = await Exam.selectExamScore(studentID, courseID);
            let finalScore = rows[0].score;
            finalScore = finalScore === null ? 0 : finalScore;
            let sumScore = usualScore * 0.3 + finalScore * 0.7;
            await Class.update({courseID, userID: studentID}, {score: sumScore});
            res.json({status: 1, msg: '评分成功'})
        }
    } catch (e) {
        console.log(e);
        res.json({status: 0, msg: '服务器错误'})
    }
};
