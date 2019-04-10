<template>
    <div class="content">
        <div class="content-left">
            <list-header></list-header>
            <!--课程 S-->
            <div class="course-body">
                <!--课程排序 S-->
                <div class="tag">
                    <div class="left">
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
                    </div>
                    <div class="right">
                        <ul>
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
                    <div class="course" v-for="course in courses" :key="course['CourseID']">
                        <!--图片-->
                        <div class="left">
                            <div class="c-img">
                                <img src="../../assets/image/course-free.jpg" alt="">
                            </div>
                        </div>
                        <!--内容-->
                        <div class="right">
                            <div class="info">
                                <!--标题-->
                                <div class="title">
                                    <a><span class="text">{{course['CourseName']}}</span></a>
                                    <a :class="{price:true, free:course['Price'] === 0, charge:course['Price'] !== 0}">{{course['Price']
                                        === 0 ? '免费' : `${course['Price']} Finny`}}</a>
                                </div>
                                <!--授课老师/机构-->
                                <div class="teacher"><a>机构/老师名称</a></div>
                                <!--描述-->
                                <div class="description">{{course['CourseDescription']}}</div>
                                <!--细节-->
                                <div class="detail">
                                <span class="hot">
                                    <i class="far fa-user"></i>
                                    {{course['ApplyCount']}}人已报名
                                </span>
                                    <div class="praise">
                                        好评度 {{`${course['FavorableRate']*100}%`}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--课程列表 E-->
                <!--分页 S-->
                <list-footer :page="{pageSum: pageSum,pageUrl:pageUrl}"></list-footer>
                <!--分页 E-->
            </div>
            <!--课程 E-->
        </div>
        <div class="content-right">
            <h2 class="top">热门推荐</h2>
            <ul class="course-card-list">
                <li class="course-card-item" v-for="recommend in recommendCourse" :key="recommend['CourseID']">
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
</template>

<script>
    import ListHeader from './ListHeader'
    import SortPage from './SortPage'

    export default {
        name: "List",
        data() {
            return {
                bread: {
                    systemName: false,
                    systemUrl: false,
                    typeName: false,
                    typeUrl: false,
                    courseName: false
                },
                recommendCourse: '',
                //分页URL
                pageUrl: '',
                //排序URL
                sortUrl: '',
                //筛选URL
                filterUrl: '',
                //课程
                courses: '',
                //课程分页页数
                pageSum: 0
            }
        },
        methods: {
            changeUrl(val) {
                let systemQuery = val.system === undefined ? '' : `system=${val.system}`;
                let typeQuery = val.type === undefined ? '' : `type=${val.type}`;
                let filterQuery = val.filter === undefined ? '' : `filter=${val.filter}`;
                let sortQuery = val.sort === undefined ? '' : `sort=${val.sort}`;
                this.filterUrl = `/course/list?${systemQuery}${systemQuery === '' ? '' : '&'}` +
                    `${typeQuery}${typeQuery === '' ? '' : '&'}` +
                    `${sortQuery}${sortQuery === '' ? '' : '&'}`;
                this.sortUrl = `/course/list?${systemQuery}${systemQuery === '' ? '' : '&'}` +
                    `${typeQuery}${typeQuery === '' ? '' : '&'}` +
                    `${filterQuery}${filterQuery === '' ? '' : '&'}`;
                this.pageUrl = `/course/list?${systemQuery}${systemQuery === '' ? '' : '&'}` +
                    `${typeQuery}${typeQuery === '' ? '' : '&'}` +
                    `${filterQuery}${filterQuery === '' ? '' : '&'}` +
                    `${sortQuery}${sortQuery === '' ? '' : '&'}`;
            }
        },
        components: {
            "list-header": ListHeader,
            "list-footer": SortPage,
        },
        computed: {
            /* 改变URL */
            urlChanged() {
                return {
                    system: this.$route.query.system,
                    type: this.$route.query.type,
                    sort: this.$route.query.sort,
                    filter: this.$route.query.filter,
                    page: this.$route.query.page
                }
            }
        },
        watch: {
            /* 改变URL */
            urlChanged(val) {
                this.$axios.get(`/api${this.$route.fullPath}`).then((response) => {
                    if (response.data.status === 1) {
                        this.courses = response.data.course;
                        console.log(this.$route.meta)
                    } else console.log(response.data.message);
                }).catch((err) => {
                    console.log(err);
                });
                this.changeUrl(val);
            }
        },
        created() {
            /* 改变URL */
            let val = {
                system: this.$route.query.system,
                type: this.$route.query.type,
                sort: this.$route.query.sort,
                filter: this.$route.query.filter
            };
            /* 获取推荐课程 */
            this.$axios.get(`/api/course/list/recommend`).then((response) => {
                if (response.data.status === 1) {
                    this.recommendCourse = response.data.course;
                } else console.log(response.data.message);
            }).catch((err) => {
                console.log(err);
            });
            /* 获取课程 */
            this.$axios.get(`/api${this.$route.fullPath}`).then((response) => {
                if (response.data.status === 1) {
                    this.courses = response.data.course;
                } else console.log(response.data.message);
            }).catch((err) => {
                console.log(err);
            });
            this.changeUrl(val);
        }
    }
</script>

<style src="../../assets/css/course-list.css"></style>
