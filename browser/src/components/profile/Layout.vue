<template>
    <div id="container">
        <app-header :page="page"></app-header>
        <div class="container-setting">

                <div class="row">
                    <el-container>
                    <!-- 导航栏 -->
                    <el-aside>
                        <div class="aside">
                            <ul>
                                <li :class="{'active':active.personal}">
                                    <router-link :to="{name:'personal'}">
                                        <div class="setting-icon"><i class="fas fa-address-card"></i></div>
                                        <span>个人资料</span>
                                    </router-link>
                                </li>
                                <li :class="{'active':active.wallet}">
                                    <router-link :to="{name:'wallet'}">
                                        <div class="setting-icon"><i class="fas fa-wallet"></i></div>
                                        <span>我的钱包</span>
                                    </router-link>
                                </li>
                                <li :class="{'active':active.course}">
                                    <router-link :to="{name:'course'}">
                                        <div class="setting-icon"><i class="fas fa-book-open"></i></div>
                                        <span>我的课程</span>
                                    </router-link>
                                </li>
                                <li :class="{'active':active.exam}">
                                    <router-link :to="{name:'exam'}">
                                        <div class="setting-icon"><i class="fas fa-file-alt"></i></div>
                                        <span>我的考试</span>
                                    </router-link>
                                </li>
                                <li :class="{'active':active.project}">
                                    <router-link :to="{name:'project'}">
                                        <div class="setting-icon"><i class="fas fa-tasks"></i></div>
                                        <span>我的项目</span>
                                    </router-link>
                                </li>
                                <li :class="{'active':active.certificate}">
                                    <router-link :to="{name:'certificate'}">
                                        <div class="setting-icon"><i class="fas fa-award"></i></div>
                                        <span>我的证书</span>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </el-aside>
                    <el-main>
                        <!-- 导航栏所对应的内容 -->
                        <div class="view">
                            <router-view></router-view>
                        </div>
                    </el-main>
                    </el-container>
                </div>

        </div>
        <app-footer></app-footer>
    </div>
</template>

<script>
    import Header from '../common/Header'
    import Footer from '../common/Footer'

    export default {
        name: "Layout",
        data() {
            return {
                page: "profile",
                active: {
                    personal: false, wallet: false, course: false,
                    exam: false, project: false, certificate: false
                }
            }
        },
        components: {
            "app-header": Header,
            "app-footer": Footer
        },
        beforeRouteEnter(to, from, next) {
            let type = to.name;
            next((vm => {
                vm.active[type] = true;
            }));
        },
        beforeRouteUpdate(to, from, next) {
            let type = from.name;
            this.active[type] = false;
            type = to.name;
            this.active[type] = true;
            next();
        },
    }
</script>

<style scoped>

    *, :after, :before {
        box-sizing: border-box
    }

    ul {
        margin-top: 0;
        margin-bottom: 10px
    }

    a {
        cursor: pointer;
        color: #333;
        text-decoration: none;
    }

    a:focus, a:hover {
        color: #2f2f2f;
        text-decoration: none
    }

    #container {
        position: relative;
        width: 100%;
        min-height: 100%;
        padding-bottom: 245px;
        box-sizing: border-box;
    }

    .container-setting {
        width: 1200px;
        min-height: 700px;
        margin-right: auto;
        margin-left: auto;
        padding-left: 15px;
        padding-right: 15px;
    }

    .container-setting .row {
        padding-top: 15px;
        margin-left: -15px;
        margin-right: -15px;
    }

    .container-setting .aside {
        position: relative;
        top: 0;
        bottom: 0;
        margin: 20px 0 0;
        padding: 0 0 30px;
        width: 280px;
        overflow: auto;
    }

    .container-setting .aside ul {
        list-style: none;
        padding-left: 0;
    }

    .container-setting .aside ul li {
        line-height: 20px;
        border-bottom: 1px solid #e6e6e6;
    }

    .container-setting .aside .active a, .container-setting .aside li:hover a {
        background-color: #f0f0f0;
    }

    .container-setting .aside a {
        padding: 15px 15px;
        font-size: 15px;
        display: block;
        text-align: left;
    }

    .container-setting .aside .setting-icon {
        margin-right: 15px;
        width: 32px;
        height: 32px;
        text-align: center;
        color: #fff;
        background-color: #a0a0a0;
        border-radius: 4px;
        display: inline-block;
    }

    .container-setting .aside .setting-icon i {
        margin: 6px 0 0 1px;
        font-size: 18px;
        display: block;
    }

    .container-setting .aside span {
        vertical-align: middle;
    }

    .container-setting .view {
        margin-left: 8%;
        width: 94%;
        float: left;
        position: relative;
        min-height: 1px;
        padding-right: 15px;
    }


</style>
