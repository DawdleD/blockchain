<template>
    <div id="container">
        <app-header :page="page"></app-header>
        <div class="course-manage">
            <div class="inner-center">
                <div class="main">
                    <el-tabs type="border-card" v-model="activeName" @tab-click="tabsChange">
                        <el-tab-pane label="学员管理" name="student"></el-tab-pane>
                        <el-tab-pane label="信息管理" name="list"></el-tab-pane>
                        <el-tab-pane label="章节管理" name="chapter"></el-tab-pane>
                        <el-tab-pane label="视频管理" name="video"></el-tab-pane>
                        <el-tab-pane label="直播管理" name="live"></el-tab-pane>
                        <el-tab-pane label="课件管理" name="pdf"></el-tab-pane>
                        <el-tab-pane label="资料管理" name="file"></el-tab-pane>
                        <el-tab-pane label="试卷管理" name="exam"></el-tab-pane>
                        <router-view></router-view>
                    </el-tabs>
                </div>
            </div>
        </div>
        <app-footer></app-footer>
    </div>
</template>

<script>
    import Header from '../../components/common/Header'
    import Footer from '../../components/common/Footer'

    export default {
        name: "Course",
        components: {
            'app-header': Header,
            'app-footer': Footer
        },
        data() {
            return {
                page: "courseMng",
                activeName: null
            }
        },
        methods: {
            //tabs改变时触发
            tabsChange(event) {
                this.$router.push(`/teacher/course/${event.name}`)
            },
            //路由加载或更新时设置activeName
            setActiveName(routerName) {
                switch (routerName) {
                    case'CSM':
                        this.activeName = 'student';
                        break;
                    case 'CM':
                        this.activeName = 'list';
                        break;
                    case 'CCM':
                        this.activeName = 'chapter';
                        break;
                    case 'CVM':
                        this.activeName = 'video';
                        break;
                    case 'CLM':
                        this.activeName = 'live';
                        break;
                    case 'CPM':
                        this.activeName = 'pdf';
                        break;
                    case 'CFM':
                        this.activeName = 'file';
                        break;
                    case 'CEM':
                        this.activeName = 'exam';
                        break;
                }
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.setActiveName(to.name)
            });
        },
        beforeRouteUpdate(to, from, next) {
            this.setActiveName(to.name);
            next();
        }
    }
</script>

<style scoped>
    .course-manage {
        background-color: #f5f5f5;
        min-height: 920px;
        clear: both;
    }

    .inner-center {
        width: 1200px;
        margin-left: auto;
        margin-right: auto;
        box-sizing: border-box;
    }

    .inner-center .main {
        width: 100%;
        box-sizing: border-box;
        padding: 30px 0;
    }
</style>