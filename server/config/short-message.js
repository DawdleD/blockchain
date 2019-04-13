'use strict';
const Core = require('@alicloud/pop-core');
const express = require('express');
const router = express.Router();

const client = new Core({
    accessKeyId: 'LTAI0wLfho04gkMv',
    accessKeySecret: 'Qr4M8sC7OBBxbIkWTgV5aby7yzWozS',
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
});

let verifyCode = '000000';

function setVerifyCode() {
    verifyCode = Math.random().toString().slice(2, 8);
}

function getVerifyCode() {
    return verifyCode;
}

function setParams(option, phoneNumbers) {
    const TemplateCode = {
        register: "SMS_161896052",
        reset: "SMS_161891029",
        change: "SMS_162736939"
    };
    return {
        "PhoneNumbers": phoneNumbers,
        "SignName": "区块链在线学习平台",
        "TemplateCode": TemplateCode[option],
        "TemplateParam": `{\"code\":\"${verifyCode}\"}`
    }
}

const requestOption = {
    method: 'POST'
};

router.post('/', function (req, res) {
    const phone = req.body['account'];
    const option = req.body['option'];
    console.log(phone, option);
    const reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
    if ((option !== 'register' && option !== 'reset' && option !== 'change') || !phone.toString().match(reg))
        res.json({status: 0, message: '参数不合法'});
    else {
        setVerifyCode();
        const params = setParams(option, phone);
        client.request('SendSms', params, requestOption).then(() => {
            // console.log(result);
            req['session'].smsCode = getVerifyCode();
            res.json({status: 1, message: "短信已发送至您的手机，请注意查收"});
        }, (ex) => {
            console.log(ex);
            res.json({status: 0, message: "短信发送失败，请稍后再试"});
        });
    }
});

module.exports = router;




