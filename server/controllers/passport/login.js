'use strict';
const encryption = require('../../utils/encryption');
const moment = require('moment');
const UserPass = require('../../service/user-passport');
const UserInfo = require('../../service/user-information');

/**
 * 登录
 */
exports.login = async (req, res) => {
    const code = req.body.data.verify;
    const account = req.body.data['account'];
    const password = req.body.data.password;
    //先检查验证码是否存在
    try {
        if (req.session.imageCaptcha === undefined) res.json({status: 0, msg: "服务器错误"});
        else if (code.toUpperCase() !== req.session.imageCaptcha.toUpperCase())
            res.json({status: 0, msg: "验证码错误"});
        else {
            await UserPass.selectOr([{phone: account}, {email: account}]).then(async (rows) => {
                    if (rows.length > 0) {
                        //首先判断用户是否被ban（禁止登录）
                        if (rows[0].banTime !== null) {
                            let date = moment(rows[0].banTime).format('YYYY-MM-DD HH:mm:ss');
                            //如果到了封禁时间，解封
                            if (moment().isAfter(moment(rows[0].banTime))){
                                await UserPass.update({userID: rows[0].userID}, {failCount: 0, banTime: null});
                                res.json({status: 0, msg: `登录有误，请重试`});
                            }
                            else res.json({status: 0, msg: `您的账户已被锁定，请于 ${date} 后登录,或重置密码解锁账号`});
                        } else {
                            const salt = rows[0].salt;
                            let userID = rows[0].userID;
                            let failCount = rows[0].failCount;
                            //如果密码不正确
                            if (rows[0].password !== encryption.encryptPassword(salt, password)) {
                                failCount++;   //输错密码次数+1
                                if (failCount === 6) {  //超过最多连续输错密码次数
                                    let date = moment().add(1, "hour")
                                        .format('YYYY-MM-DD HH:mm:ss');  //封禁用户至指定时间
                                    await UserPass.update({userID: userID}, {failCount: 6, banTime: date});
                                    res.json({status: 0, msg: `您已连续输错密码6次，账号将被封禁至 ${date},可重置密码解锁账号`});
                                } else {  //连续输错密码
                                    await UserPass.update({userID: userID}, {failCount: failCount});
                                    res.json({status: 0, msg: `密码错误(今日还剩${6 - failCount}次机会)`});
                                }
                            } else {    //密码正确
                                let date = moment().format('YYYY-MM-DD HH:mm:ss');
                                await UserPass.update({userID: userID}, {
                                    loginTime: date,
                                    failCount: 0,
                                    banTime: null
                                });
                                req.session.loginState = true;
                                req.session.userID = userID;
                                res.json({status: 1, msg: "登录成功"});
                            }
                        }
                    } else
                        res.json({status: 0, msg: "用户名或密码错误"})
                }
            );
        }
    } catch (e) {
        console.log(e);
        res.json({status: 0, msg: "服务器错误"});
    }

};

/**
 * 检查登录状态
 */
exports.checkLogin = async (req, res) => {
    if (req.session.loginState) {
        await UserInfo.select({userID: req.session.userID}).then(rows => {
            res.json({
                status: 1,
                data: {
                    nickName: rows[0].nickName,
                    avatarUrl: rows[0].avatarUrl === null ? '/images/avatar/default-avatar.jpg' : rows[0].avatarUrl
                },
                effectiveTime: moment(req.session.cookie['_expires']).format('YYYY-MM-DD HH:mm:ss')
            })
            ;
        }).catch(() => {
            res.json({status: 0, msg: '服务器错误'});
        });
    } else {
        res.json({status: 0});
    }
};

