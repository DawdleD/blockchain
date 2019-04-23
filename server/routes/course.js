'use strict';
const express = require('express');
const router = express.Router();
const CourseList = require('../controllers/course/list');
const CourseInformation = require('../controllers/course/information');

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
router.post('/information/comment',CourseInformation.addComment);

/**
 * 获取用户课程信息
 */
router.post('/information/class', CourseInformation.checkApply);

/**
 * 报名免费课程
 */
router.post('/information/apply-free',CourseInformation.applyFree);

module.exports = router;
