'use strict';
const express = require('express');
const svgCaptcha = require('svg-captcha');
const router = express.Router();

router.get('/', (req, res) => {
    const cap = svgCaptcha.create({
        size: 4,         //验证码长度
        inverse: false, // 翻转颜色
        fontSize: 50,   // 字体大小
        noise: 3,       // 噪声线条数
        width: 100,     // 宽度
        height: 45,     // 高度
        background: "#f4f3f2",
    });
    req['session'].imageCaptcha = cap.text; // session 存储验证码数值
    console.log(cap.text);
    res.type('svg'); // 响应的类型
    res.send(cap.data);
});

module.exports = router;
