'use strict';
const express = require('express');
const router = express.Router();
const mysql = require('../../utils/mysql-connect');
const moment = require('moment');
/**
 * 获取课程基本信息
 */
router.post('/', async (req, res) => {
    const courseID = req.body['courseID'];
    let cmd = `select * from CourseInformation where CourseID = ?`;
    let information = {
        courseName: '', systemName: '', systemID: 0, typeName: '', typeID: 0,
        price: 0, applyCount: 0, favorable: 0
    };
    let detail = {
        teacherName: '李老师', courseSummary: '', courseTarget: '', startTime: '',
        finishTime: '', courseArrange: ''
    };
    await mysql.query(cmd, [courseID]).then(async (info) => {
        information.courseName = info[0]['CourseName'];
        information.price = info[0]['Price'];
        information.applyCount = info[0]['ApplyCount'];
        information.favorable = info[0]['Favorable'];
        information.systemID = info[0]['SystemID'];
        information.typeID = info[0]['TypeID'];
        cmd = `select get_system_name(?) as system,get_type_name(?) as type`;
        await mysql.query(cmd, [info[0]['SystemID'], info[0]['TypeID']]).then((rows) => {
            information.systemName = rows[0]['system'];
            information.typeName = rows[0]['type'];
        });
        cmd = `select * from CourseDetail where CourseID = ?`;
        await mysql.query(cmd, courseID).then((rows) => {
            detail.courseSummary = rows[0]['CourseSummary'];
            detail.courseTarget = rows[0]['CourseTarget'];
            detail.startTime = moment(rows[0]['StartTime']).format('YYYY-MM-DD');
            detail.finishTime = moment(rows[0]['FinishTime']).format('YYYY-MM-DD');
            detail.courseArrange = rows[0]['CourseArrange'];
        });
        res.json({
            status: 1,
            course: {
                info: information,
                details: detail
            }
        })
    }).catch((err) => {
        console.log(err);
        res.json({
            status: 0,
            message: '服务器错误'
        })
    })
});

/**
 * 获取课程章节
 */
router.get('/chapter', async (req, res) => {
    const courseID = req.query['courseID'];
    let cmd = `select * from CourseChapter where CourseID = ?`;
    let courseChapter = [];
    await mysql.query(cmd, courseID).then(async (chapters) => {
        cmd = `select * from CourseVideo where ChapterID = ?`;
        for (let chapter in chapters) if (chapters.hasOwnProperty(chapter)) {
            let courseVideo = [];
            await mysql.query(cmd, chapters[chapter]['ChapterID']).then((videos) => {
                for (let video in videos) if (videos.hasOwnProperty(video)) {
                    courseVideo.push({
                        id: videos[video]['VideoID'],
                        name: videos[video]['VideoName'],
                        url: videos[video]['VideoUrl'],
                        duration: videos[video]['VideoDuration']
                    })
                }
            });
            courseChapter.push({
                number: chapter > 9 ? chapter : `0${parseInt(chapter) + 1}`,
                name: chapters[chapter]['ChapterName'],
                video: courseVideo
            })
        }
        res.json({
            status: 1,
            data: courseChapter
        })
    }).catch(() => {
        res.json({
            status: 0,
            message: '服务器错误'
        })
    })
});
module.exports = router;
