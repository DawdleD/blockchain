'use strict';

const encryption = require('../../utils/encryption');
const {findAllByPhoneOrEmail, updateByUserID} = require('../../service/user/passport');
/**
 * 重置密码
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.reset = async (req, res) => {
    const account = req.body.data['account'];
    const password = req.body.data.password;
    const code = req.body.data.verify;
    const type = req.body.type;
    //用户是否存在
    await findAllByPhoneOrEmail(account, account).then(async rows => {
        if (rows.length > 0) {
            //用户重置密码方式
            let verifyCode =
                (type === 'email') ? req.session.mailCode : req.session.smsCode;
            if (verifyCode !== code || code === undefined) {
                res.json({status: 0, msg: "验证码错误"});
            } else {
                const salt = rows[0].salt;
                let newPassword = encryption.encryptPassword(salt, password);
                await updateByUserID(rows[0].userID, {password: newPassword, failCount: 0, banTime: null}).then(() => {
                    res.json({status: 1, msg: "重置密码成功"});
                })
            }
        } else res.json({status: 0, msg: "账号不存在"});
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: "服务器错误"})
    })
};
