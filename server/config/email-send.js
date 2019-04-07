'use strict';
const nodeMailer = require('nodemailer');
const svgCaptcha = require('svg-captcha');
const express = require('express');
const router = express.Router();

//发送邮箱设置
const transporter = nodeMailer.createTransport({
    host: "smtp.qq.com",  //邮箱服务器
    secureConnection: true,  //使用SSL安全连接
    port: 465,
    auth: {
        user: "louisdewey@foxmail.com",  //邮箱号
        pass: "dzujufvyevxlbcdf"  //授权码
    }
});

//发送内容设置
let mailOptions;

/**
 * 设置邮件发送内容
 * @param randomNum 随机数字
 * @param toMail 接受地址
 */
function setMailOptions(randomNum, toMail) {
    const htmlText = `您的动态码为：<b>${randomNum}</b>，您正在进行敏感操作，如非本人操作，请忽略本短信！`;
    mailOptions = {
        from: '区块链在线学习平台 louisdewey@foxmail.com', // 发送地址
        to: toMail, // 接收地址
        subject: '请接收你的验证码', // 标题
        html: htmlText  //带格式内容
    };
}

router.post('/', function (req, res) {
    //获取6位随机字符
    const randomNum = svgCaptcha.randomText(6);
    req['session'].mailCode = randomNum;
    //获取用户输入邮箱
    const email = req.body['account'];
    //验证用户输入是否正确
    const regMail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
    if (!email.match(regMail)) {
        const output = {status: 0, message: "输入邮箱有误！"};
        res.json(output);
    } else {
        //设置邮箱
        setMailOptions(randomNum, email);
        //发送邮件
        transporter.sendMail(mailOptions, function (error) {
            if (!error) {
                const output = {status: 1, message: "已发送验证码至您的邮箱，注意查收！"};
                res.json(output);
            } else {
                console.log(error);
                const output = {status: 0, message: "发送邮件失败，请联系管理员"};
                res.json(output);
            }
        });
    }
});

module.exports = router;
