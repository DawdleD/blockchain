'use strict';
const express = require('express');
const router = express.Router();
const UserInfo = require('../controllers/profile/personal');
const CourseInfo = require('../controllers/profile/course');
const ExamInfo = require('../controllers/profile/exam');

/**
 * 获取个人资料
 * */
router.get('/personal', UserInfo.getUserInfo);
/**
 * 删除邮箱
 */
router.get('/personal/delete-email', UserInfo.deleteEmail);
/**
 * 绑定邮箱
 */
router.post('/personal/add-email', UserInfo.addEmail);
/**
 * 更换手机
 */
router.post('/personal/change-mobile', UserInfo.changePhone);
/**
 * 修改个人资料
 * */
router.post('/personal/update', UserInfo.updateUserInfo);
/**
 * 修改头像
 * */
router.post('/personal/avatar', UserInfo.updateAvatar);
/**
 * 获取选择的课程
 */
router.get('/course', CourseInfo.selectCourse);
/**
 * 取消报名
 */
router.get('/course/cancel-free', CourseInfo.deleteCourse);
/**
 * 获取考试信息
 */
router.get('/exam', ExamInfo.getExam);

module.exports = router;
