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
                    <a v-bind:class="accountChooseClass.phone"
                       v-on:click="changeAccount(accountChooseClass.phoneName)">手机</a>
                    <b>·</b>
                    <a v-bind:class="accountChooseClass.email"
                       v-on:click="changeAccount(accountChooseClass.emailName)">邮箱</a>
                </div>
            </h4>
            <div class="">
                <form>
                    <div v-bind:class="inputCss.account">
                        <label v-if="accountChooseClass.phone.active">
                            <input v-model="resetForm.account"
                                   v-on:keyup="checkInput(inputName[0])"
                                   type="text" placeholder="手机号">
                            <i class="fa fa-mobile-alt"></i>
                        </label>

                        <!--更换验证方式-->
                        <label v-if="accountChooseClass.email.active">
                            <input v-model="resetForm.account"
                                   v-on:keyup="checkInput(inputName[0])"
                                   type="text" placeholder="邮箱">
                            <i class="fa fa-envelope"></i>
                        </label>
                    </div>
                    <div class="error-show" v-if="inputEmpty.account">{{ inputCheck.account }}</div>

                    <div v-bind:class="inputCss.password">
                        <label>
                            <input
                                    v-model="resetForm.password"
                                    v-on:keyup="checkInput(inputName[1])"
                                    type="password" placeholder="设置新密码(8-16位)">
                        </label>
                        <i class="fa fa-lock"></i>
                    </div>
                    <div class="error-show" v-if="inputEmpty.password">{{ inputCheck.password }}</div>

                    <div v-bind:class="inputCss.confirm">
                        <label>
                            <input
                                    v-model="resetForm.confirm"
                                    v-on:keyup="checkInput(inputName[2])"
                                    type="password" placeholder="再输一遍新密码">
                        </label>
                        <i class="fa fa-lock"></i>
                    </div>
                    <div class="error-show" v-if="inputEmpty.confirm">{{ inputCheck.confirm }}</div>

                    <div v-bind:class="inputCss.verify">
                        <label>
                            <input v-model="resetForm.verify"
                                   v-on:keyup="checkInput(inputName[3])"
                                   v-on:keyup.exact.enter="resetButtonClick"
                                   type="text" placeholder="验证码">
                        </label>
                        <i class="fa fa-shield-alt"></i>
                        <a v-bind:class="sendCodeCss" v-on:click="sendVerifyCode">{{ verifyCodeText }}</a>
                    </div>

                    <div class="error-show" v-if="inputEmpty.verify">{{ inputCheck.verify }}</div>
                    <button class="login-button" type="button" v-on:click="resetButtonClick">
                        重置密码
                    </button>
                </form>
            </div>
            <router-link class="return" to="/passport/login"><i class="fa fa-chevron-left"></i> &nbsp;返回登录注册
            </router-link>
        </div>
    </div>
</template>

<script>
    import {Message} from 'element-ui'

    export default {
        name: "Reset",
        data() {
            return {
                //  更换手机邮箱验证方式
                accountChooseClass: {
                    phone: {active: true},
                    phoneName: 'phone',
                    email: {active: false},
                    emailName: 'email'
                },
                //  输入框名
                inputName: ["account", "password", "confirm", "verify"],
                //  输入框是否为空
                inputEmpty: {
                    account: false, password: false, confirm: false, verify: false
                },
                //  整个表单控件
                resetForm: {
                    account: "", password: "", confirm: "", verify: ""
                },
                //  输入正确时显示的CSS
                prepend: {
                    account: {'input-prepend': true, restyle: true, 'no-radius': false},
                    password: {'input-prepend': true, restyle: true, 'no-radius': true},
                    confirm: {'input-prepend': true, restyle: true, 'no-radius': true},
                    verify: {'input-prepend': true, restyle: false, 'no-radius': false}
                },
                //  输入错误时显示的CSS
                warn: {"input-warn": true},
                //  用户输入框CSS
                inputCss: {
                    account: "", password: "", confirm: "", verify: ""
                },
                //  用户输入检查文本
                inputCheckText: {
                    account: ["输入不能为空", "请输入正确的手机号", "请输入正确的邮箱号"],
                    password: ["请输入密码", "密码长度不能小于8位"],
                    confirm: ["请输入密码", "两次输入的密码不一致"],
                    verify: ["请输入验证码"]
                },
                inputCheck: {
                    account: '', password: '', confirm: '', verify: ''
                },
                //验证码区域显示文本
                verifyCodeText: "发送验证码",
                //发送验证码按钮CSS
                sendCodeCss: {"btn-resend": true, disable: true}
            }
        },
        methods: {
            //清空输入内容
            setInputEmpty: function () {
                for (let item in this.resetForm) {
                    if (this.resetForm.hasOwnProperty(item)) {
                        this.resetForm[item] = "";
                        this.changeInput(item, 0, null);
                        this.sendCodeCss.disable = true;
                    }
                }
            },
            //改变用户类型 邮箱 - 手机
            changeAccount: function (name) {
                if (name === 'phone') {
                    this.accountChooseClass.phone.active = true;
                    this.accountChooseClass.email.active = false;
                    this.setInputEmpty();
                } else {
                    this.accountChooseClass.email.active = true;
                    this.accountChooseClass.phone.active = false;
                    this.setInputEmpty();
                }
            },
            //改变输入框样式
            changeInput: function (value, option, text) {
                if (option === 1) {
                    this.inputCss[value] = this.warn;
                    this.inputCheck[value] = text;
                    this.inputEmpty[value] = true;
                } else {
                    this.inputEmpty[value] = false;
                    this.inputCss[value] = this.prepend[value];
                }
            },
            //检查用户手机号，密码是否输入合格
            checkInput: function (value) {
                //首先检查是否为空值
                const regAccount = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
                const regPassword = /^[\w!#$%&'*+/=?^_`{|}~,.;":]{8,16}$/;
                const regMail = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                if (this.resetForm[value] === '')  //任何输入框为空
                    this.changeInput(value, 1, this.inputCheckText[value][0]);
                else if (value === "account") {
                    /* ------------分割线：验证手机--------------- */
                    if (this.accountChooseClass.phone.active && !this.resetForm.account.match(regAccount))
                        this.changeInput(value, 1, this.inputCheckText[value][1]);
                    /* ------------分割线：验证邮箱--------------- */
                    else if (this.accountChooseClass.email.active && !this.resetForm.account.match(regMail))
                        this.changeInput(value, 1, this.inputCheckText[value][2]);
                    /* ------------分割线--------------- */
                    else {
                        this.sendCodeCss.disable = false;
                        this.changeInput(value, 0, null);
                    }
                }
                /* -------------------分割线：密码输入不合法--------------- */
                else if (value === "password" && !this.resetForm.password.match(regPassword))   //
                    this.changeInput(value, 1, this.inputCheckText[value][1]);
                /* ------------分割线：两次输入的密码不一致 --------------- */
                else if (value === "confirm" && this.resetForm.password !== this.resetForm.confirm)  //
                    this.changeInput(value, 1, this.inputCheckText[value][1]);
                /* ------------分割线--------------- */
                else
                    this.changeInput(value, 0, null);
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
                let url = (this.accountChooseClass.phone.active) ? "/api/sms" : "/api/email-send";
                this.$axios.post(url, {
                    account: this.resetForm.account,
                    option: "reset"
                }).then((response) => {
                    if (response.data.status === 1)
                        Message.success(response.data.msg);
                    else
                        Message.error(response.data.msg);
                }).catch((error) => {
                    Message.warning('发生了未知错误');
                    console.log(error);
                })
            },
            //重置密码
            resetButtonClick: function () {
                if (this.resetForm.account === '') this.checkInput('account');
                else if (this.resetForm.password === '') this.checkInput('password');
                else if (this.resetForm.confirm === '') this.checkInput('confirm');
                else if (this.resetForm.verify === '') this.checkInput('verify');
                else {
                    this.$axios.post('/api/passport/reset', {
                        data: this.resetForm,
                        type: (this.accountChooseClass.phone.active) ? "phone" : "email"
                    }).then((response) => {
                        if (response.data.status === 1) {
                            Message.success(response.data.msg);
                            setTimeout(() => {
                                this.$router.push('/passport/login');
                            }, 1000);
                        } else Message.error(response.data.msg);
                    }).catch((error) => {
                        Message.warning('发生了未知错误');
                        console.log(error);
                    })
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

