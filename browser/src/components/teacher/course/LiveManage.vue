<template>
    <div class="card-content">
        <div class="card-header">
            <div class="add-button" @click="addLive">开启直播</div>
        </div>
        <div class="card-list">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="course" label="课程名" width="110"></el-table-column>
                <el-table-column prop="title" label="直播名" width="139"></el-table-column>
                <el-table-column prop="pushUrl" label="OBS推流地址" width="230"></el-table-column>
                <el-table-column prop="pushName" label="OBS推流名称" width="290"></el-table-column>
                <el-table-column prop="time" label="过期时间"></el-table-column>
            </el-table>
            <!--分页 S-->
            <!--分页 S-->
            <div class="card-sort-page" v-if="tableData.length!==0">
                <el-pagination background layout="prev, pager, next"
                               :pager-count="5" @current-change="pageChanged"
                               :total="pageSum*10">
                </el-pagination>
            </div>
            <!--分页 E-->
            <!--分页 E-->
        </div>
        <!--对话框 S-->
        <el-dialog :show-close="false" top="20vh" width="30%" :visible.asnc="dialogFormVisible">
            <!--对话框标题 S-->
            <div slot="title" class="dialog-title">
                {{dialogFormInfo.title}}
                <button class="close" @click="dialogFormVisible = false">×</button>
            </div>
            <!--对话框标题 E-->
            <div class="dialog-content">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="视频名称" prop="title">
                        <el-input v-model="ruleForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="所属课程" prop="course">
                        <el-select v-model="ruleForm.course" placeholder="请选择课程" value="">
                            <el-option v-for="cos in course" :key="cos.courseID"
                                       :label="cos.courseName" :value="cos.courseID"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addSubmit">
                            立即添加
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <!--对话框 E-->
    </div>
</template>

<script>
    import {Message} from 'element-ui'
    import moment from 'moment'

    export default {
        name: "LiveManage",
        data() {
            return {
                pageSum: 0,
                dialogFormVisible: false,
                dialogFormInfo: {
                    title: null,
                    type: null,
                    id: null
                },
                course: [],
                ruleForm: {
                    title: '',
                    course: '',
                },
                rules: {
                    title: [
                        {required: true, message: '请输入视频名称', trigger: 'blur'},
                        {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
                    ],
                    course: [
                        {required: true, message: '请选择课程', trigger: 'change'}
                    ]
                },
                tableData: [],
            }
        },
        methods: {
            /* 获取视频信息 */
            async getLive(page) {
                this.tableData = [];
                try {
                    let url = `/api/teacher/course/live?page=${page}`;
                    let response = await this.$axios.get(url);
                    if (response.data.status === 1) {
                        let data = response.data.live;
                        for (let i = 0; i < data.length; i++) {
                            this.tableData.push({
                                course:data[i]['CourseInformation.CourseName'],
                                title:data[i]['title'],
                                pushUrl:data[i]['pushUrl'],
                                pushName:data[i]['pushName'],
                                time:moment(data[i]['txTime']).format('YYYY-MM-DD HH:mm:ss')
                            })
                        }
                        this.pageSum = response.data.count % 8 === 0 ?
                            Math.floor(response.data.count / 8) : Math.floor(response.data.count / 8) + 1;
                    } else console.log(response.data.msg);
                } catch (e) {
                    console.log(e);
                }
            },
            /* 页码改变 */
            pageChanged(val) {
                this.getLive(val);
            },
            /* 添加直播 */
            addLive() {
                this.getCourse();
                this.dialogFormVisible = true;
                this.dialogFormInfo.title = "添加视频";
            },
            addSubmit() {
                this.$refs['ruleForm'].validate(async valid => {
                    if (valid) {
                        let res = await this.$axios.post('/api/teacher/course/live/set', {
                            title: this.ruleForm.title, courseID: this.ruleForm.course
                        });
                        if(res.data.status===1){
                            Message.success(res.data.msg);
                            this.getLive(1);
                            this.dialogFormVisible = false;
                        }else Message.error(res.data.msg)
                    }
                });
            },
            /* 获取课程 */
            async getCourse() {
                try {
                    let response = await this.$axios.get('/api/teacher/course/teacher/live');
                    this.course = response.data.course;
                } catch (e) {
                    console.log(e);
                }
            },
        },
        async created() {
            this.getLive(1);
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

    .dialog-content {
        text-align: left;
        display: block;
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

    .cover {
        width: 90px;
        height: 50px;
        display: block;
        cursor: pointer;
        text-align: center;
        vertical-align: middle;
    }

    .cover img {
        width: 100%;
        height: 100%;
        border: 1px solid #ddd;
        vertical-align: middle;
    }

</style>