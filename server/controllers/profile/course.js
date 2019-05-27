'use strict';

const CourseClass = require('../../service/course-class');
const moment = require('moment');

let count = 0;
/**
 * 用户查询自己所选的课程
 */
exports.selectCourse = async (req, res) => {
    if (req.session.userID === undefined) res.json({status: 0, msg: '未登录'});
    else {
        try {
            let page = req.query.page;
            count = await CourseClass.selectCount({userID: req.session.userID});
            let courseInfo = await CourseClass.selectInfo(req.session.userID, page);
            let course = [];
            for (let courses in courseInfo) if (courseInfo.hasOwnProperty(courses)) {
                course.push({
                    courseID: courseInfo[courses]['courseID'],
                    courseName: courseInfo[courses]['courseName'],
                    price: courseInfo[courses]['price'],
                    image: courseInfo[courses]['courseImage'],
                    score: courseInfo[courses]['UserInformations.CourseClass.score'],
                    joinTime: moment(courseInfo[courses]['UserInformations.CourseClass.joinTime'])
                        .format('YYYY-MM-DD'),
                })
            }
            res.json({status: 1, count, course});
        } catch (e) {
            console.log(e);
            res.json({status: 0, msg: '服务器错误'})
        }
    }
};

/**
 * 取消报名课程
 */
exports.deleteCourse = async (req, res) => {
    if (req.session.userID === undefined) res.json({status: 0, msg: '未登录'});
    else {
        try {
            let courseID = req.query.courseID;
            let isFree = await CourseClass.isFreeCourse(courseID);
            if (isFree) {
                await CourseClass.deleteCourse(req.session.userID, courseID);
                res.json({status: 1, msg: '取消报名成功'});
            } else res.json({status: 0, msg: '非法操作'});
        } catch (e) {
            console.log(e);
            res.json({status: 0, msg: '服务器错误'})
        }
    }
};
