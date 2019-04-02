'use strict';
const express = require('express');
const router = express.Router();
const mysql = require('../../config/mysql-connect');
const encryption = require('../../config/encryption');
const moment = require('moment');

/**
 * 检查用户用户是否登录
 * */
router.get('/check-login', (req, res) => {
    if (req.session.loginState) {
        res.json({status: 1});
    } else {
        res.json({status: 0});
    }
});
/**
 * 注销
 * */
router.get('/exit', (req, res) => {
    req.session.destroy(function (inf) {
        console.log(inf);
        res.json({status: 1});
    });
});
/**
 * 检查用户手机号是否已被注册
 * */
router.post('/check-phone', async (req, res) => {
    const phone = req.body.phone;  //手机号
    const cmd = "select * from UserPassport where Phone = ?";
    await mysql.query(cmd, [phone]).then((rows) => {
        if (rows.length > 0) res.json({status: 1, message: "该手机号已被注册"});
        else res.json({status: 0})
    }).catch(() => {
        res.json({status: 1, message: "服务器错误"});
    })
});
/**
 * 注册路由
 * post
 * */
router.post('/register', async (req, res) => {
    const phone = req.body.data.phone;  //手机号
    const code = req.body.data.verify;  //验证码
    const password = req.body.data.password;  //密码
    //手机号验证
    const regPhone = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
    //密码验证
    const regPsw = /^[\w!#$%&'*+/=?^_`{|}~,.';":]{8,16}$/;
    //验证手机号、密码、验证码输入是否合格
    if (!phone.toString().match(regPhone) || !password.toString().match(regPsw) || code === undefined)
        res.json({status: 0, message: "输入有误"});
    else {
        console.log("验证通过");
        //检测手机号是否被注册
        let cmd = "select * from UserPassport where Phone = ?";
        await mysql.query(cmd, [phone]).then(async (rows) => {
            if (rows.length > 0)
                res.json({status: 0, message: "该手机号已被注册"});
            else if (req.session.smsCode !== code) {
                res.json({status: 0, message: "验证码错误"});
            } else {
                //随机生成用户ID
                let UserID = Math.random().toString().slice(2, 7);
                cmd = "select * from UserPassport where UserID = ?";
                await mysql.query(cmd, [UserID]).then(async (rows) => {
                    //如果用户ID重复则重新生成
                    while (rows.length > 0) {
                        UserID = Math.random().toString().slice(2, 7);
                        rows = await mysql.query(cmd, UserID);
                    }
                    cmd = `insert into UserPassport 
                    (UserID,Phone,Password,Salt,CreateTime,FailCount,AccessLevel) 
                    values(?,?,?,?,?,0,0)`;
                    const salt = encryption.getRandomHash();  //随机生成盐值
                    const encryptedPsw = encryption.encryptPassword(salt, password);  //加密密码
                    const time = new Date();  //获取当前时间
                    time.toLocaleString();
                    await mysql.query(cmd, [UserID, phone, encryptedPsw, salt, time]).then(() => {
                        req.session.loginState = true;
                        res.json({status: 1, message: "注册成功"});
                    })
                })
            }
        }).catch((err) => {
            console.log(err);
            res.json({status: 0, message: "注册失败"});
        });
    }
});
/**
 * 登录路由
 * post
 * */
router.post('/login', async (req, res) => {
    const code = req.body.data.verify;
    const account = req.body.data.account;
    const password = req.body.data.password;
    let cmd = `select * from UserPassport 
    where Phone = ? or Email = ?`;
    console.log(req.session.imageCaptcha);
    if (req.session.imageCaptcha === undefined) res.json({status: 0, message: "服务器错误"});
    else if (code.toUpperCase() !== req.session.imageCaptcha.toUpperCase())
        res.json({status: 0, message: "验证码错误"});
    else {
        await mysql.query(cmd, [account, account]).then(async (rows) => {
            //是否查询到用户
            if (rows.length > 0) {
                //首先判断用户是否被ban（禁止登录）
                if (rows[0]['BanTime'] !== null) {
                    let date = moment(rows[0]['BanTime']).format('YYYY-MM-DD HH:mm:ss');
                    res.json({
                        status: 0,
                        message: `您的账户已被锁定，请于 ${date} 后登录,或重置密码解锁账号`
                    });
                } else {
                    const salt = rows[0]['Salt'];
                    let failCount = rows[0]['FailCount'];
                    //如果密码不正确
                    if (rows[0]['Password'] !== encryption.encryptPassword(salt, password)) {
                        failCount++;   //输错密码次数+1
                        if (failCount === 6) {  //超过最多连续输错密码次数
                            cmd = `update UserPassport set BanTime = ?`;
                            let date = moment().add(1, "hour")
                                .format('YYYY-MM-DD HH:mm:ss');  //封禁用户至指定时间
                            await mysql.query(cmd, [date]).then(() => {
                                res.json({
                                    status: 0,
                                    message: `您已连续输错密码6次，账号将被封禁至 ${date},可重置密码解锁账号`
                                });
                            })
                        } else {  //连续输错密码
                            cmd = `update UserPassport set FailCount = ?`;
                            await mysql.query(cmd, [failCount]).then(() => {
                                res.json({
                                    status: 0,
                                    message: `密码错误(今日还剩${6 - failCount}次机会)`
                                });
                            })
                        }
                    } else {    //密码正确
                        cmd = `update UserPassport set 
                        LoginTime = ?,FailCount = 0,BanTime = null`;
                        let date = moment().format('YYYY-MM-DD HH:mm:ss');
                        await mysql.query(cmd, [date]).then(() => {
                            req.session.loginState = true;
                            res.json({status: 1, message: "登录成功"});
                        });
                    }
                }

            } else res.json({status: 0, message: "用户名或密码错误"});
        }).catch((err) => {
            console.log(err);
            res.json({status: 0, message: "服务器错误"});
        });
    }
});
/**
 * 重置密码路由
 * */
router.post('/reset', async (req, res) => {
    const account = req.body.data.account;
    const password = req.body.data.password;
    const code = req.body.data.verify;
    const type = req.body.type;
    //用户是否存在
    let cmd = `select * from UserPassport where Phone = ? or Email = ?`;
    await mysql.query(cmd, [account, account]).then(async (rows) => {
        if (rows.length > 0) {
            //用户重置密码方式
            let verifyCode =
                (type === 'email') ? req.session.mailCode : req.session.smsCode;
            if (verifyCode !== code || code === undefined) {
                res.json({status: 0, message: "验证码错误"});
            } else {
                const salt = rows[0]['Salt'];
                let newPassword = encryption.encryptPassword(salt, password);
                cmd = `update UserPassport set 
                Password = ?,FailCount = 0,BanTime = null`;
                await mysql.query(cmd, [newPassword]).then(() => {
                    res.json({status: 1, message: "重置密码成功"});
                });
            }
        } else res.json({status: 0, message: "账号不存在"});
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, message: "服务器错误"})
    })
});
module.exports = router;
