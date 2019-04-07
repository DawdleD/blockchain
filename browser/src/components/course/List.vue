<template>
    <div class="content">
        <list-header :systemType="{systemUrl:systemUrl,typeUrl:typeUrl}"></list-header>
        <!--课程 S-->
        <div class="course-body">
            <!--课程排序 S-->
            <div class="tag">
                <div class="left">
                    <ul>
                        <li><a class="cur">全部</a></li>
                        <li><a>免费课</a></li>
                        <li><a>付费课</a></li>
                        <li><a>录播</a></li>
                        <li><a>直播</a></li>
                    </ul>
                </div>
                <div class="right">
                    <ul>
                        <li class="cur">综合排序</li>
                        <li><a>好评率<i class="fas fa-long-arrow-alt-down"></i></a></li>
                        <li><a>人气<i class="fas fa-long-arrow-alt-down"></i></a></li>
                        <li class="sort-item">
                            <i class="fas fa-sort-up up active"></i>
                            <a>&emsp;价格</a>
                            <i class="fas fa-sort-down down"></i>
                        </li>
                    </ul>
                </div>
            </div>
            <!--课程排序 E-->
            <!--课程列表 S-->
            <div class="course-list">
                <div class="course">
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
                                <a><span class="text">课程标题</span></a>
                                <a class="price free">免费</a>

                            </div>
                            <!--授课老师/机构-->
                            <div class="teacher"><a>机构/老师名称</a></div>
                            <!--描述-->
                            <div class="description">
                                这里是具体的课程描述，这里是具体的课程描述。这里是具体的课程描述。这里是具体的课程描述
                                这里是具体的课程描述。这里是具体的课程描述。这里是具体的课程描述，这里是具体的课程描述。
                            </div>
                            <!--细节-->
                            <div class="detail">
                                <span class="hot">
                                    <i class="far fa-user"></i>
                                    726人已报名
                                </span>
                                <div class="praise">
                                    好评度 100%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="course">
                    <!--图片-->
                    <div class="left">
                        <div class="c-img">
                            <img src="../../assets/image/course.png" alt="">
                        </div>
                    </div>
                    <!--内容-->
                    <div class="right">
                        <div class="info">
                            <!--标题-->
                            <div class="title">
                                <a><span class="text">比特币</span></a>
                                <a class="price charge">￥1234</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--课程列表 E-->
            <!--分页 S-->
            <list-footer :page="{pageSum: 12,pageUrl:pageUrl}"></list-footer>
            <!--分页 E-->
        </div>
        <!--课程 E-->
    </div>
</template>

<script>
    import ListHeader from './ListHeader'
    import SortPage from './SortPage'

    export default {
        name: "List",
        data() {
            return {
                system: '',
                systemUrl: '',
                type: '',
                typeUrl: '',
                sort: '',
                sortUrl: '',
                page: '',
                pageUrl: ''
            }
        },
        components: {
            "list-header": ListHeader,
            "list-footer": SortPage
        },
        created() {
            this.system = this.$route.query.system;
            this.type = this.$route.query.type;
            this.sort = this.$route.query.sort;
            this.page = this.$route.query.page;
            let systemQuery = this.system === undefined ? '' : `system=${this.system}`;
            this.systemUrl = `${this.$route.path}?${systemQuery}`;
            let typeQuery = this.type === undefined ? '' : `type=${this.type}`;
            this.typeUrl = `${this.$route.path}?${systemQuery}&${typeQuery}`;
            let sortQuery = this.sort === undefined ? '' : `type=${this.sort}`;
            this.pageUrl =
                `${this.$route.path}?${systemQuery}${systemQuery === '' ? '' : '&'}${typeQuery}${typeQuery === '' ? '' : '&'}${sortQuery}${sortQuery === '' ? '' : '&'}`;
            console.log(this.pageUrl)
        }
    }
</script>

<style src="../../assets/css/course-list.css"></style>
