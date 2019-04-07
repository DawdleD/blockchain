<template>
    <div id="container">
        <app-header :page="page"></app-header>
        <div class="banner-slide">
            <el-carousel trigger="click" height="400px">
                <el-carousel-item>
                    <a style="background-color: #010004" class="banner-slide-a" href="https://www.blockchain.com/zh"
                       target="_blank">
                        <img alt="" src="../assets/image/block-chain.jpg" class="banner-slide-img">
                    </a>
                </el-carousel-item>
                <el-carousel-item>
                    <a style="background-color:#000000" class="banner-slide-a" href="https://bitcoin.org/zh_CN/"
                       target="_blank">
                        <img alt="" src="../assets/image/bitcoin.jpg" class="banner-slide-img">
                    </a>
                </el-carousel-item>
                <el-carousel-item>
                    <a style="background-color: #131313" class="banner-slide-a" href="https://www.ethereum.org/"
                       target="_blank">
                        <img alt="" src="../assets/image/ethereum.png" class="banner-slide-img">
                    </a>
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="content">
            <div class="course">
                <div class="header clear">
                    <ul class="clear">
                        <li v-bind:class="chargeActive" @click="changeCourseFee">付费课程</li>
                        <li v-bind:class="freeActive" @click="changeCourseFee">免费课程</li>
                    </ul>
                    <div class="more">
                        <a href="#">更多课程 >></a>
                    </div>
                </div>
                <div class="course-fee" v-if="courseFee">
                    <ul class="clear">
                        <li>
                            <a href="#">
                                <img src="../assets/image/course.png" alt="course" title="付费课程名称">
                                <div class="course-title">付费课程名称</div>
                                <div class="course-info clear">
                                    <div class="course-price">￥999</div>
                                    <div class="apply-num">726人已报名</div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src="../assets/image/course.png" alt="course" title="付费课程名称">
                                <div class="course-title">付费课程名称</div>
                                <div class="course-info clear">
                                    <div class="course-price">￥129</div>
                                    <div class="apply-num">666人已报名</div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src="../assets/image/course.png" alt="course" title="付费课程名称">
                                <div class="course-title">付费课程名称</div>
                                <div class="course-info clear">
                                    <div class="course-price">￥419</div>
                                    <div class="apply-num">123人已报名</div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src="../assets/image/course.png" alt="course" title="付费课程名称">
                                <div class="course-title">付费课程名称</div>
                                <div class="course-info clear">
                                    <div class="course-price">￥678</div>
                                    <div class="apply-num">1200人已报名</div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="course-fee" v-if="!courseFee">
                    <ul class="clear">
                        <li>
                            <a href="#">
                                <img src="../assets/image/course-free.jpg" alt="course" title="免费课程名称">
                                <div class="course-title">免费课程名称</div>
                                <div class="course-info clear">
                                    <div class="course-free">免费</div>
                                    <div class="apply-num">726人已报名</div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src="../assets/image/course-free.jpg" alt="course" title="免费课程名称">
                                <div class="course-title">免费课程名称</div>
                                <div class="course-info clear">
                                    <div class="course-free">免费</div>
                                    <div class="apply-num">604人已报名</div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src="../assets/image/course-free.jpg" alt="course" title="免费课程名称">
                                <div class="course-title">免费课程名称</div>
                                <div class="course-info clear">
                                    <div class="course-free">免费</div>
                                    <div class="apply-num">411人已报名</div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src="../assets/image/course-free.jpg" alt="course" title="免费课程名称">
                                <div class="course-title">免费课程名称</div>
                                <div class="course-info clear">
                                    <div class="course-free">免费</div>
                                    <div class="apply-num">1314人已报名</div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="project">
                <div class="header clear">
                    <ul class="clear">
                        <li v-bind:class="newActive" @click="changeProjectType">最新项目</li>
                        <li v-bind:class="hotActive" @click="changeProjectType">热门项目</li>
                    </ul>
                    <div class="more">
                        <a @click="canDown = !canDown" v-if="canDown">展开 <i class="fa fa-angle-double-down"></i></a>
                        <a @click="canDown = !canDown" v-if="!canDown">收起 <i class="fa fa-angle-double-up"></i></a>
                    </div>
                </div>
                <div v-if="projectNew" v-bind:class="{'project-container':true,down: !canDown}">
                    <ul class="clear">
                        <li>
                            <a>
                                <img alt="" src="../assets/image/project.jpg" title="最新项目标题">
                                <div class="project-title">最新项目标题</div>
                                <div class="duration">
                                    <i class="fa fa-calendar-alt"></i>
                                    2019.04.01 - 2019.07.26
                                </div>
                                <div class="project-info">
                                    <div class="apply-num">1人已申请</div>
                                    <div class="reward" title="1 ETH(以太币) = 1000 Finney">
                                        <i class="fab fa-ethereum"></i>
                                        可获得 10 Finney
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img alt="" src="../assets/image/project.jpg" title="最新项目标题">
                                <div class="project-title">最新项目标题</div>
                                <div class="duration">
                                    <i class="fa fa-calendar-alt"></i>
                                    2019.04.01 - 2019.07.26
                                </div>
                                <div class="project-info">
                                    <div class="apply-num">1人已申请</div>
                                    <div class="reward" title="1 ETH(以太币) = 1000 Finney">
                                        <i class="fab fa-ethereum"></i>
                                        可获得 9 Finney
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img alt="" src="../assets/image/project.jpg" title="最新项目标题">
                                <div class="project-title">最新项目标题</div>
                                <div class="duration">
                                    <i class="fa fa-calendar-alt"></i>
                                    2019.04.01 - 2019.07.26
                                </div>
                                <div class="project-info">
                                    <div class="apply-num">1人已申请</div>
                                    <div class="reward" title="1 ETH(以太币) = 1000 Finney">
                                        <i class="fab fa-ethereum"></i>
                                        可获得 7 Finney
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img alt="" src="../assets/image/project.jpg" title="最新项目标题">
                                <div class="project-title">最新项目标题</div>
                                <div class="duration">
                                    <i class="fa fa-calendar-alt"></i>
                                    2019.04.01 - 2019.07.26
                                </div>
                                <div class="project-info">
                                    <div class="apply-num">1人已申请</div>
                                    <div class="reward" title="1 ETH(以太币) = 1000 Finney">
                                        <i class="fab fa-ethereum"></i>
                                        可获得 6 Finney
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img alt="" src="../assets/image/project.jpg" title="最新项目标题">
                                <div class="project-title">最新项目标题</div>
                                <div class="duration">
                                    <i class="fa fa-calendar-alt"></i>
                                    2019.04.01 - 2019.07.26
                                </div>
                                <div class="project-info">
                                    <div class="apply-num">1人已申请</div>
                                    <div class="reward" title="1 ETH(以太币) = 1000 Finney">
                                        <i class="fab fa-ethereum"></i>
                                        可获得 12 Finney
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
                <div v-if="!projectNew" v-bind:class="{'project-container':true,down: !canDown}">
                    <ul class="clear">
                        <li>
                            <a>
                                <img alt="" src="../assets/image/project-hot.png" title="热门项目标题">
                                <div class="project-title">热门项目标题</div>
                                <div class="duration">
                                    <i class="fa fa-calendar-alt"></i>
                                    2019.04.01 - 2019.07.26
                                </div>
                                <div class="project-info">
                                    <div class="apply-num hot">
                                        <i class="fab fa-hotjar"></i>
                                        10人已申请
                                    </div>
                                    <div class="reward" title="1 ETH(以太币) = 1000 Finney">
                                        <i class="fab fa-ethereum"></i>
                                        可获得 400 Finney
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img alt="" src="../assets/image/project-hot.png" title="热门项目标题">
                                <div class="project-title">热门项目标题</div>
                                <div class="duration">
                                    <i class="fa fa-calendar-alt"></i>
                                    2019.04.01 - 2019.07.26
                                </div>
                                <div class="project-info">
                                    <div class="apply-num hot">
                                        <i class="fab fa-hotjar"></i>
                                        12人已申请
                                    </div>
                                    <div class="reward" title="1 ETH(以太币) = 1000 Finney">
                                        <i class="fab fa-ethereum"></i>
                                        可获得 411 Finney
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img alt="" src="../assets/image/project-hot.png" title="热门项目标题">
                                <div class="project-title">热门项目标题</div>
                                <div class="duration">
                                    <i class="fa fa-calendar-alt"></i>
                                    2019.04.01 - 2019.07.26
                                </div>
                                <div class="project-info">
                                    <div class="apply-num hot">
                                        <i class="fab fa-hotjar"></i>
                                        18人已申请
                                    </div>
                                    <div class="reward" title="1 ETH(以太币) = 1000 Finney">
                                        <i class="fab fa-ethereum"></i>
                                        可获得 726 Finney
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img alt="" src="../assets/image/project-hot.png" title="热门项目标题">
                                <div class="project-title">热门项目标题</div>
                                <div class="duration">
                                    <i class="fa fa-calendar-alt"></i>
                                    2019.04.01 - 2019.07.26
                                </div>
                                <div class="project-info">
                                    <div class="apply-num hot">
                                        <i class="fab fa-hotjar"></i>
                                        10人已申请
                                    </div>
                                    <div class="reward" title="1 ETH(以太币) = 1000 Finney">
                                        <i class="fab fa-ethereum"></i>
                                        可获得 200 Finney
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img alt="" src="../assets/image/project-hot.png" title="热门项目标题">
                                <div class="project-title">热门项目标题</div>
                                <div class="duration">
                                    <i class="fa fa-calendar-alt"></i>
                                    2019.04.01 - 2019.07.26
                                </div>
                                <div class="project-info">
                                    <div class="apply-num hot">
                                        <i class="fab fa-hotjar"></i>
                                        10人已申请
                                    </div>
                                    <div class="reward" title="1 ETH(以太币) = 1000 Finney">
                                        <i class="fab fa-ethereum"></i>
                                        可获得 400 Finney
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img alt="" src="../assets/image/project-hot.png" title="热门项目标题">
                                <div class="project-title">热门项目标题</div>
                                <div class="duration">
                                    <i class="fa fa-calendar-alt"></i>
                                    2019.04.01 - 2019.07.26
                                </div>
                                <div class="project-info">
                                    <div class="apply-num hot">
                                        <i class="fab fa-hotjar"></i>
                                        10人已申请
                                    </div>
                                    <div class="reward" title="1 ETH(以太币) = 1000 Finney">
                                        <i class="fab fa-ethereum"></i>
                                        可获得 400 Finney
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <app-footer></app-footer>
    </div>
</template>

<script>
    import Header from '../components/common/Header'
    import Footer from '../components/common/Footer'

    export default {
        name: "index",
        data() {
            return {
                page: "home",
                chargeActive: {active: true},
                freeActive: {active: false},
                courseFee: true,
                newActive: {active: true},
                hotActive: {active: false},
                projectNew: true,
                canDown: true
            }
        },
        methods: {
            changeCourseFee() {
                this.courseFee = !this.courseFee;
                let temp = this.chargeActive.active;
                this.chargeActive.active = this.freeActive.active;
                this.freeActive.active = temp;
            },
            changeProjectType() {
                this.canDown = true;
                this.projectNew = !this.projectNew;
                let temp = this.newActive.active;
                this.newActive.active = this.hotActive.active;
                this.hotActive.active = temp;
            },
        },
        components: {
            "app-header": Header,
            "app-footer": Footer
        }
    }
</script>

<style scoped>
    @import "../assets/css/fontawasome/css/all.min.css";

    * {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 14px;
    }

    *, :after, :before {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box
    }

    ul, li {
        list-style: none;
    }

    img {
        vertical-align: middle;
    }

    #container{
        position:relative;
        width:100%;
        min-height:100%;
        padding-bottom: 245px;
        box-sizing: border-box;
    }

    .clear:after {
        display: block;
        content: "";
        clear: both;
    }

    .banner-slide {
        position: relative;
        height: 400px;
        min-width: 1240px;
        z-index: 10;
        display: block;
    }

    .banner-slide-a {
        display: block;
        width: 100%;
        height: 400px;
    }

    .banner-slide-img {
        display: block;
        height: 400px;
        width: 710px;
        margin: 0 auto;
        position: relative;
    }

    .content .course, .content .project {
        width: 1200px;
        margin: 0 auto;
        min-height: 303px;
        padding-top: 40px;
    }

    .content .course a, .content .project a {
        text-decoration: none;
        background-color: transparent;
    }

    .content .header {
        margin-bottom: 20px;
    }

    .content .header ul {
        float: left;
        height: 22px;
    }

    .content .header ul .active {
        color: #202020;
    }

    .content .header ul li {
        display: inline-block;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        font-size: 22px;
        color: #888;
        line-height: 22px;
        cursor: pointer;
    }

    .content .header ul li:first-child {
        border-right: 1px solid #888;
        padding-right: 16px;
        padding-left: 0;
    }

    .content .header ul li:last-child {
        padding-left: 16px;
    }

    .content .header .more {
        float: right;
        display: block;
        line-height: 22px;
    }

    .content .header .more:hover a {
        color: #409eff;
    }

    .content .header .more a {
        text-decoration: none;
        color: #888;
    }

    .content .course .course-fee {
        display: block;
    }

    .content .course .course-fee li {
        float: left;
        width: 270px;
        margin-right: 40px;
    }

    .content .course .course-fee li img {
        display: inline-block;
        width: 100%;
        height: 170px;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;
    }

    .content .course .course-fee li .course-title {
        color: #202020;
        margin-top: 8px;
        width: 100%;
        overflow: hidden;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
    }

    .content .course .course-fee li:last-child {
        margin-right: 0;
    }

    .content .course .course-fee .course-info {
        margin-top: 2px;
        text-align: left;
    }

    .content .course .course-fee .course-info .course-price {
        float: left;
        color: #e85308;
    }

    .content .course .course-fee .course-info .course-free {
        float: left;
        color: #42c02e;
    }

    .content .course .course-fee .course-info .apply-num {
        float: right;
        color: #888;
        font-size: 12px;
    }

    .content .project .project-container {
        display: block;
        width: 100%;
        height: 280px;
        overflow: hidden;
    }

    .content .project .down {
        height: 560px;
    }

    .content .project .project-container ul {
        width: 100%;
    }

    .content .project .project-container ul li {
        float: left;
        width: 270px;
        border-radius: 6px;
        border: 1px solid #eee;
        margin-right: 40px;
        margin-bottom: 20px;
        box-sizing: border-box;
        text-align: center;
    }

    .content .project .project-container ul li a {
        text-decoration: none;
        cursor: pointer;
    }

    .content .project .project-container ul li img {
        display: inline-block;
        width: 100%;
        height: 170px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    .content .project .project-container ul li:nth-child(4n) {
        margin-right: 0;
    }

    .content .project .project-container ul li .project-title {
        width: 100%;
        text-align: center;
        margin-top: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .content .project .project-container .duration {
        color: #42c02e;
        margin-top: 8px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .content .project .project-container .project-info {
        margin-top: 2px;
        text-align: left;
    }

    .content .project .project-container .project-info .reward {
        margin-right: 10px;
        margin-bottom: 5px;
        float: right;
        color: #e85308;
    }

    .content .project .project-container .project-info .apply-num {
        float: left;
        color: #888;
        margin-left: 10px;
        margin-bottom: 5px;
    }

    .content .project .project-container .project-info .hot {
        color: red;
    }

</style>
