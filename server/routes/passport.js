'use strict';
const express = require('express');
const router = express.Router();
const {login, checkLogin} = require('../controllers/passport/login');
const {register, checkPhone} = require('../controllers/passport/register');
const {reset} = require('../controllers/passport/reset');

/**
 * 检查用户用户是否登录
 * */
router.get('/check-login', checkLogin);
/**
 * 注销
 * */
router.get('/exit', (req, res) => {
    req['session'].destroy(inf => {
        console.log(inf);
        res.json({status: 1});
    });
});
/**
 * 检查用户手机号是否已被注册
 * */
router.post('/check-phone', checkPhone);
/**
 * 注册路由
 * */
router.post('/register', register);
/**
 * 登录路由
 * */
router.post('/login', login);
/**
 * 重置密码路由
 * */
router.post('/reset', reset);

module.exports = router;
