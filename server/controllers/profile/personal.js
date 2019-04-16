'use strict';
const moment = require('moment');
const uploadFile = require('../../utils/upload');
const uploadSetting =
    uploadFile.uploadSetting('image/jpeg', 'public/images/avatar', 2 * 1024 * 1024);
const uploadImg = uploadSetting.single('avatar');
const deleteFile = require('../../utils/delete-file');
const Information = require('../../service/user/information');
const Passport = require('../../service/user/passport');


/**
 * 隐藏手机号中间四位
 * @param phone 手机号
 * @returns {string} xxx****xxxx
 */
function hiddenPhone(phone) {
    if (phone.length === 11) {
        return `${phone.substring(0, 3)}****${phone.substring(7, 11)}`;
    } else {
        return "****";
    }
}

/**
 * 隐藏邮箱号中间四位
 * @param email 邮箱号
 * @returns {string} aa****aa@bb.com
 */
function hiddenEmail(email) {
    let index = email.indexOf('@');
    let head = email.substring(0, index);
    let tail = email.substring(index, email.length);
    if (index < 5) return `****${tail}`;
    else {
        let number = (head.length - 4) / 2;
        number = parseInt(number.toString());
        if (head.length % 4 === 0 || head.length % 4 === 2)
            return `${head.substring(0, number)}****${head.substring(head.length - number, head.length)}${tail}`;
        else
            return `${head.substring(0, number)}****${head.substring(head.length - number - 1, head.length)}${tail}`;
    }
}

/**
 * 验证长度
 * @param text 需要验证的文本
 * @param minLength 最小长度
 * @param maxLength 最大长度
 * @returns {boolean}
 */
function validateLength(text, minLength, maxLength) {
    return !(text.length > maxLength || text.length < minLength);
}

/**
 * 验证性别
 * @param sex 性别
 * @returns {boolean}
 */
function validateSex(sex) {
    return (sex === 'S' || sex === 'F' || sex === 'M');
}

/**
 * 获取个人资料
 * */
exports.getUserInfo = async (req, res) => {
    if (req.session.userID === undefined) {
        res.json({status: 0})
    } else {
        const userID = req.session.userID;
        await Information.findAllByUserID(userID).then(async (rows) => {
            let birthday = rows[0].birthday === null ?
                null : moment(rows[0].birthday).format('YYYY-MM-DD');
            let result = await Passport.findAllByUserID(userID);
            let email = result[0].email === null ?
                null : hiddenEmail(result[0].email);
            res.json({
                status: 1,
                msg: {
                    mobile: hiddenPhone(result[0].phone),
                    email: email,
                    birthday: birthday,
                    sex: rows[0].sex,
                    nickname: rows[0].nickname,
                    realName: rows[0].realName,
                    avatarUrl: rows[0].avatarUrl
                }
            });
        }).catch((error) => {
            console.log(error);
            res.json({status: 0})
        })
    }
};

/**
 * 删除邮箱
 */
exports.deleteEmail = async (req, res) => {
    if (req.session.userID === undefined) {
        res.json({status: 0, msg: '解绑失败'})
    } else {
        await Passport.updateByUserID(req.session.userID, {email: null}).then(() => {
            res.json({status: 1, msg: '已解除绑定邮箱'})
        }).catch((err) => {
            console.log(err);
            res.json({status: 0, msg: '服务器错误'})
        })
    }
};

/**
 * 绑定邮箱
 */
exports.addEmail = async (req, res) => {
    if (req.session.userID === undefined) {
        res.json({status: 0, msg: '绑定失败'})
    } else {
        const verifyCode = req.body.data['verifyCode'];
        if (verifyCode !== req['session'].mailCode) res.json({status: 0, msg: '验证码错误'});
        else {
            await Passport.updateByUserID(req.session.userID, {email: req.body.data['account']}).then(() => {
                delete req.session.mailCode;
                res.json({status: 1, msg: '绑定邮箱成功', email: hiddenEmail(req.body.data['account'])})
            }).catch((err) => {
                console.log(err);
                res.json({status: 0, msg: '服务器错误'})
            })
        }
    }
};

/**
 * 更换绑定手机号
 */
exports.changePhone = async (req, res) => {
    if (req.session.userID === undefined) res.json({status: 0, msg: '更换失败'});
    else {
        const phone = req.body.data['account'];
        const code = req.body.data['verifyCode'];
        const step = req.body['step'];
        console.log(phone, code, step);
        if (step === 0) {
            if (req.session.smsCode !== code) res.json({status: 0, msg: '验证码错误'});
            else {
                await Passport.findAllByUserID(req.session.userID).then((rows) => {
                    if (rows[0].phone === phone) {
                        delete req.session.smsCode;
                        res.json({status: 1});
                    } else res.json({status: 0, msg: '绑定的手机号码不正确'});
                }).catch((err) => {
                    console.log(err);
                    res.json({status: 0, msg: '服务器错误'})
                })
            }
        } else if (step === 1) {
            if (req.session.smsCode !== code) res.json({status: 0, msg: '验证码错误'});
            else {
                await Passport.findAll({phone: phone}).then(async (rows) => {
                    if (rows.length > 0) res.json({status: 0, msg: '该手机号已被注册'});
                    else {
                        await Passport.updateByUserID(req.session.userID, {phone: phone}).then(() => {
                            delete req.session.smsCode;
                            res.json({status: 1, msg: hiddenPhone(phone),})
                        })
                    }
                }).catch((err) => {
                    console.log(err);
                    res.json({status: 0, msg: '服务器错误'})
                })
            }
        } else res.json({status: 0, msg: '服务器错误'})
    }
};

/**
 * 修改个人资料
 */
exports.updateUserInfo = async (req, res) => {
    if (req.session.userID === undefined) {
        res.json({status: 0, msg: '保存失败'})
    } else {
        const nickname = req.body.data['nickname'];
        const realName = req.body.data['realName'];
        const sex = req.body.data['sex'];
        let date = moment(req.body.data['birthday']).format('YYYY-MM-DD');
        if (
            validateLength(nickname, 0, 15) &&
            validateLength(realName, 0, 15) &&
            validateSex(sex) && date !== 'Invalid date') {
            await Information.updateByUserID(req.session.userID, {
                nickname: nickname,
                realName: realName,
                birthday: date,
                sex: sex
            }).then(() => {
                res.json({status: 1, msg: '保存成功'})
            }).catch((error) => {
                console.log(error);
                res.json({status: 0, msg: '服务器错误'})
            })
        } else {
            res.json({status: 0, msg: '输入数据不合法'})
        }
    }
};

/**
 * 修改头像
 */
exports.updateAvatar = (req, res) => {
    if (req.session.userID === undefined) {
        res.json({status: 0, msg: '非法请求'})
    } else {
        /* 验证通过，执行上传 */
        uploadImg(req, res, async (err) => {
            /* 文件是否合法 */
            if (err === undefined) {
                /* 如果头像已经存在，则在数据库中得到头像地址 */
                await Information.findAllByUserID(req.session.userID).then(async (rows) => {
                    if (rows[0].avatarUrl !== null) {
                        /* 删除原来的头像 */
                        deleteFile.unLink(`public/${rows[0]['AvatarUrl']}`);
                    }
                    /* 新的头像地址 */
                    const avatar = `/images/avatar/${req['file'].filename}`;
                    /* 更新头像地址 */
                    await Information.updateByUserID(req.session.userID, {avatarUrl: avatar}).then(() => {
                        res.json({status: 1, avatarUrl: avatar, msg: '上传成功'});
                    })
                }).catch((error) => {
                    console.log(error);
                    res.json({status: 0, msg: '服务器错误'})
                });
            } else {
                console.log(err.message);
                let msg = "未知错误";
                switch (err.message) {
                    case 'Unexpected field':
                        msg = "非法文件请求";
                        break;
                    case 'ErrorMimetype':
                        msg = "上传文件类型错误";
                        break;
                }
                res.json({status: 0, msg: msg})
            }
        })
    }
};
