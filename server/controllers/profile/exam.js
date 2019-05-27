'use strict';

const CourseClass = require('../../service/course-class');
const CourseExam = require('../../service/course-exam');
const Examine = require('../../service/examine');
const moment = require('moment');

/**
 * 查询用户考试信息
 */
let count = 0;
exports.getExam = async (req, res) => {
    if (req.session.userID === undefined) res.json({status: 0, msg: '未登录'});
    else {
        try {
            let page = req.query.page;
            count = await CourseClass.selectCount({userID: req.session.userID});
            let courseInfo = await CourseClass.selectInfo(req.session.userID, page);
            let course = [];
            for (let courses in courseInfo) if (courseInfo.hasOwnProperty(courses)) {
                let state, score = '无';
                let examTime = await CourseExam.selectTime(courseInfo[courses]['courseID']);
                let startTime = null, endTime = null;
                let examine = await Examine.select({examID: courseInfo[courses]['examID']});
                if (examTime.length === 0) state = '无考试';
                else {
                    startTime = examTime[0].startTime;
                    endTime = examTime[0].endTime;
                    if (moment().isBefore(startTime))
                        state = '未开始';
                    else if (moment().isAfter(endTime)) {
                        state = '已结束';
                        if (examine.length > 0) score = examine[0].score;
                        else score = 0;
                    } else if (examine.length > 0) {
                        state = '已完成';
                        score = examine[0].score;
                    } else state = '进行中';
                }
                course.push({
                    courseID: courseInfo[courses]['courseID'],
                    courseName: courseInfo[courses]['courseName'],
                    image: courseInfo[courses]['courseImage'],
                    joinTime: moment(courseInfo[courses]['UserInformations.CourseClass.joinTime'])
                        .format('YYYY-MM-DD'),
                    state, score,
                    time: {
                        startTime: startTime === null ? startTime : moment(startTime).format('YYYY.MM.DD'),
                        endTime: endTime === null ? endTime : moment(endTime).format('YYYY.MM.DD')
                    }
                })
            }
            res.json({status: 1, count, course});
        } catch (e) {
            console.log(e);
            res.json({status: 0, msg: '服务器错误'})
        }
    }
};

