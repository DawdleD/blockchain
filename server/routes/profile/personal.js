'use strict';
const express = require('express');
const router = express.Router();
const UserInformation = require('../../controllers/profile/personal');

/**
 * 获取个人资料
 * */
router.get('/', UserInformation.getUserInfo);
/**
 * 删除邮箱
 */
router.get('/delete-email', UserInformation.deleteEmail);
/**
 * 绑定邮箱
 */
router.post('/add-email', UserInformation.addEmail);
/**
 * 更换手机
 */
router.post('/change-mobile', UserInformation.changePhone);
/**
 * 修改个人资料
 * */
router.post('/update', UserInformation.updateUserInfo);
/**
 * 修改头像
 * */
router.post('/avatar', UserInformation.updateAvatar);

module.exports = router;
