'use strict';
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

const indexRouter = require('./routes/index');
/*  发送短信验证码模块  */
const smsRouter = require('./routes/short-message');
/*  发送邮箱验证码模块  */
const emailSend = require('./routes/email-send');
/*  用户登录、注册、重置密码模块  */
const passportRouter = require('./routes/passport');
/*  图像验证码模块  */
const svgCaptcha = require('./routes/image-captcha');
/*  个人中心模块  */
const profilePersonal = require('./routes/profile');
/* 课程模块 */
const course = require('./routes/course');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*  session配置  */
app.use(session({
    secret: 'this is a session',  //用来对session id相关的cookie进行签名
    name: 'i1ji1354dsa',
    cookie: {maxAge: 1000 * 60 * 60 * 4},  //有效期，单位毫秒
    resave: false,  //是否每次都重新保存对话
    saveUninitialized: true
}));

app.use('/', indexRouter);
/*  发送短信验证码路由  */
app.use('/sms', smsRouter);
/*  发送邮箱验证码路由  */
app.use('/email-send', emailSend);
/*  图像验证码路由  */
app.use('/image-captcha', svgCaptcha);
/*  登录、注册、重置路由  */
app.use('/passport', passportRouter);
app.use('/passport', express.static(path.join(__dirname, 'public')));
/*  个人中心模块路由  */
app.use('/profile', profilePersonal);
app.use('/profile', express.static(path.join(__dirname, 'public')));
/* 课程模块路由 */
app.use('/course', course);
app.use('/course', express.static(path.join(__dirname, 'public')));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
