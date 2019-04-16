<template>
    <div class="passport">
        <div class="logo">
            <router-link to="/">
                <img alt="Logo" src="../../assets/image/logo-bcs.png">
            </router-link>
        </div>
        <div class="main">
            <h4 class="title">
                <div class="">
                    <router-link to="/passport/login">登录</router-link>
                    <b>·</b>
                    <router-link class="active" to="/passport/register">注册</router-link>
                </div>
            </h4>
            <div class="">
                <form>
                    <div v-bind:class="inputCss.phone">
                        <label>
                            <input v-model="registerForm.phone"
                                   v-on:keyup="checkInput(inputName[0])"
                                   type="text" placeholder="手机号">
                        </label>
                        <i class="fa fa-mobile-alt"></i>
                    </div>
                    <div class="error-show" v-if="inputEmpty.phone">{{ inputCheck.phone }}</div>

                    <div v-bind:class="inputCss.password">
                        <label>
                            <input
                                    v-model="registerForm.password"
                                    v-on:keyup="checkInput(inputName[1])"
                                    type="password" placeholder="设置密码(8-16位)">
                        </label>
                        <i class="fa fa-lock"></i>
                    </div>
                    <div class="error-show" v-if="inputEmpty.password">{{ inputCheck.password }}</div>

                    <div v-bind:class="inputCss.confirm">
                        <label>
                            <input
                                    v-model="registerForm.confirm"
                                    v-on:keyup="checkInput(inputName[2])"
                                    type="password" placeholder="再输一遍密码">
                        </label>
                        <i class="fa fa-lock"></i>
                    </div>
                    <div class="error-show" v-if="inputEmpty.confirm">{{ inputCheck.confirm }}</div>

                    <div v-bind:class="inputCss.verify">
                        <label>
                            <input v-model="registerForm.verify"
                                   v-on:keyup="checkInput(inputName[3])"
                                   v-on:keyup.exact.enter="registerButtonClick"
                                   type="text" placeholder="验证码">
                        </label>
                        <i class="fa fa-shield-alt"></i>
                        <a v-bind:class="sendCodeCss" v-on:click="sendVerifyCode">{{ verifyCodeText }}</a>
                    </div>

                    <div class="error-show" v-if="inputEmpty.verify">{{ inputCheck.verify }}</div>
                    <button class="register-button" type="button" v-on:click="registerButtonClick">
                        注册
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import {Message} from 'element-ui'

    export default {
        name: "Register",
        data() {
            return {
                //输入框名
                inputName: ["phone", "password", "confirm", "verify"],
                //输入框是否为空
                inputEmpty: {
                    phone: false, password: false, confirm: false, verify: false
                },
                //整个表单控件
                registerForm: {
                    phone: "", password: "", confirm: "", verify: ""
                },
                //用户输入框CSS
                inputCss: {
                    phone: "", password: "", confirm: "", verify: ""
                },
                //输入正确时显示的CSS
                prepend: {
                    phone: {'input-prepend': true, restyle: true, 'no-radius': false},
                    password: {'input-prepend': true, restyle: true, 'no-radius': true},
                    confirm: {'input-prepend': true, restyle: true, 'no-radius': true},
                    verify: {'input-prepend': true, restyle: false, 'no-radius': false}
                },
                //输入错误时显示的CSS
                warn: {"input-warn": true},
                //用户输入检查文本
                inputCheckText: {
                    phone: ["请输入手机号", "请输入正确的手机号"],
                    password: ["请输入密码", "密码长度不能小于8位"],
                    confirm: ["请输入密码", "两次输入的密码不一致"],
                    verify: ["请输入验证码"]
                },
                inputCheck: {
                    phone: '', password: '', confirm: '', verify: ''
                },
                //验证码区域显示文本
                verifyCodeText: "发送验证码",
                //发送验证码按钮CSS
                sendCodeCss: {"btn-in-resend": true, disable: true}
            }
        },
        methods: {
            //改变输入框样式
            changeInputClass: function (value, option, text) {
                if (option === 1) {
                    this.inputCheck[value] = text;
                    this.inputEmpty[value] = true;
                    this.inputCss[value] = this.warn;
                } else {
                    this.inputEmpty[value] = false;
                    this.inputCss[value] = this.prepend[value];
                }
            },
            //检查用户手机号，密码是否输入合格
            checkInput: function (value) {
                //首先检查是否为空值
                const regPhone = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
                const regPassword = /^[\w!#$%&'*+/=?^_`{|}~,.;":]{8,16}$/;
                if (this.registerForm[value] === '')  //任何输入框为空
                    this.changeInputClass(value, 1, this.inputCheckText[value][0]);
                else if (value === "phone" && !this.registerForm.phone.match(regPhone))    //用户账号不合法
                    this.changeInputClass(value, 1, this.inputCheckText[value][1]);
                else if (value === "phone" && this.registerForm.phone.match(regPhone)) {    //手机号已被注册
                    const register = this;
                    this.$axios.post('/api/passport/check-phone', {
                        phone: register.registerForm.phone
                    }).then((response) => {
                        if (response.data.status === 1) register.changeInputClass(value, 1, response.data.msg);
                        else {
                            this.sendCodeCss.disable = false;
                            register.changeInputClass(value, 0, null);
                        }
                    }).catch(() => {
                        register.changeInputClass(value, 1, "发生了未知的错误");
                    })
                } else if (value === "password" && !this.registerForm.password.match(regPassword))   //密码输入不合法
                    this.changeInputClass(value, 1, this.inputCheckText[value][1]);
                else if (value === "confirm" && this.registerForm.password !== this.registerForm.confirm)  //两次输入的密码不一致
                    this.changeInputClass(value, 1, this.inputCheckText[value][1]);
                else
                    this.changeInputClass(value, 0, null);
            },
            //发送验证码
            sendVerifyCode: async function () {
                this.sendCodeCss.disable = true;
                let times = 60;   //按钮点击间隔
                let self = this;
                let timer = await setInterval(function () {
                    self.verifyCodeText = "重新发送(" + times + "s)";
                    times--;
                    if (times < 0) window.clearInterval(timer);
                }, 1000);
                setTimeout(function () {
                    self.verifyCodeText = "发送验证码";
                    self.sendCodeCss.disable = false;
                }, 61000);
                this.$axios.post('/api/sms', {
                    account: this.registerForm.phone,
                    option: "register"
                }).then((response) => {
                    if (response.data.status === 0)
                        Message.error(response.data.msg);
                    else
                        Message.success(response.data.msg);
                }).catch((err) => {
                    console.log(err);
                    Message.warning('发生了未知错误');
                })
            },
            //注册按钮
            registerButtonClick: function () {
                if (this.registerForm.phone === '') this.checkInput('phone');
                else if (this.registerForm.password === '') this.checkInput('password');
                else if (this.registerForm.confirm === '') this.checkInput('confirm');
                else if (this.registerForm.verify === '') this.checkInput('verify');
                else {
                    this.$axios.post('/api/passport/register', {
                        data: this.registerForm
                    }).then((response) => {
                        if (response.data.status === 1) {
                            Message.success(response.data.msg);
                            setTimeout(() => {
                                window.location.href = '/';
                            }, 1000);
                        } else Message.error(response.data.msg);
                    }).catch((error) => {
                        Message.warning('发生了未知错误');
                        console.log(error);
                    });
                }
            }
        },
        mounted() {
            for (let item in this.inputCss) {
                if (this.inputCss.hasOwnProperty(item))
                    this.inputCss[item] = this.prepend[item];
            }
        }
    }
</script>

<style src="../../assets/css/passport.css" scoped></style>
