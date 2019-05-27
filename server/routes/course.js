'use strict';
const express = require('express');
const router = express.Router();
const CourseList = require('../controllers/course/list');
const CourseInformation = require('../controllers/course/information');
const CourseExam = require('../controllers/course/exam');
const CourseVideo = require('../controllers/course/video');

/**
 * 获取课程体系
 */
router.get('/list/system', CourseList.getSystem);

/**
 * 获取课程类别
 */
router.get('/list/type', CourseList.getType);

/**
 * 获取课程页数
 */
router.post('/list/count', CourseList.getCourseCount);

/**
 * 获取课程
 */
router.get('/list', CourseList.getCourse);

/**
 * 获取推荐课程
 */
router.get('/list/recommend', CourseList.getRecommendCourse);

/**
 * 搜索课程
 */
router.get('/list/:search', CourseList.getCourse);

/**
 * 下载课程文件
 */
router.get('/information/file-download', CourseInformation.downloadFile);

/**
 * 获取课程详细信息
 */
router.post('/information', CourseInformation.getDetail);

/**
 * 获取课程章节
 */
router.get('/information/chapter', CourseInformation.getChapter);
/**
 * 获取课程文件
 */
router.get('/information/file', CourseInformation.getFile);
/**
 * 获取课程评论
 */
router.get('/information/comment', CourseInformation.getComment);

/**
 * 发表评论
 */
router.post('/information/comment', CourseInformation.addComment);

/**
 * 获取用户课程信息
 */
router.post('/information/class', CourseInformation.checkApply);

/**
 * 报名免费课程
 */
router.post('/information/apply-free', CourseInformation.applyFree);

/**
 * 首页展示课程
 */
router.get('/index-show', CourseList.getIndexCourse);

/**
 * 获取课后练习
 */
router.post('/exam', CourseExam.getCourseExam);

/**
 * 课后练习答题
 */
router.post('/exam-add', CourseExam.setCourseExam);

/**
 * 获取考试时间
 */
router.get('/exam-time', CourseExam.getExamTime);
/**
 * 检测用户是否能进入期末考试
 */
router.post('/exam-check', CourseExam.checkValid);

/**
 * pdf文档查看
 */
router.get('/course-ware', CourseVideo.getCourseWare);

module.exports = router;
