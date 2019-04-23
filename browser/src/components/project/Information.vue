<template>
    <div class="course-information">
        <div class="course-banner">
            <div class="inner-center clearfix">
                <!--面包屑导航 S-->
                <!-- <course-bread :bread="bread"></course-bread> -->
                <!--面包屑导航 E-->
                <!--课程详情 S-->
                <div class="course-img-text">
                    <div class="course-img-left">
                        <img src="../../assets/image/project.jpg" alt="">
                    </div>
                    <div class="course-text-right">
                        <h1 class="text-title">{{project.projectName}}</h1>
                        <div class="enroll-info">
                            <div class="enroll-course-info">
                                <div class="teacher-name">项目发起人ID：{{project.creatorId}}</div>
                                <div class="workload">项目开始时间：{{project.createTime}}</div>
                                <div class="workload">项目方向：{{myTotalOption.labelProjectField[project.projectField]}}</div>
                                <div class="workload">项目费用：{{project.projectFee}}</div>
                                <div class="workload">互评阶段：{{myTotalOption.labelRemarkPhase[project.remarkPhase]}}</div>

                            </div>
                            <div class="enroll">
                                <!-- <div class="course-apply">已有{{course.info['applyCount']}}人报名</div> -->
                                <div class="enroll-apply-btn">
                                    <div class="enroll-button">
                                        提交报名申请
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--课程详情 E-->
            </div>
        </div>
        <div class="info-main">
            <div class="inner-center clearfix">
                <div class="main">
                    <div class="tabs">
                        <div class="tabs-title-bar">
                            <h2 :class="{'tabs-title':true,active:tabsTitle.projectMemberTab}"
                                @click="tabsChange('projectMemberTab')">课程成员</h2>
                            <h2 :class="{'tabs-title':true,active:tabsTitle.projectRewardTab}"
                                @click="tabsChange('projectRewardTab')">项目奖惩</h2>
                            <h2 :class="{'tabs-title':true,active:tabsTitle.projectScoreTab}"
                                @click="tabsChange('projectScoreTab')">项目分值</h2>
                            <!-- <h2 :class="{'tabs-title':true,active:tabsTitle.courseComment}"
                                @click="tabsChange('courseComment')">课程评价(13456)</h2> -->
                        </div>
                        <div class="tabs-content">
                            <!--课程详情 S-->
                            <div :class="{'course-details':true,hide:!tabsTitle.projectMemberTab}">
                                <div class="details-title">
                                    <i class="fas fa-th-large"></i>
                                    <span>成员信息概述</span>
                                </div>
                                <div class="details-content">
                                    <el-table :data="memberInfo" border style="width: 100%">
                                        <el-table-column prop="memberId" label="成员ID" width="180">
                                        </el-table-column>
                                        <el-table-column prop="userName" label="姓名" width="180">
                                        </el-table-column>
                                        <el-table-column prop="memberType" label="成员类型">
                                            <template slot-scope="scope">
                                                {{myTotalOption.labelMemberType[scope.row.memberType]}}
                                            </template>              
                                        </el-table-column>
                                        <el-table-column prop="frozenBalance" label="冻结资产">
                                        </el-table-column>
                                        <el-table-column fixed="right" label="操作" width="200">
                                            <template slot-scope="scope">
                                            <div>
                                                <el-button
                                                @click.native.prevent="queryMemberInfo(scope.row.memberId)"
                                                type="text"
                                                size="small">
                                                成员详情
                                                </el-button>    
                                                <el-button
                                                @click.native.prevent="checkProjectStateOnChain()"
                                                type="text"
                                                size="small">
                                                区块链核验
                                                </el-button>                         
                                            </div>
                                </template>
                                        </el-table-column>        
                                    </el-table>
                                </div>

                            </div>
                            <!--课程详情 E-->
                            <!--课程目录 S-->
                            <div :class="{'chapter-list':true,hide:!tabsTitle.projectRewardTab}">
                                <el-table :data="rewardInfo" border >
                                    <el-table-column prop="rewardId" label="记录ID号" width="180">
                                    </el-table-column>
                                    <el-table-column prop="userId" label="受奖惩成员ID" width="140">
                                    </el-table-column>
                                    <el-table-column  label="奖惩类型">
                                        <template slot-scope="scope">
                                            {{myTotalOption.labelRewardType[scope.row.awardType]}}
                                        </template>              
                                    </el-table-column>
                                    <el-table-column prop="awardAmount" label="奖惩金额">
                                    </el-table-column>
                                    <el-table-column fixed="right" label="操作" width="150">
                                        <template slot-scope="scope">
                                        <div>
                                            <el-button @click.native.prevent="rewardItemInfo(scope.row)" type="text" size="small">
                                                详情
                                            </el-button>
                                            <el-button @click.native.prevent="checkRewardOnChain(scope.row)" type="text" size="small">
                                                区块链核验
                                            </el-button>
                                        </div>
                                        </template>
                                    </el-table-column>
                                </el-table>                                
                            </div>
                            <!--课程目录 E-->
                            <!--课程资料 S-->
                            <div :class="{'file-list':true,hide:!tabsTitle.projectScoreTab}">                      
                             
                                <p class="instruction-text" v-if="(project.remarkPhase!='COMPLETED')">
                                    <i class="fa fa-exclamation-circle"></i><span>评分尚未生成!</span>
                                </p>
                                <el-table :data="memberInfo" border  v-else>
                                    <el-table-column prop="userId" label="受评分成员ID" width="140">
                                    </el-table-column>
                                    <el-table-column prop="attitudeScore" label="态度评分">
                                    </el-table-column>
                                    <el-table-column prop="codeScore" label="代码能力评分">
                                    </el-table-column>
                                    <el-table-column prop="designScore" label="设计创新评分">
                                    </el-table-column>        
                                    <el-table-column fixed="right" label="操作" width="150">
                                        <template>
                                        <div>
                                            <el-button @click.native.prevent="checkScoreOnChain()" type="text" size="small">
                                                区块链核验
                                            </el-button>
                                        </div>
                                        </template>
                                    </el-table-column>
                                </el-table>                                
                            </div>
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
    import {
        TotalOption,
    } from '../../utils/constant/options'; 
    export default {
        name: "Information",
        data() {
            return {
                bread: {
                    systemName: '', systemUrl: '',
                    typeName: '', typeUrl: '',
                    courseName: '', courseUrl: ''
                },
                project: {
                },
                memberInfo:[],
                rewardInfo:[],
                scoreInfo:[],
                tabsTitle: {
                    projectMemberTab: true,
                    projectRewardTab: false,
                    projectScoreTab: false,
                    courseComment: false
                },
                courseChapter: '',
                myTotalOption:[],
            }
        },
        components: {
            'course-bread': CourseBread
        },
        methods: {
            tabsInit() {
                this.tabsTitle = {
                    projectMemberTab: false,
                    projectRewardTab: false,
                    projectScoreTab: false,
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
        created(){
            this.myTotalOption=TotalOption;
            this.$axios.post('/api/project/query/getProjectInfo', {
                projectId: this.$route.params.projectId
            }).then((response) => {
                if (response.data.flag == 0)
                    console.log(response.data.message);
                else {
                    this.project = response.data.sqlres1[0];
                    this.memberInfo = response.data.sqlres2;
                    console.log(this.memberInfo)
                    this.rewardInfo = response.data.sqlres3;
                    // this.bread.systemName = course.info.systemName;
                    // this.bread.systemUrl = `/course/list?system=${course.info['systemID']}`;
                    // this.bread.typeName = course.info.typeName;
                    // this.bread.typeUrl = `/course/list?system=${course.info['systemID']}&type=${course.info['typeID']}`;
                    // this.bread.courseName = course.info.courseName;
                    document.title = this.project.projectName;
                }
            }).catch((err) => {
                console.log(err);
            });
            
        },

    }
</script>

<style src="../../assets/css/course-information.css"></style>

<style scoped>
.instruction-text {
    text-align: center;
    line-height: 20px;
}
</style>

