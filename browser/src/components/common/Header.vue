<template>
    <div id="header">
        <!--第一排布局 S-->
        <div class="header-wrap">
            <div class="header">
                <!--Logo S-->
                <div class="logo">
                    <router-link class="active" to="/">
                        <img src="../../assets/image/logo-text.png" alt="">
                    </router-link>
                </div>
                <!--Logo E-->
                <!--搜索框 S-->
                <div class="search clearfix" v-if="page === 'course' || page === 'project'">
                    <i class="fa fa-search"></i>
                    <label>
                        <input type="text" :placeholder="`搜索${page==='course'?'课程':'项目'}`"
                               v-model="searchContent" @keydown.enter="search">
                    </label>
                    <div class="btn-search" @click="search">搜索</div>
                </div>
                <!--搜索框 E-->
                <!--登录注册模块 S-->
                <div v-if="!loginState" class="un-login clearfix">
                    <router-link class="login" :to="{name:'Login'}">登录</router-link>
                    <router-link class="register" :to="{name:'Register'}">注册</router-link>
                </div>
                <div v-else class="login">
                    <div class="user">
                        <div class="info">
                            <a>
                                <img alt="头像" :src="avatarUrl">
                                <span>{{nickname}}</span>
                            </a>
                            <ul class="dropdown-list">
                                <li>
                                    <a><i class="fa fa-wallet"></i> 我的钱包</a>
                                </li>
                                <li>
                                    <router-link :to="{name:'personal'}">
                                        <i class="fa fa-cog"></i> 设置
                                    </router-link>
                                </li>
                                <li>
                                    <a @click="exit"><i class="fa fa-sign-out-alt"></i> 退出</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!--登录注册模块 E-->
            </div>
        </div>
        <!--第一排布局 E-->
        <!--第二排布局 S-->
        <div class="nav-wrap">
            <div class="nav">
                <ul class="left">
                    <li :class="navActive.home">
                        <div class="first">
                            <router-link to="/">首页</router-link>
                        </div>
                    </li>
                    <li :class="navActive.course">
                        <div class="first">
                            <router-link to="/course/list">在线学习</router-link>
                        </div>
                        <div class="second">
                            <ul>
                                <li v-for="system in courseSystem" :key="system.id">
                                    <router-link :to="`/course/list?system=${system.id}`">
                                        {{system.name}}
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li :class="navActive.exam">
                        <div class="first">考试平台</div>
                        <div class="second">
                            <ul>
                                <li>
                                    <a>考试列表</a>
                                </li>
                                <li>
                                    <a>成绩查询</a>
                                </li>
                                <li>
                                    <a>课后习题</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li :class="navActive.project">
                        <div class="first">项目列表</div>
                    </li>
                    <li :class="navActive.profile">
                        <router-link tag="div" class="first" :to="{name:'personal'}">个人中心</router-link>
                        <div class="second">
                            <ul>
                                <li>
                                    <a>我的课程</a>
                                </li>
                                <li>
                                    <a>我的项目</a>
                                </li>
                                <li>
                                    <a>
                                        我的证书
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!--第二排布局 E-->
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        name: "Header",
        props: {
            page: {
                type: String
            }
        },
        data() {
            return {
                avatarUrl: 'http://localhost:3000/images/avatar/default-avatar.jpg',
                nickname: '',
                navActive: {
                    home: {active: false},
                    course: {active: false},
                    exam: {active: false},
                    project: {active: false},
                    profile: {active: false}
                },
                loginState: false,
                courseSystem: null,
                searchContent: '',
            }
        },
        methods: {
            exit() {
                this.$axios.get('/api/passport/exit').then(() => {
                    this.$store.commit('exit');
                    window.location.reload();
                }).catch((error) => {
                    console.log(error);
                    window.location.reload();
                })
            },
            search() {
                let url = this.page === 'course' ? `/course/list/${this.searchContent}` : '';
                this.$router.push(url);
            }
        },
        computed: {
            newAvatarUrl() {
                return this.$store.state.avatarUrl;
            },
            newNickname() {
                return this.$store.state.nickname;
            }
        },
        watch: {
            newAvatarUrl(val) {
                this.avatarUrl = val;
            },
            newNickname(val) {
                this.nickname = val;
            }
        },
        mounted() {
            this.navActive[this.page].active = true;
        },
        created() {
            if (this.$store.state.loginState) {
                let effectiveTime = this.$store.state.effectiveTime;
                if (moment().isAfter(effectiveTime)) {
                    this.loginState = false;
                } else {
                    this.loginState = true;
                    this.avatarUrl = this.$store.state.avatarUrl;
                    this.nickname = this.$store.state.nickname;
                }
            } else {
                this.$axios.get('/api/passport/check-login').then((response) => {
                    this.loginState = response.data.status === 1;
                    if (this.loginState) {
                        this.$store.commit('login', response.data.effectiveTime);
                        if (response.data.data.avatarUrl !== null) {
                            this.avatarUrl = `http://localhost:3000${response.data.data.avatarUrl}`;
                            this.$store.commit('changeAvatarUrl', this.avatarUrl);
                        }
                        this.nickname = response.data.data.nickname;
                        this.$store.commit('changeNickname', this.nickname);
                    }
                }).catch((error) => {
                    console.log(error);
                    this.loginState = false;
                })
            }
            this.$axios.get('/api/course/list/system').then((response) => {
                if (response.data.status === 1) this.courseSystem = response.data.data;
                else console.log(response.data.message)
            }).catch((err) => {
                console.log(err);
            })
        }
    }
</script>

<style scoped>
    @import "../../assets/css/fontawasome/css/all.min.css";

    * {
        margin: 0;
    }

    *, img {
        border: 0
    }

    *, td, th {
        padding: 0
    }

    li, ol, ul {
        list-style: none
    }

    a {
        text-decoration: none;
    }

    .header-wrap {
        height: 80px;
        width: 100%;
        background-color: #409EFF;
        min-width: 1280px;
    }

    .header-wrap .header {
        width: 1200px;
        margin: 0 auto;
    }

    .header-wrap .header .logo {
        float: left;
        height: 55px;
        width: 150px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .header-wrap .header .logo img {
        margin-top: 10px;
        margin-bottom: 10px;
        height: auto;
        width: 150px;
    }

    .header-wrap .header .search {
        float: left;
        position: relative;
        height: 30px;
        width: 350px;
        margin-top: 24px;
        margin-left: 160px;
        border: 1px solid #fff;
        -webkit-border-radius: 16px;
        -moz-border-radius: 16px;
        border-radius: 16px;
        padding-left: 8px;
    }

    .header-wrap .header .search i {
        float: left;
        height: 17px;
        width: 17px;
        margin-top: 7px;
        margin-right: 10px;
        color: #fff;
    }

    .header-wrap .header .search input {
        position: absolute;
        z-index: 1;
        left: 35px;
        width: 267px;
        height: 95%;
        border: 0;
        outline: none;
        background: #409eff;
        color: #fff;
        font: inherit;
        font-size: 12px;
    }

    .header-wrap .header .search input::-webkit-input-placeholder {
        font-size: 12px;
        color: #fff;
    }

    .header-wrap .header .search .btn-search {
        float: right;
        width: 46px;
        line-height: 30px;
        color: #fff;
        font-size: 12px;
        cursor: pointer;
        padding-left: 10px;
        border-radius: 16px;
        border: 0;
    }

    .header-wrap .header .un-login {
        float: right;
    }

    .header-wrap .header .un-login a {
        display: block;
        float: left;
        width: 88px;
        height: 30px;
        line-height: 29px;
        text-align: center;
        border: 1px solid #fff;
        -webkit-border-radius: 16px;
        -moz-border-radius: 16px;
        border-radius: 16px;
        color: #fff;
        text-decoration: none;
        margin-top: 24px
    }

    .header-wrap .header .un-login a:hover {
        border: 1px solid #67c23a;
        backgroud: #67c23a;
        text-decoration: none;
    }

    .header-wrap .header .un-login a:first-child {
        margin-right: 30px;
    }

    .header-wrap .header .login, .header-wrap .header .register {
        position: relative;
        float: right;
    }

    .header-wrap .header .login .user {
        line-height: 80px;
        padding-right: 12px;
    }

    .header-wrap .header .login .user .info {
        display: block;
        position: relative;
        font-size: 0;
    }

    .header-wrap .header .login .user .info a {
        display: block;
        color: #fff;
    }

    .header-wrap .header .login .user .info img {
        display: inline-block;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        margin-right: 8px;
        vertical-align: middle;
    }

    .header-wrap .header .login .user .info span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-wrap: normal;
        display: inline-block;
        vertical-align: middle;
        max-width: 82px;
        text-align: left;
        font-size: 14px;
    }

    .header-wrap .header .login .user .dropdown-list {
        display: none;
        position: absolute;
        box-sizing: border-box;
        width: 112px;
        left: 50%;
        margin-left: -56px;
        border: 1px solid #e5e5e5;
        background: #fff;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .12);
        z-index: 15;
    }

    .header-wrap .header .login .user .dropdown-list:before {
        content: '';
        width: 0;
        height: 0;
        border-width: 0 8px 8px;
        border-style: solid;
        border-color: transparent transparent #e5e5e5;
        position: absolute;
        left: 47px;
        top: -9px;
    }

    .header-wrap .header .login .user .dropdown-list:after {
        content: '';
        width: 0;
        height: 0;
        border-width: 0 8px 8px;
        border-style: solid;
        border-color: transparent transparent #fff;
        position: absolute;
        left: 47px;
        top: -8px;
    }

    .header-wrap .header .login .user .dropdown-list a {
        display: block;
        text-align: left;
        margin: 20px 15px;
        line-height: 20px;
        height: 20px;
        background: #fff;
        color: #333;
        font-size: 14px;
    }

    .header-wrap .header .login .user .dropdown-list a:hover {
        color: #409eff;
        cursor: pointer;
    }

    .header-wrap .header .login .user .info:hover .dropdown-list {
        display: block;
    }


    .nav-wrap {
        width: 100%;
        background: #fafafa;
    }

    .nav {
        width: 1200px;
        height: 50px;
        color: #202020;
        font-size: 14px;
        margin: 0 auto;
    }

    .nav .left {
        float: left;
        line-height: 50px;
        color: #202020;
    }

    .nav .left > li {
        position: relative;
        float: left;
        margin-right: 64px;
    }

    .nav .left > li a {
        color: #202020;
        text-decoration: none
    }

    .nav .left > li:last-child {
        margin-right: 0
    }

    .nav .left > li.active, .nav .left > li.active > div > a, .nav .left > li:hover, .nav .left > li:hover > div > a {
        color: #409eff;
    }

    .nav .left > li.active .first:after {
        content: "";
        display: inline-block;
        position: absolute;
        bottom: 0;
        left: calc(50% - 30px);
        width: 60px;
        height: 2px;
        background: #409eff
    }

    .nav .left .first {
        line-height: 50px;
        height: 50px;
        cursor: pointer;
        font-size: 16px;
    }

    .nav .left .first a {
        display: inline-block;
        height: 50px;
        font-size: 16px;
    }

    .nav .left .second {
        display: none;
        position: absolute;
        left: -36px;
        top: 50px;
        z-index: 300;
        width: 132px;
        background: #fff;
        -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, .15);
        -moz-box-shadow: 0 0 20px rgba(0, 0, 0, .15);
        box-shadow: 0 0 20px rgba(0, 0, 0, .15);
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;
    }

    .nav .left .second li {
        line-height: 40px;
        width: 100%;
        text-align: center;
    }

    .nav .left .second li a {
        color: #202020;
        text-decoration: none;
    }

    .nav .left .second li.active a, .nav .left .second li:hover a {
        color: #409eff;
        cursor: pointer;
    }

    .nav .left > li:hover .second {
        display: block;
    }

    .clearfix:after {
        clear: both;
        content: " ";
        display: block;
        height: 0;
        overflow: hidden;
        visibility: hidden;
    }

</style>
