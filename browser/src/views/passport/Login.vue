<template>
    <div class="passport">
        <div class="logo">
            <a href="/">
                <img alt="Logo" src="../../assets/image/logo-bcs.png">
            </a>
        </div>
        <div class="main">
            <h4 class="title">
                <div class="">
                    <router-link class="active" to="/passport/login">登录</router-link>
                    <b>·</b>
                    <router-link to="/passport/register">注册</router-link>
                </div>
            </h4>
            <div class="">
                <form>
                    <div v-bind:class="inputCss.account">
                        <label>
                            <input v-model="loginForm.account"
                                   v-on:keyup="checkInputNull(inputName[0])"
                                   type="text" placeholder="手机号或邮箱">
                        </label>
                        <i class="fa fa-user"></i>
                    </div>
                    <div class="error-show" v-if="inputEmpty.account">请输入账号</div>
                    <div v-bind:class="inputCss.password">
                        <label>
                            <input
                                    v-model="loginForm.password"
                                    v-on:keyup="checkInputNull(inputName[1])"
                                    type="password" placeholder="密码">
                        </label>
                        <i class="fa fa-lock"></i>
                    </div>

                    <div class="error-show" v-if="inputEmpty.password">请输入密码</div>
                    <div v-bind:class="inputCss.verify">
                        <label>
                            <input v-model="loginForm.verify"
                                   v-on:blur="checkInputNull(inputName[2])"
                                   v-on:keyup.exact.enter="loginButtonClick"
                                   type="text" placeholder="验证码">
                        </label>
                        <i class="fa fa-shield-alt"></i>
                        <a class="btn-image">
                            <img v-bind:src="imageVerifyUrl" alt="验证码"
                                 v-on:click="changeImage">
                        </a>
                    </div>
                    <div class="error-show" v-if="inputEmpty.verify">请输入验证码</div>

                    <div class="remember-btn">
                        <label>
                            <input type="checkbox" v-model="loginForm.checked">
                            <span>记住我</span>
                        </label>

                    </div>
                    <div class="forget-btn">
                        <router-link to="/passport/reset">忘记密码?</router-link>
                    </div>
                    <button class="login-button" type="button" v-on:click="loginButtonClick">
                        登录
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import {Notification} from 'element-ui'

    export default {
        name: "Login",
        data() {
            return {
                //输入框名
                inputName: ["account", "password", "verify"],
                //输入框是否为空
                inputEmpty: {
                    account: false, password: false, verify: false
                },
                //整个表单控件
                loginForm: {
                    account: "", password: "", verify: "", checked: true
                },
                //用户输入框CSS
                inputCss: {
                    account: "", password: "", verify: ""
                },
                //输入正确时显示的CSS
                prepend: {
                    account: {'input-prepend': true, restyle: true, 'no-radius': false},
                    password: {'input-prepend': true, restyle: true, 'no-radius': true},
                    verify: {'input-prepend': true, restyle: false, 'no-radius': false}
                },
                //输入错误时显示的CSS
                warn: {"input-warn": true},
                //图片验证码url
                imageVerifyUrl: "http://localhost:3000/image-captcha"
            }
        },
        methods: {
            //检查输入是否为空值
            checkInputNull: function (value) {
                if (this.loginForm[value] === '') {
                    this.inputCss[value] = this.warn;
                    this.inputEmpty[value] = true;
                } else {
                    this.inputCss[value] = this.prepend[value];
                    this.inputEmpty[value] = false;
                }
            },
            //登录按钮点击事件
            loginButtonClick: function () {
                if (this.loginForm.account === '') this.checkInputNull('account');
                else if (this.loginForm.password === '') this.checkInputNull('password');
                else if (this.loginForm.verify === '') this.checkInputNull('verify');
                else {
                    this.rememberMe();
                    this.$axios.post('/api/passport/login', {
                        data: this.loginForm
                    }).then((response) => {
                        if (response.data.status === 1) {
                            Notification.success({
                                title: '登录成功',
                                message: '登录成功！即将跳转到主页',
                                duration: 1500
                            });
                            // this.Notification.success({
                            //     title: '登录成功',
                            //     message: '登录成功！即将跳转到主页',
                            // });
                            setTimeout(() => {
                                this.$router.push('/');
                            }, 1000);
                        } else {
                            this.changeImage();
                            Notification.error({
                                title: '登录失败',
                                message: response.data.message,
                                duration: 2500
                            });
                        }
                    }).catch((error) => {
                        console.log(error);
                        Notification.warning({
                            title: '警告',
                            message: '发生了未知错误',
                            duration: 2500
                        });
                    });
                }
            },
            //记住密码复选框
            rememberMe: function () {
                if (this.loginForm.checked) {
                    localStorage.setItem('account', this.loginForm.account);
                } else {
                    localStorage.removeItem('account');
                }
            },
            //更换验证码图片
            changeImage: function () {
                this.imageVerifyUrl = `http://localhost:3000/image-captcha?${Math.random()}`;
            }
        },
        mounted() {
            if (this.loginForm.checked) {
                this.loginForm.account = localStorage.getItem('account');
            }
            for (let item in this.inputCss) {
                this.inputCss[item] = this.prepend[item];
            }
        },
    }
</script>

<style scoped>
    @import "../../assets/css/passport.css";
    @import "../../assets/css/fontawasome/css/all.min.css";
</style>
