'use strict';
const express = require('express');
const router = express.Router();
const mysql = require('../../config/mysql-connect');
const moment = require('moment');
const hidden = require('./hidden-information');
const uploadFile = require('../../config/upload');
const uploadSetting =
    uploadFile.uploadSetting('image/jpeg', 'public/images/avatar', 2 * 1024 * 1024);
const uploadImg = uploadSetting.single('avatar');
const deleteFile = require('../../config/delete-file');
const validate = require('./validate');
/**
 * 获取个人资料
 * */
router.get('/', async (req, res) => {
    if (req['session'].userID === undefined) {
        res.json({status: 0})
    } else {
        const cmd = `select * from UserInformation where UserID = ?`;
        const userID = req['session'].userID;
        await mysql.query(cmd, userID).then((rows) => {
            let birthday = rows[0]['Birthday'] === null ?
                null : moment(rows[0]['Birthday']).format('YYYY-MM-DD');
            let email = rows[0]['Email'] === null ?
                null : hidden.hiddenEmail(rows[0]['Email']);
            res.json({
                status: 1,
                message: {
                    mobile: hidden.hiddenPhone(rows[0]['Phone']),
                    email: email,
                    birthday: birthday,
                    sex: rows[0]['Sex'],
                    nickname: rows[0]['Nickname'],
                    realName: rows[0]['Name'],
                    avatarUrl: rows[0]['AvatarUrl']
                }
            });
        }).catch((error) => {
            console.log(error);
            res.json({status: 0})
        })
    }
});
/**
 * 删除邮箱
 */
router.get('/delete-email', async (req, res) => {
    if (req['session'].userID === undefined) {
        res.json({
            status: 0,
            message: '解绑失败'
        })
    } else {
        const cmd = `update UserInformation set Email = null where UserID = ?`;
        await mysql.query(cmd, [req['session'].userID]).then(() => {
            res.json({
                status: 1,
                message: '已解除绑定邮箱'
            })
        }).catch((err) => {
            console.log(err);
            res.json({
                status: 0,
                message: '服务器错误'
            })
        })
    }
});
/**
 * 绑定邮箱
 */
router.post('/add-email', async (req, res) => {
    if (req['session'].userID === undefined) {
        res.json({
            status: 0,
            message: '绑定失败'
        })
    } else {
        const verifyCode = req.body.data['verifyCode'];
        if (verifyCode !== req['session'].mailCode) res.json({
            status: 0,
            message: '验证码错误'
        });
        else {
            const cmd = `update UserInformation set Email = ? where UserID = ?`;
            await mysql.query(cmd, [req.body.data['account'], req['session'].userID]).then(() => {
                delete req['session'].mailCode;
                res.json({
                    status: 1,
                    message: '绑定邮箱成功',
                    email: hidden.hiddenEmail(req.body.data['account'])
                })
            }).catch((err) => {
                console.log(err);
                res.json({
                    status: 0,
                    message: '服务器错误'
                })
            })
        }
    }
});
/**
 * 更换手机
 */
router.post('/change-mobile', async (req, res) => {
    if (req['session'].userID === undefined) res.json({
        status: 0,
        message: '更换失败'
    });
    else {
        const phone = req.body.data['account'];
        const code = req.body.data['verifyCode'];
        const step = req.body['step'];
        console.log(phone, code, step);
        if (step === 0) {
            let cmd = `select * from UserInformation where Phone = ? and UserID = ?`;
            if (req['session'].smsCode !== code) res.json({
                status: 0,
                message: '验证码错误'
            });
            else {
                await mysql.query(cmd, [phone, req['session'].userID]).then((rows) => {
                    if (rows['length'] > 0) {
                        delete req['session'].smsCode;
                        res.json({
                            status: 1
                        });
                    } else res.json({
                        status: 0,
                        message: '绑定的手机号码不正确'
                    });
                }).catch((err) => {
                    console.log(err);
                    res.json({
                        status: 0,
                        message: '服务器错误'
                    })
                })
            }
        } else if (step === 1) {
            let cmd = `select * from UserInformation where Phone = ?`;
            if (req['session'].smsCode !== code) res.json({
                status: 0,
                message: '验证码错误'
            });
            else {
                await mysql.query(cmd, [phone]).then(async (rows) => {
                    if (rows['length'] > 0) res.json({
                        status: 0,
                        message: '该手机号已被注册'
                    });
                    else {
                        cmd = `update UserInformation set Phone = ? where UserID = ?`;
                        await mysql.query(cmd, [phone, req['session'].userID]).then(() => {
                            delete req['session'].smsCode;
                            res.json({
                                status: 1,
                                message: hidden.hiddenPhone(phone),
                            })
                        })
                    }
                }).catch((err) => {
                    console.log(err);
                    res.json({
                        status: 0,
                        message: '服务器错误'
                    })
                })
            }
        } else res.json({
            status: 0,
            message: '服务器错误'
        })
    }
});
/**
 * 修改个人资料
 * */
router.post('/update', async (req, res) => {
    if (req['session'].userID === undefined) {
        res.json({
            status: 0,
            message: '保存失败'
        })
    } else {
        const nickname = req.body.data['nickname'];
        const realName = req.body.data['realName'];
        const sex = req.body.data['sex'];
        let date = moment(req.body.data['birthday']).format('YYYY-MM-DD');
        if (
            validate.validateLength(nickname, 0, 15) &&
            validate.validateLength(realName, 0, 15) &&
            validate.validateSex(sex) &&
            date !== 'Invalid date') {
            const cmd =
                `update UserInformation set Nickname = ?,Name = ?,Birthday = ?,Sex = ? 
            where UserID = ?`;
            await mysql.query(cmd, [nickname, realName, date, sex, req['session'].userID]).then(() => {
                res.json({
                    status: 1,
                    message: '保存成功'
                })
            }).catch((error) => {
                console.log(error);
                res.json({
                    status: 0,
                    message: '服务器错误'
                })
            })
        } else {
            res.json({
                status: 0,
                message: '输入数据不合法'
            })
        }
    }
});
/**
 * 修改头像
 * */
router.post('/avatar', (req, res) => {
    if (req['session'].userID === undefined) {
        res.json({
            status: 0,
            message: '非法请求'
        })
    } else {
        /* 验证通过，执行上传 */
        uploadImg(req, res, async (err) => {
            /* 文件是否合法 */
            if (err === undefined) {
                let cmd = `select AvatarUrl from UserInformation where UserID = ?`;
                /* 如果头像已经存在，则在数据库中得到头像地址 */
                await mysql.query(cmd, [req['session'].userID]).then(async (rows) => {
                    if (rows[0]['AvatarUrl'] !== null) {
                        /* 删除原来的头像 */
                        deleteFile.unLink(`public/${rows[0]['AvatarUrl']}`);
                    }
                    /* 新的头像地址 */
                    const avatar = `/images/avatar/${req['file'].filename}`;
                    cmd = `update UserInformation set AvatarUrl = ? where UserID = ?`;
                    /* 更新头像地址 */
                    await mysql.query(cmd, [avatar, req['session'].userID]).then(() => {
                        res.json({
                            status: 1,
                            avatarUrl: avatar,
                            message: '上传成功'
                        });
                    })
                }).catch((error) => {
                    console.log(error);
                    res.json({
                        status: 0,
                        message: '服务器错误'
                    })
                });
            } else {
                console.log(err.message);
                let message = "未知错误";
                switch (err.message) {
                    case 'Unexpected field':
                        message = "非法文件请求";
                        break;
                    case 'ErrorMimetype':
                        message = "上传文件类型错误";
                        break;
                }
                res.json({
                    status: 0,
                    message: message
                })
            }
        })
    }
});
module.exports = router;
