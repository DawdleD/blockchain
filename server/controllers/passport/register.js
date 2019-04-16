'use strict';

const encryption = require('../../utils/encryption');
const {findAllByPhoneOrEmail, addUser} = require('../../service/user/passport');
const {addUserInfo} = require('../../service/user/information');
/**
 * 注册
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.register = async (req, res) => {
    const phone = req.body.data.phone;  //手机号
    const code = req.body.data.verify;  //验证码
    const password = req.body.data.password;  //密码
    //手机号验证
    const regPhone = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
    //密码验证
    const regPsw = /^[\w!#$%&'*+/=?^_`{|}~,.;":]{8,16}$/;
    //验证手机号、密码、验证码输入是否合格
    if (!phone.toString().match(regPhone) || !password.toString().match(regPsw) || code === undefined)
        res.json({status: 0, msg: "输入有误"});
    else {
        console.log("验证通过");
        //检测手机号是否被注册
        await findAllByPhoneOrEmail(phone, phone).then(async rows => {
            if (rows.length > 0)
                res.json({status: 0, msg: "该手机号已被注册"});
            else if (req.session.smsCode !== code)
                res.json({status: 0, msg: "验证码错误"});
            else {
                //随机生成用户ID
                let userID = Math.random().toString().slice(2, 9);
                const salt = encryption.getRandomHash();  //随机生成盐值
                const encryptedPsw = encryption.encryptPassword(salt, password);  //加密密码
                const time = new Date();  //获取当前时间
                time.toLocaleString();
                let state = true;
                while (state) {
                    await addUser(userID, phone, encryptedPsw, salt, time, 0, 0).then(async () => {
                        await addUserInfo({userID:userID});
                        req.session.loginState = true;
                        req.session.userID = userID;
                        res.json({status: 1, msg: "注册成功"});
                        state = false;
                    }).catch(() => {
                        userID = Math.random().toString().slice(2, 9);
                    });
                }
            }
        }).catch((err) => {
            console.log(err);
            res.json({status: 0, msg: "服务器错误"})
        })
    }
};
/**
 * 检查手机号是否已存在
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.checkPhone = async (req, res) => {
    const phone = req.body.phone;  //手机号
    await findAllByPhoneOrEmail(phone, phone).then(rows => {
        if (rows.length > 0) res.json({status: 1, msg: "该手机号已被注册"});
        else res.json({status: 0})
    }).catch(() => {
        res.json({status: 1, msg: "服务器错误"});
    })
};
