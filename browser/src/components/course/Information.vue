<template>
    <div class="course-information">
        <div class="course-banner">
            <div class="inner-center clearfix">
                <course-bread :bread="bread"></course-bread>
                <div class="course-img-text">
                    <div class="course-img-left">
                        <img src="../../assets/image/project.jpg" alt="">
                    </div>
                    <div class="course-text-right">
                        <h1 class="text-title">{{bread.courseName}}</h1>
                        <div class="enroll-info">
                            <div class="enroll-course-info">
                                <div class="teacher-name">授课教师：{{course.details['teacherName']}}</div>
                                <div class="workload">课程安排：{{course.details['courseArrange']}}</div>
                                <div class="course-time clearfix">
                                    <div class="start-time"><i class="far fa-calendar-alt"></i>
                                        开课时间:{{course.details['startTime']}}
                                    </div>
                                    <div class="finish-time"><i class="far fa-calendar-alt"></i>
                                        结课时间:{{course.details['finishTime']}}
                                    </div>
                                </div>
                            </div>
                            <div class="enroll">
                                <div class="course-apply">已有{{course.info['applyCount']}}人报名</div>
                                <div class="enroll-apply-btn">
                                    <div class="enroll-button">
                                        免费报名
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="info-main">
            <div class="inner-center clearfix">
                <div class="main">
                    <div class="tabs">
                        <div class="tabs-title-bar">
                            <h2 :class="{'tabs-title':true,active:tabsTitle.courseDetail}"
                                @click="tabsChange('courseDetail')">课程详情</h2>
                            <h2 :class="{'tabs-title':true,active:tabsTitle.chapterList}"
                                @click="tabsChange('chapterList')">课程目录</h2>
                            <h2 :class="{'tabs-title':true,active:tabsTitle.fileList}"
                                @click="tabsChange('fileList')">课程资料</h2>
                            <h2 :class="{'tabs-title':true,active:tabsTitle.courseComment}"
                                @click="tabsChange('courseComment')">课程评价(13456)</h2>
                        </div>
                        <div class="tabs-content">
                            <!--课程详情 S-->
                            <div :class="{'course-details':true,hide:!tabsTitle.courseDetail}">
                                <div class="details-title">
                                    <i class="fas fa-th-large"></i>
                                    <span>课程概述</span>
                                </div>
                                <div class="details-content">
                                    <div class="details-text">
                                        <p>
                                            <span>{{course.details['courseSummary']}}</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="details-title">
                                    <i class="fas fa-book"></i>
                                    <span>课程目标</span>
                                </div>
                                <div class="details-content">
                                    <div class="details-text">
                                        <p>
                                            <span>{{course.details['courseTarget']}}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <!--课程详情 E-->
                            <!--课程目录 S-->
                            <div :class="{'chapter-list':true,hide:!tabsTitle.chapterList}">
                                <div class="chapter-item">
                                    <div class="chapter-title">
                                        <span>01</span>
                                        <h3>区块链技术入门必修课</h3>
                                    </div>
                                    <div class="chapter-course-list">
                                        <a class="chapter-course-item">
                                            <i class="fas fa-play-circle"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链起源思想</span>
                                                <span class="duration">(10分钟)</span>
                                            </p>
                                        </a>
                                        <a class="chapter-course-item">
                                            <i class="fas fa-play-circle"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链本质</span>
                                                <span class="duration">(24分钟)</span>
                                            </p>
                                        </a>
                                        <a class="chapter-course-item">
                                            <i class="fas fa-play-circle"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链与比特币的差别</span>
                                                <span class="duration">(22分钟)</span>
                                            </p>
                                        </a>
                                        <a class="chapter-course-item">
                                            <i class="fas fa-play-circle"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链产业形态和企业布局</span>
                                                <span class="duration">(46分钟)</span>
                                            </p>
                                        </a>
                                    </div>
                                </div>
                                <div class="chapter-item">
                                    <div class="chapter-title">
                                        <span>02</span>
                                        <h3>区块链技术入门必修课</h3>
                                    </div>
                                    <div class="chapter-course-list">
                                        <a class="chapter-course-item">
                                            <i class="fas fa-play-circle"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链起源思想</span>
                                                <span class="duration">(10分钟)</span>
                                            </p>
                                        </a>
                                        <a class="chapter-course-item">
                                            <i class="fas fa-play-circle"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链本质</span>
                                                <span class="duration">(24分钟)</span>
                                            </p>
                                        </a>
                                        <a class="chapter-course-item">
                                            <i class="fas fa-play-circle"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链与比特币的差别</span>
                                                <span class="duration">(22分钟)</span>
                                            </p>
                                        </a>
                                        <a class="chapter-course-item">
                                            <i class="fas fa-play-circle"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链产业形态和企业布局</span>
                                                <span class="duration">(46分钟)</span>
                                            </p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <!--课程目录 E-->
                            <!--课程资料 S-->
                            <div :class="{'file-list':true,hide:!tabsTitle.fileList}">
                                <div class="file-item">
                                    <div class="file-title">
                                        <span>01</span>
                                        <h3>区块链技术入门必修课</h3>
                                    </div>
                                    <div class="file-course-list">
                                        <a class="file-course-item">
                                            <i class="fas fa-file-alt"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链与比特币的差别</span>
                                                <span class="duration">(word, 100kb)</span>
                                            </p>
                                        </a>
                                        <a class="file-course-item">
                                            <i class="fas fa-file-alt"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链产业形态和企业布局</span>
                                                <span class="duration">(txt, 3mb)</span>
                                            </p>
                                        </a>
                                    </div>
                                </div>
                                <div class="file-item">
                                    <div class="file-title">
                                        <span>02</span>
                                        <h3>区块链技术入门必修课</h3>
                                    </div>
                                    <div class="file-course-list">
                                        <a class="file-course-item">
                                            <i class="fas fa-file-alt"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链起源思想</span>
                                                <span class="duration">(zip, 10kb)</span>
                                            </p>
                                        </a>
                                        <a class="file-course-item">
                                            <i class="fas fa-file-alt"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链本质</span>
                                                <span class="duration">(mp4, 30mb)</span>
                                            </p>
                                        </a>
                                        <a class="file-course-item">
                                            <i class="fas fa-file-alt"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链与比特币的差别</span>
                                                <span class="duration">(mp3, 8mb)</span>
                                            </p>
                                        </a>
                                        <a class="file-course-item">
                                            <i class="fas fa-file-alt"></i>
                                            <p class="course-item-title">
                                                <span title="区块链起源思想" class="text">区块链产业形态和企业布局</span>
                                                <span class="duration">(js, 46kb)</span>
                                            </p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <!--课程资料 E-->
                            <!--课程评论 S-->
                            <div :class="{'course-comment':true,hide:!tabsTitle.courseComment}">
                                <div class="comment-head">
                                    <div class="rating-scores">
                                        <span>9.8</span>
                                    </div>
                                    <div class="rating">
                                        <div class="rating-stars">
                                            <div class="stars">
                                                <div class="dislike">
                                                    <i class="star fas fa-star"></i>
                                                    <i class="star fas fa-star"></i>
                                                    <i class="star fas fa-star"></i>
                                                    <i class="star fas fa-star"></i>
                                                    <i class="star fas fa-star"></i>
                                                </div>
                                                <div class="like">
                                                    <i class="star fas fa-star"></i>
                                                    <i class="star fas fa-star"></i>
                                                    <i class="star fas fa-star"></i>
                                                    <i class="star fas fa-star"></i>
                                                    <i class="star fas fa-star" style="width: 12px"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="rating-sum">
                                            <span>共13456条评价</span>
                                        </div>
                                    </div>
                                    <div class="comment-button-area">
                                        <div class="comment-button">我要评价</div>
                                    </div>
                                </div>
                                <div class="comment-filter">
                                    <div class="filter-box">
                                        <span class="selected">全部评价(13456)</span>
                                        <span>好评(13101)</span>
                                        <span>中评(335)</span>
                                        <span>差评(20)</span>
                                    </div>
                                </div>
                                <div class="comment-list">
                                    <div class="comment-list-item clearfix">
                                        <div class="comment-list-item-avatar">
                                            <img src="../../assets/image/project-hot.png" alt="">
                                        </div>
                                        <div class="comment-list-item-body">
                                            <div class="user-info">
                                                <a>最爱虞子酱</a>
                                                <div class="user-info-rating">
                                                    <div class="stars">
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="comment-content">
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                            </div>
                                            <div class="comment-time">2019-04-12</div>
                                        </div>
                                    </div>
                                    <div class="comment-list-item clearfix">
                                        <div class="comment-list-item-avatar">
                                            <img src="../../assets/image/project-hot.png" alt="">
                                        </div>
                                        <div class="comment-list-item-body">
                                            <div class="user-info">
                                                <a>最爱虞子酱</a>
                                                <div class="user-info-rating">
                                                    <div class="stars">
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="comment-content">
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                            </div>
                                            <div class="comment-time">2019-04-12</div>
                                        </div>
                                    </div>
                                    <div class="comment-list-item clearfix">
                                        <div class="comment-list-item-avatar">
                                            <img src="../../assets/image/project-hot.png" alt="">
                                        </div>
                                        <div class="comment-list-item-body">
                                            <div class="user-info">
                                                <a>最爱虞子酱</a>
                                                <div class="user-info-rating">
                                                    <div class="stars">
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="comment-content">
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                            </div>
                                            <div class="comment-time">2019-04-12</div>
                                        </div>
                                    </div>
                                    <div class="comment-list-item clearfix">
                                        <div class="comment-list-item-avatar">
                                            <img src="../../assets/image/project-hot.png" alt="">
                                        </div>
                                        <div class="comment-list-item-body">
                                            <div class="user-info">
                                                <a>最爱虞子酱</a>
                                                <div class="user-info-rating">
                                                    <div class="stars">
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="comment-content">
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                            </div>
                                            <div class="comment-time">2019-04-12</div>
                                        </div>
                                    </div>
                                    <div class="comment-list-item clearfix">
                                        <div class="comment-list-item-avatar">
                                            <img src="../../assets/image/project-hot.png" alt="">
                                        </div>
                                        <div class="comment-list-item-body">
                                            <div class="user-info">
                                                <a>最爱虞子酱</a>
                                                <div class="user-info-rating">
                                                    <div class="stars">
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="comment-content">
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                                <span>这里是课程评论，请发表你的评论，注意：这里是课程评论。</span>
                                            </div>
                                            <div class="comment-time">2019-04-12</div>
                                        </div>
                                    </div>
                                    <div class="page-sort">
                                        <el-pagination
                                                background
                                                layout="prev, pager, next"
                                                @current-change="pageChanged"
                                                :pager-count="5"
                                                :total="120">
                                        </el-pagination>
                                    </div>
                                </div>
                            </div>
                            <!--课程评论 E-->
                        </div>
                    </div>
                </div>
                <div class="main-aside">
                    <div class="aside-blocks">
                        <div class="exam-schedule">
                            <div class="exam-title">
                                课程考试安排
                            </div>
                            <div class="exam-time">
                                <i class="fas fa-calendar-alt"></i>
                                考试时间：2019.04.03 - 2019.06.26
                            </div>
                            <div class="exam-text">
                                <span><i class="far fa-file-alt"></i> 分数安排：采取百分制，30分来自课堂测验，70分来自考试</span>
                            </div>
                            <div class="exam-text">
                                <span><i class="fas fa-award"></i> 证书要求：60分-79分可获得合格证书，80分以上可获得优秀证书</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CourseBread from './CourseBread'

    export default {
        name: "Information",
        data() {
            return {
                bread: {
                    systemName: '', systemUrl: '',
                    typeName: '', typeUrl: '',
                    courseName: '', courseUrl: ''
                },
                course: '',
                tabsTitle: {
                    courseDetail: true,
                    chapterList: false,
                    fileList: false,
                    courseComment: false
                }
            }
        },
        components: {
            'course-bread': CourseBread
        },
        methods: {
            tabsInit() {
                this.tabsTitle = {
                    courseDetail: false,
                    chapterList: false,
                    fileList: false,
                    courseComment: false
                }
            },
            pageChanged(val) {
                console.log(`${val},page`)
            },
            tabsChange(val) {
                this.tabsInit();
                this.tabsTitle[val] = true;
            }
        },
        created() {
            this.$axios.post('/api/course/information', {
                courseID: this.$route.params.courseID
            }).then((response) => {
                if (response.data.status === 0)
                    console.log(response.data.message);
                else {
                    this.course = response.data.course;
                    let course = this.course;
                    this.bread.systemName = course.info.systemName;
                    this.bread.systemUrl = `/course/list?system=${course.info['systemID']}`;
                    this.bread.typeName = course.info.typeName;
                    this.bread.typeUrl = `/course/list?system=${course.info['systemID']}&type=${course.info['typeID']}`;
                    this.bread.courseName = course.info.courseName;
                    document.title = course.info.courseName;
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }
</script>

<style src="../../assets/css/course-information.css"></style>
