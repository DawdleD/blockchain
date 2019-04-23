'use strict';

const Info = require('../../service/course-information');
const File = require('../../service/course-file');
const Class = require('../../service/course-class');
const Chapter = require('../../service/course-chapter');
const Comment = require('../../service/course-comment');
const Video = require('../../service/course-video');
const Detail = require('../../service/course-detail');
const System = require('../../service/course-system');
const Type = require('../../service/course-type');
const moment = require('moment');


/**
 * 获取课程基本信息
 */
exports.getDetail = async (req, res) => {
    const courseID = req.body.courseID;
    await Info.select({courseID: courseID}).then(async (infos) => {
        let details = await Detail.select({courseID: courseID});
        let detail = details[0], inf = infos[0];
        let teacherInfo = await Detail.selectTeacher({courseID: courseID});
        detail.teacherName = teacherInfo[0]['nickname'];
        detail.startTime = moment(detail.startTime).format('YYYY-MM-DD');
        detail.finishTime = moment(detail.finishTime).format('YYYY-MM-DD');
        let systems = await System.selectName(inf.systemID);
        let types = await Type.select({typeID: inf.typeID});
        inf.systemName = systems[0].systemName;
        inf.typeName = types[0].typeName;
        res.json({
            status: 1,
            course: {
                info: inf,
                details: detail
            }
        })
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    })
};

/**
 * 获取课程章节
 */
exports.getChapter = async (req, res) => {
    const courseID = req.query.courseID;
    let courseChapter = [];
    await Chapter.select({courseID: courseID}).then(async (chapters) => {
        for (let chapter in chapters) if (chapters.hasOwnProperty(chapter)) {
            let courseVideo = [];
            await Video.select({chapterID: chapters[chapter].chapterID}).then((videos) => {
                for (let video in videos) if (videos.hasOwnProperty(video)) {
                    courseVideo.push({
                        id: videos[video].videoID,
                        name: videos[video].videoName,
                        url: videos[video].videoUrl,
                        duration: videos[video].videoDuration
                    })
                }
            });
            courseChapter.push({
                number: chapter > 9 ? chapter : `0${parseInt(chapter) + 1}`,
                name: chapters[chapter].chapterName,
                video: courseVideo
            })
        }
        res.json({
            status: 1,
            data: courseChapter
        })
    }).catch(() => {
        res.json({status: 0, msg: '服务器错误'})
    })
};

/**
 * 获取课程文件
 */
exports.getFile = async (req, res) => {
    const courseID = req.query.courseID;
    let courseChapter = [];
    await Chapter.select({courseID: courseID}).then(async chapters => {
        for (let chapter in chapters) if (chapters.hasOwnProperty(chapter)) {
            let courseFile = [];
            await File.select({chapterID: chapters[chapter].chapterID}).then((files) => {
                for (let file in files) if (files.hasOwnProperty(file)) {
                    let fileSize = files[file].fileSize;
                    courseFile.push({
                        id: files[file].fileID,
                        name: files[file].fileName,
                        url: files[file].fileUrl,
                        type: files[file].fileType,
                        size: fileSize > 1024 ? `${(fileSize / 1024).toFixed(2)}MB` : `${fileSize}KB`
                    })
                }
            });
            courseChapter.push({
                number: chapter > 9 ? chapter : `0${parseInt(chapter) + 1}`,
                name: chapters[chapter].chapterName,
                file: courseFile
            })
        }
        res.json({
            status: 1,
            data: courseChapter
        })
    }).catch(() => {
        res.json({status: 0, msg: '服务器错误'})
    })
};

/**
 * 获取课程评论
 */
exports.getComment = async (req, res) => {
    const page = req.query.page;
    const filter = req.query.filter;
    const courseID = req.query.courseID;
    await Comment.select(courseID, filter, page).then(async comments => {
        let allCount = await Comment.selectCount(courseID, 0);
        let goodCount = await Comment.selectCount(courseID, 1);
        let midCount = await Comment.selectCount(courseID, 2);
        let badCount = await Comment.selectCount(courseID, 3);
        let comment = [];
        for (let cmt in comments) if (comments.hasOwnProperty(cmt)) {
            let userInfo = await Comment.selectUser({userID: comments[cmt].userID});
            comment.push({
                nickname: userInfo[0].nickname,
                avatarUrl: userInfo[0].avatarUrl === null ?
                    '/images/avatar/default-avatar.jpg' : userInfo[0].avatarUrl,
                star: comments[cmt].star,
                content: comments[cmt].content,
                time: moment(comments[cmt].time).format('YYYY-MM-DD HH:mm:ss')
            })
        }
        res.json({
            status: 1,
            count: {
                all: allCount,
                good: goodCount,
                mid: midCount,
                bad: badCount
            },
            comments: comment
        })
    }).catch(() => {
        res.json({status: 0, msg: '服务器错误'})
    })
};

/**
 * 添加课程评论
 */
exports.addComment = async (req, res) => {
    const userID = req.session.userID;
    if (userID === undefined) res.json({status: 0, msg: '错误操作'});
    else {
        const courseID = req.body.courseID;
        const content = req.body.comment;
        const star = req.body.star;
        if (content === undefined) res.json({status: 0, msg: '错误操作'});
        else if (content.toString().length < 15 || content.toString().length > 1000 || star > 5 || star < 1)
            res.json({status: 0, msg: '错误操作'});
        else await Class.select({userID: userID, courseID: courseID}).then(async rows => {
                if (rows.length > 0) {
                    await Comment.insert({
                        courseID: courseID,
                        userID: userID,
                        star: star,
                        content: content,
                        time: moment().format('YYYY-MM-DD HH:mm:ss')
                    });
                    let comment = await Comment.selectSum(courseID);
                    let sum = parseInt(comment[0]['sum']);
                    let favorableRate = ((sum * 2) / (comment[0]['count'] * 10)).toFixed(2);
                    await Info.update({courseID: courseID}, {favorableRate: favorableRate});
                    res.json({status: 1, msg: '评论成功', rate: favorableRate})
                } else res.json({status: 0, msg: '错误操作'})
            }).catch((err) => {
                console.log(err);
                res.json({status: 0, msg: '服务器错误'});
            })
    }
};

/**
 * 检测用户是否已报名
 */
exports.checkApply = async (req, res) => {
    const userID = req.session.userID;
    if (userID === undefined) res.json({status: 0});
    else {
        const courseID = req.body.courseID;
        await Class.select({userID: userID, courseID: courseID}).then(rows => {
            if (rows.length > 0) res.json({status: 1});
            else res.json({status: 0})
        }).catch(() => {
            res.json({status: 0});
        })
    }
};

/**
 * 报名课程
 */
exports.applyFree = async (req, res) => {
    const courseID = req.body.courseID;
    const userID = req.session.userID;
    const joinTime = moment().format('YYYY-MM-DD HH:mm:ss');
    await Class.insert({courseID: courseID, userID: userID, joinTime: joinTime}).then(async () => {
        let applySum = await Class.selectCount({courseID: courseID});
        Info.update({courseID: courseID}, {applyCount: applySum});
        res.json({status: 1, msg: '报名成功', applyCount: applySum})
    }).catch(() => {
        res.json({status: 0, msg: '服务器错误'})
    })
};

