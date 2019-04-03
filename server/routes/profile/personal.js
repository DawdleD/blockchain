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
            let date = rows[0]['Birthday'] === null ?
                null : moment(rows[0]['Birthday']).format('YYYY-MM-DD');
            res.json({
                status: 1,
                message: {
                    phone: hidden.hiddenPhone(rows[0]['Phone']),
                    email: hidden.hiddenEmail(rows[0]['Email']),
                    birthday: date,
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
 * 测试用
 */
router.post('/test', (req, res) => {
    const email = req.body['email'];
    const phone = req.body['phone'];
    console.log(email);
    res.json({
        data: {
            email: hidden.hiddenEmail(email),
            phone: hidden.hiddenPhone(phone)
        }
    })
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
