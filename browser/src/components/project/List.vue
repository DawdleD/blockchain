<template>
    <div class="course-all clearfix">
        <div class="course-content">
            <div class="content-left">
                <div class="search-bar" v-if="$route.params.search!==undefined">
                    <div class="keywords">
                        关键词：<span>{{$route.params.search}}</span>
                        <router-link to="/project/list" class="button-clear">×</router-link>
                    </div>
                    <div class="search-result">
                        共找到<span>{{` ${searchCount} `}}</span>门<span>{{` ${$route.params.search} `}}</span>相关课程
                    </div>
                </div>
                <list-header></list-header>
                <!--课程 S-->
                <div class="course-body">
                    <!--课程排序 S-->
                    <div class="course-tag">
                        <!-- <div class="left">
                            <ul>
                                <li>
                                    <router-link :class="{cur:$route.query.filter===undefined}" :to="filterUrl">
                                        全部
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :class="{cur:$route.query.filter==='1'}" :to="`${filterUrl}filter=1`">
                                        免费课
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :class="{cur:$route.query.filter==='2'}" :to="`${filterUrl}filter=2`">
                                        付费课
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :class="{cur:$route.query.filter==='3'}" :to="`${filterUrl}filter=3`">
                                        录播
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :class="{cur:$route.query.filter==='4'}" :to="`${filterUrl}filter=4`">
                                        直播
                                    </router-link>
                                </li>
                            </ul>
                        </div> -->
                        <div class="right">
                            <ul>
                                <!-- <li>
                                    <searchBarMid @searchInfo="handleSearchInfo" :searchColumnArr="searchColumnArr" :isSelectCom="isSelectCom" :searchOptionArr="searchOptionArr"></searchBarMid>
                                </li> -->
                                <li>
                                    <router-link :class="{cur:$route.query.sort===undefined}" :to="`${sortUrl}`">
                                        综合排序
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :class="{cur:$route.query.sort==='1'}" :to="`${sortUrl}sort=1`">
                                        好评率<i class="fas fa-long-arrow-alt-down"></i>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :class="{cur:$route.query.sort==='2'}" :to="`${sortUrl}sort=2`">
                                        人气<i class="fas fa-long-arrow-alt-down"></i>
                                    </router-link>
                                </li>
                                <li class="sort-item">
                                    <router-link tag="i"
                                                 :class="{fas:true,'fa-sort-up':true,up:true,active:$route.query.sort==='3'}"
                                                 :to="`${sortUrl}sort=3`">
                                    </router-link>
                                    <router-link :class="{cur:$route.query.sort==='3' || $route.query.sort==='4'}"
                                                 :to="$route.query.sort==='3'?`${sortUrl}sort=4`:`${sortUrl}sort=3`">
                                        &emsp;价格
                                    </router-link>
                                    <router-link tag="i"
                                                 :class="{fas:true,'fa-sort-down':true,down:true,active:$route.query.sort==='4'}"
                                                 :to="`${sortUrl}sort=4`">
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--课程排序 E-->
                    <!--课程列表 S-->
                    <div class="course-list">
                        <div class="no-course" v-if="projects.length === 0">
                            <div class="message">
                                <i class="fas fa-info-circle"></i>
                                <div class="text">该分类下无课程</div>
                            </div>
                        </div>
                        <div class="course" v-for="project in projects" :key="project['projectID']"
                             @click="gotoCourseInfo(`/project/${project['projectID']}/information`)">
                            <!--图片-->
                            <div class="left">
                                <div class="c-img">
                                    <img :src="project.projectPic" alt="">
                                </div>
                            </div>
                            <!--内容-->
                            <div class="right">
                                <div class="info">
                                    <!--标题-->
                                    <div class="title">
                                        <a><span class="text">{{project['projectName']}}</span></a>
                                        <a :class="{price:true, free:false, charge:true}">
                                            {{project['projectFee'] === 0 ? '免费' : `${project['projectFee']} Wei`}}</a>
                                    </div>
                                    <!--授课老师/机构-->
                                    <div class="teacher"><a>机构/老师名称:{{project.ProjectCreator.nickName}}</a></div>
                                    <!--描述-->
                                    <div class="description">{{project['projectIntro']}}</div>
                                    <!--细节-->
                                    <div class="detail">
                                        <span class="hot"><i class="fa fa-tasks"></i>项目状态:{{myTotalOption.labelProjectStatus[project['projectStatue']]}}</span>
                                        <div class="praise">
                                            状态登记: {{(project['txHash']!=null&&project['txHash'].startsWith('0x'))?"已登记":"未登记"}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--课程列表 E-->
                    <!--分页 S-->
                    <list-footer :page="{pageSum: pageSum,pageUrl:pageUrl}" v-if="projects.length > 0"></list-footer>
                    <!--分页 E-->
                </div>
                <!--课程 E-->
            </div>
            <div class="content-right">
                <h2 class="top">热门推荐</h2>
                <ul class="course-card-list">
                    <li class="course-card-item" v-for="recommend in recommendCourse"
                        :key="recommend['CourseID']" @click="gotoCourseInfo(`/project/${recommend['CourseID']}/information`)">
                        <a class="item-img-link">
                            <img src="../../assets/image/project-hot.png" alt="">
                        </a>
                        <h4 class="item-title">
                            <a class="item-title-link">{{recommend['CourseName']}}</a>
                        </h4>
                        <div class="item-info">
                            <span class="price charge" v-if="recommend['Price']>0">{{recommend['Price']}} Finny</span>
                            <span class="price free" v-else>免费</span>
                            <span class="praise">{{recommend['ApplyCount']}}人报名</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <information-dialog @dialogClose="handleDialogClose" :infoArr="infoArr" :infoTableWidth="infoTableWidth" :infoDialogVisible="infoDialogVisible" :infoTable="infoTable"></information-dialog>
    </div>
</template>

<script>
    import ListHeader from './ListHeader'
    import SortPage from './SortPage'
    import InformationDialog from '../common/InformationDialog'
    import SearchBarMid from '../common/SearchBar_mid'
    import {
    TotalOption,
    } from '../../utils/constant/options';  
import SearchBar_mid from '../common/SearchBar_mid';
    export default {
        name: "List",
        data() {
            return {
                recommendCourse: '',
                //分页URL
                pageUrl: '',
                //排序URL
                sortUrl: '',
                //筛选URL
                filterUrl: '',
                //课程
                projects: '',
                //课程分页页数
                pageSum: 0,
                //搜索课程总数
                searchCount: 0,
                myTotalOption:[],
                infoDialogVisible:false,
                infoArr:[{title:'defualt',value:'default'}],
                infoTableWidth:0,
                infoTable:[],

                searchColumnArr:[],
                isSelectCom:{},
                searchOptionArr:{},
            }
        },
        methods: {
            
            handleSearchInfo(val){
                console.log(val);
            },

            handleDialogClose(){
                this.infoDialogVisible=false;
            },
            gotoCourseInfo(path) {
                this.$router.push(path);
            },
            //生成URL模板，当参数改变时自动生成对应的查询URL
            changeUrl(val) {
                let systemQuery = val.projectField === undefined ? '' : `projectField=${val.projectField}`;
                let typeQuery = val.type === undefined ? '' : `type=${val.type}`;
                let filterQuery = val.filter === undefined ? '' : `filter=${val.filter}`;
                let sortQuery = val.sort === undefined ? '' : `sort=${val.sort}`;
                this.filterUrl = `${this.$route.path}?${systemQuery}${systemQuery === '' ? '' : '&'}` +
                    `${typeQuery}${typeQuery === '' ? '' : '&'}` +
                    `${sortQuery}${sortQuery === '' ? '' : '&'}`;
                this.sortUrl = `${this.$route.path}?${systemQuery}${systemQuery === '' ? '' : '&'}` +
                    `${typeQuery}${typeQuery === '' ? '' : '&'}` +
                    `${filterQuery}${filterQuery === '' ? '' : '&'}`;
                this.pageUrl = `${this.$route.path}?${systemQuery}${systemQuery === '' ? '' : '&'}` +
                    `${typeQuery}${typeQuery === '' ? '' : '&'}` +
                    `${filterQuery}${filterQuery === '' ? '' : '&'}` +
                    `${sortQuery}${sortQuery === '' ? '' : '&'}`;
            }
        },
        components: {
            "list-header": ListHeader,
            "list-footer": SortPage,
            "information-dialog":InformationDialog,
            "searchBarMid":SearchBar_mid
        },
        computed: {
            /* 改变URL */
            urlChanged() {
                return {
                    projectField: this.$route.query.projectField,
                    type: this.$route.query.type,
                    // not used
                    sort: this.$route.query.sort,
                    filter: this.$route.query.filter,
                    // not used
                    page: this.$route.query.page,
                    search: this.$route.params.search
                }
            }
        },
        watch: {
            /* 改变URL */
            urlChanged(val) {
                if (this.$route.params.search !== undefined)
                    this.$axios.post(`/api/project/query/getProjectCount`, {
                        search: this.$route.params.search
                    }).then((response) => {
                        if (response.data.status === 1) {
                            this.searchCount = response.data['count'];
                        } else console.log(response.data.message);
                    }).catch((err) => {
                        console.log(err);
                    });
                var myStr=this.$route.fullPath;
                var argList=myStr.indexOf('?')==-1?'':myStr.substr(myStr.indexOf("?"));
                var apiUrl=`/api/project/query/getproject/${argList}`
                console.log(apiUrl)
                this.$axios.get(apiUrl).then((response) => {
                    if (response.data.status === 1) {
                        this.projects = response.data.sqlres;
                    } else console.log(response.data.message);
                }).catch((err) => {
                    console.log(err);
                });
                this.changeUrl(val);
            }
        },
        created() {
            this.myTotalOption=TotalOption;
            /* 改变URL */
            // Test SerachBarMid
            this.searchColumnArr=[
                {'value':'creatorID','label':'创建者'},
                {'value':'projectField','label':'项目领域'},
                {'value':'projectName','label':'项目名称'},
            ];
            this.isSelectCom={
                'creatorID':false,
                'projectField':true,
                'projectName':false,
            };
            this.searchOptionArr={
                'projectField':TotalOption.optionProjectField,
            };
            // Test SerachBarMid End
            let val = {
                projectField: this.$route.query.projectField,
                type: this.$route.query.type,
                sort: this.$route.query.sort,
                filter: this.$route.query.filter
            };
            /* 如果有搜索课程先获取符合条件的课程总数 */
            if (this.$route.params.search !== undefined){
                this.$axios.post(`/api/project/query/getProjectCount`, {
                    search: this.$route.params.search
                }).then((response) => {
                    if (response.data.status === 1) {
                        this.searchCount = response.data['count'];
                    } else console.log(response.data.message);
                }).catch((err) => {
                    console.log(err);
                });}
            /* 获取推荐课程 */
            // this.$axios.get(`/api/course/list/recommend`).then((response) => {
            //     if (response.data.status === 1) {
            //         this.recommendCourse = response.data.course;
            //     } else console.log(response.data.message);
            // }).catch((err) => {
            //     console.log(err);
            // });
            /* 获取项目 */
            var myStr=this.$route.fullPath;
            var argList=myStr.indexOf('?')==-1?'':myStr.substr(myStr.indexOf("?"));
            var apiUrl=`/api/project/query/getproject/${argList}`        
            this.$axios.get(apiUrl).then((response) => {
                if (response.data.status == 1) {
                    this.projects = response.data.sqlres;
                } else console.log(response.data.message);
            }).catch((err) => {
                console.log(err);
            });
            this.changeUrl(val);
        }
    }
</script>

<style src="../../assets/css/course-list.css"></style>
