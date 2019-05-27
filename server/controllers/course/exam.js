'use strict';

const CourseExam = require('../../service/course-exam');
const Examine = require('../../service/examine');
const CourseClass = require('../../service/course-class');
const moment = require('moment');

/**
 * 获取试卷信息
 * @param exam 查询试卷需要信息
 */
async function getExam(exam) {
    let result = [];
    if (exam.type === 'exercise')
        result = await CourseExam.selectExercise({videoID: exam.id});
    else if (exam.type === 'exam') {
        result = await CourseExam.selectExam({courseID: exam.id});
        if (!moment().isBetween(result[0].startTime, result[0].endTime))
            result = [];
    }
    return result;
}

/**
 * 获取信息
 */
exports.getCourseExam = async (req, res) => {
    try {
        if (req.session.userID === undefined) res.json({status: 0, msg: '非法请求'});
        else {
            let exam = req.body.exam;
            let result = await getExam(exam);
            if (result.length > 0) {
                let userExam = await Examine.select({
                    userID: req.session.userID, examID: result[0].examID
                });
                let finished;
                if (userExam.length === 0) finished = {state: false};
                else finished = {state: true, score: userExam[0].score, result: userExam[0].result};
                res.json({status: 1, finished, exam: result[0].exam});
            } else res.json({status: 1, exam: false});
        }
    } catch (e) {
        console.log(e);
        res.json({status: 0, msg: '服务器错误'})
    }
};

/**
 * 答题
 */
exports.setCourseExam = async (req, res) => {
    try {
        if (req.session.userID === undefined) res.json({status: 0, msg: '非法请求'});
        else {
            let courseID = req.body.courseID;
            let exam = req.body.exam;
            let result = await getExam(exam);
            let inClass = await CourseClass.inClass({courseID, userID: req.session.userID});
            if (inClass) {
                const userAnswer = req.body.answer;
                let score = 0, exam = [], rightAnswer = result[0].answer, scoreEach = result[0].exam;
                if (userAnswer.length !== rightAnswer.length) res.json({status: -1, msg: '题目没有答完'});
                else {
                    for (let i = 0; i < rightAnswer.length; i++) {
                        let getScore = 0;
                        if (userAnswer[i] === rightAnswer[i]) {
                            score += scoreEach[i].score;
                            getScore = scoreEach[i].score;
                        }
                        exam.push({score: getScore, choose: userAnswer[i], number: i + 1})
                    }
                    await Examine.insert({
                        examID: result[0].examID,
                        userID: req.session.userID,
                        score, result: exam
                    });
                    res.json({status: 1, msg: '提交成功'});
                }
            } else res.json({status: 0, msg: '非法请求'});
        }
    } catch (e) {
        console.log(e);
        res.json({status: 0, msg: '服务器错误'})
    }
};

/**
 * 检测是否能进入答题界面
 */
exports.checkValid = async (req, res) => {
    try {
        if (req.session.userID === undefined) res.json({status: 0, msg: '需要登录后才能进行给操作'});
        else {
            let courseID = req.body.courseID;
            let result = await getExam({type: 'exam', id: courseID});
            let inClass = await CourseClass.inClass({courseID, userID: req.session.userID});
            if (inClass) {
                if (result.length === 0) res.json({status: 0, msg: '考试不存在'});
                else res.json({status: 1})
            } else res.json({status: 0, msg: '需要报名后才能进行该操作'});
        }
    } catch (e) {
        console.log(e);
        res.json({status: 0, msg: '服务器错误'})
    }
};

/**
 * 获取考试时间
 */
exports.getExamTime = async (req, res) => {
    const courseID = req.query.courseID;
    try {
        let time = await CourseExam.selectTime(courseID);
        res.json({
            status: 1,
            time: {
                startTime: moment(time[0].startTime).format('YYYY.MM.DD'),
                endTime: moment(time[0].endTime).format('YYYY.MM.DD')
            }
        });
    } catch (e) {
        console.log(e);
        res.json({status: 0, msg: '服务器错误'});
    }
};

