<template>
    <div class="card-content">
        <div class="card-header">
            <div class="add-button" @click="addStudent">添加成员</div>
            <div class="search-area">
                <el-input v-model="searchContent" placeholder="请输入内容" class="input-with-select">
                    <el-select slot="prepend" v-model="selectValue" value="">
                        <el-option label="学员姓名" value="1"></el-option>
                        <el-option label="课程" value="2"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </div>
        </div>
        <div class="card-list">
            <!--列表顶部信息 S-->
            <div class="card-list-header">
                <div class="card-row">
                    <div class="card-cell">学员姓名</div>
                    <div class="card-cell">所选课程</div>
                    <div class="card-cell">加入时间</div>
                    <div class="card-cell">期末成绩</div>
                    <div class="card-cell">操作</div>
                </div>
            </div>
            <!--列表顶部信息 E-->
            <!--列表不存在 S-->
            <div class="card-list-no-data" v-if="info.length===0">
                <div class="status-box">
                    <div class="box-icon">
                        <font-awesome-icon icon="info-circle"></font-awesome-icon>
                    </div>
                    <div class="box-text">
                        <div>暂无学员信息</div>
                    </div>
                </div>
            </div>
            <!--列表不存在 E-->
            <!--列表存在 S-->
            <div class="card-list-item" v-else>
                <div class="card-row content" v-for="student in info">
                    <div class="card-cell state">{{student.nickname}}</div>
                    <div class="card-cell state">{{student.courseName}}</div>
                    <div class="card-cell time">{{formatDate(student.joinTime)}}</div>
                    <div class="card-cell score">{{student.score}}</div>
                    <div class="card-cell operating">
                        <a class="btn-operate mark"
                           @click="setStudentScore(student.courseID,student.userID,student.examID)">期末总评</a>
                        <a class="btn-operate delete"
                           @click="deleteStudent(student.courseID,student.userID)">删除成员</a>
                    </div>
                </div>
            </div>
            <!--列表存在 E-->
            <!--分页 S-->
            <!--分页 S-->
            <div class="card-sort-page" v-if="info.length!==0">
                <el-pagination background layout="prev, pager, next"
                               :pager-count="5" @current-change="pageChanged"
                               :total="pageSum*10">
                </el-pagination>
            </div>
            <!--分页 E-->
            <!--分页 E-->
        </div>
        <!--对话框 S-->
        <el-dialog :show-close="false" top="20vh" width="20%" :visible.asnc="dialogFormVisible">
            <!--对话框标题 S-->
            <div slot="title" class="dialog-title">
                {{dialogFormInfo.title}}
                <button class="close" @click="dialogFormVisible = false">×</button>
            </div>
            <!--对话框标题 E-->
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="学员账号">
                    <el-input v-model="formInline.user" placeholder="学员账号"></el-input>
                </el-form-item>
                <el-form-item label="选择课程">
                    <el-select v-model="formInline.course" placeholder="选择课程" value="">
                        <el-option v-for="cos in course" :key="cos.courseID"
                                   :label="cos.courseName" :value="cos.courseID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addStudentSubmit">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--对话框 E-->
    </div>
</template>

<script>
    import {Message, MessageBox} from 'element-ui'
    import moment from 'moment'

    export default {
        name: "StudentManage",
        data() {
            return {
                isSearch: false,
                selectValue: '1',
                searchContent: null,
                info: [],
                pageSum: 0,
                dialogFormVisible: false,
                dialogFormInfo: {
                    title: null
                },
                formInline: {
                    user: '',
                    course: ''
                },
                course: []
            }
        },
        methods: {
            //获取学生信息
            async getStudent(page, type, content) {
                try {
                    let url = type === '0' ?
                        `/api/teacher/course/student?page=${page}` :
                        `/api/teacher/course/student?page=${page}&type=${type}&content=${content}`;
                    let response = await this.$axios.get(url);
                    if (response.data.status === 1) {
                        this.info = response.data.info;
                        this.pageSum = response.data.count % 8 === 0 ?
                            Math.floor(response.data.count / 8) : Math.floor(response.data.count / 8) + 1;
                    } else console.log(response.data.msg);
                } catch (e) {
                    console.log(e);
                }
            },
            //页码改变
            pageChanged(val) {
                this.isSearch ?
                    this.getStudent(val, this.selectValue, this.searchContent) :
                    this.getStudent(val, '0', null);
            },
            //搜索
            search() {
                if (this.searchContent === null || this.searchContent === '') Message.info('输入内容不能为空');
                else {
                    this.isSearch = true;
                    this.getStudent(1, this.selectValue, this.searchContent);
                }
            },
            //格式化日期
            formatDate(date) {
                return moment(date).format('YYYY-MM-DD');
            },
            //添加学员
            async addStudent() {
                this.dialogFormVisible = true;
                this.dialogFormInfo.title = "添加成员";
                try {
                    let response = await this.$axios.get('/api/teacher/course/teacher');
                    this.course = response.data.course;
                } catch (e) {
                    console.log(e);
                }
            },
            //添加成员提交
            async addStudentSubmit() {
                if (this.formInline.user === '') Message.warning('请输入学员账号');
                else if (this.formInline.course === '') Message.warning('请选择课程');
                else {
                    try {
                        let res = await this.$axios.post('/api/teacher/course/student/add', {
                            courseID: this.formInline.course, studentID: this.formInline.user
                        });
                        if (res.data.status === 1) {
                            Message.success(res.data.msg);
                            this.getStudent(1, '0', null);
                            this.formInline.course = '';
                            this.formInline.user = '';
                            this.dialogFormVisible = false;
                        } else Message.warning(res.data.msg);
                    } catch (e) {
                        console.log(e);
                        Message.error(e);
                    }
                }
            },
            //从课程中删除成员
            deleteStudent(courseID, userID) {
                MessageBox.confirm('确定从该课程中删除该成员？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await this.$axios.post('/api/teacher/course/student/delete', {courseID, userID});
                    if (res.data.status === 1) {
                        Message.success(res.data.msg);
                        this.getStudent(1, '0', null);
                    } else Message.warning(res.data.msg);
                }).catch(() => {
                    Message.info('已取消操作')
                })
            },
            //给学生打平时成绩
            async setStudentScore(courseID, userID, examID) {
                if (examID === null)
                    Message.warning('该课程暂无考试，无法进行总评');
                else {
                    let res = await this.$axios.post('/api/teacher/course/student/get-score', {courseID, userID});
                    MessageBox.confirm(`学生的平时成绩为${res.data.score}，确认加入总成绩吗？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        let res = await this.$axios.post('/api/teacher/course/student/update-score', {
                            courseID,
                            userID
                        });
                        if (res.data.status === 1) {
                            Message.success(res.data.msg);
                            this.getStudent(1, '0', null);
                        } else Message.error(res.data.msg);
                    }).catch(() => {
                        Message.info('已取消操作')
                    })
                }
            }
        },
        async created() {
            this.getStudent(1, '0', null);
        }
    }
</script>

<style scoped>
    .card-content {
        width: 925px;
        margin-left: auto;
        margin-right: auto;
    }

    .card-header {
        height: 40px;
    }

    .card-header .add-button {
        width: 80px;
        line-height: 38px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        float: left;
        color: #606266;
        font-size: 14px;
    }

    .add-button:hover {
        color: #fff;
        background-color: #409EFF;
        cursor: pointer;
    }

    .card-header .search-area {
        float: right;
    }

    .card-list {
        margin-top: 5px;
        box-sizing: border-box;
        font-size: 14px;
        color: #333;
    }

    .card-list-header {
        line-height: 42px;
        border: 1px solid #ddd;
        background: #409EFF;
        color: #fff;
    }

    .card-list-no-data {
        display: flex;
        height: 200px;
        justify-content: center;
        align-items: center;
        border: 1px solid #ddd;
        border-top: 0;
    }

    .status-box {
        display: inline-table;
        position: relative;
        color: #999;
    }

    .status-box .box-icon {
        padding-right: 15px;
        margin-right: 15px;
        display: table-cell;
    }

    .box-icon svg {
        font-size: 36px;
        color: #409eff;
    }

    .status-box .box-text {
        font-size: 18px;
        line-height: 36px;
        display: table-cell;
        vertical-align: middle;
    }

    .card-row {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .card-cell {
        position: relative;
        display: flex;
        width: 185px;
        -webkit-box-pack: center;
        justify-content: center;
    }

    .card-list-item {
        border: 1px solid #ddd;
        margin-top: 21px;
    }

    .card-list-item .content {
        -webkit-box-align: stretch;
        align-items: stretch;
    }

    .card-list-item .content .card-cell {
        padding-top: 20px;
        padding-bottom: 20px;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
    }

    .card-list-item .content .time {
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        color: #00a1d6;
    }

    .card-list-item .content .state {
        text-align: center;
    }

    .card-list-item .content .score {
        text-align: center;
        color: #ffb200;
    }

    .card-list-item .content .operating {
        text-align: center;
    }

    .card-list-item .content .operating a {
        display: block;
        color: #fff;
        line-height: 24px;
    }

    .operating .btn-operate {
        margin-bottom: 8px;
        margin-right: 10px;
        width: 70px;
        border-radius: 3px;
    }

    .operating .mark {
        background-color: #67c23a;
        border: 1px solid #67c23a;
    }

    .operating .delete {
        background-color: #F56C6C;
        border: 1px solid #F56C6C;
    }

    .card-sort-page {
        margin-top: 30px;
        text-align: center;
    }

    .dialog-title {
        padding-bottom: 5px;
        color: #333;
        font-size: 18px;
        width: 100%;
    }

    .close {
        padding: 0;
        cursor: pointer;
        background: transparent;
        border: 0;
        font-weight: 200;
        color: #999999;
        font-size: 26px;
        outline: none;
        text-shadow: none;
        float: right;
    }

</style>
<style>
    .el-select .el-input {
        width: 130px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>