'use strict';
const express = require('express');
const router = express.Router();
const UserInformation = require('../controllers/profile/personal');

/**
 * 获取个人资料
 * */
router.get('/personal', UserInformation.getUserInfo);
/**
 * 删除邮箱
 */
router.get('/personal/delete-email', UserInformation.deleteEmail);
/**
 * 绑定邮箱
 */
router.post('/personal/add-email', UserInformation.addEmail);
/**
 * 更换手机
 */
router.post('/personal/change-mobile', UserInformation.changePhone);
/**
 * 修改个人资料
 * */
router.post('/personal/update', UserInformation.updateUserInfo);
/**
 * 修改头像
 * */
router.post('/personal/avatar', UserInformation.updateAvatar);

module.exports = router;
