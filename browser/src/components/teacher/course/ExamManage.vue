<template>
    <div class="card-content">
        <div class="card-header">
            <div class="add-button" @click="addPaper">增加试题</div>
        </div>
        <div class="card-list">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="name" label="名称" width="190"></el-table-column>
                <el-table-column prop="type" label="类型" width="190"></el-table-column>
                <el-table-column prop="startTime" label="开始时间" width="190"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" width="190"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success">更改
                        </el-button>
                        <el-button size="mini" type="danger" @click="deleteExam(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
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
                <el-form v-for="(question, index) in dynamicForm.question"
                         :model="question" :key="question.key" label-width="100px" class="demo-ruleForm">
                    <el-form-item :label="`${index+1}.`" prop="title"
                                  :rules="{required: true, message: '标题不能为空', trigger: 'blur'}">
                        <el-input type="textarea" placeholder="标题" v-model="question.title"></el-input>
                    </el-form-item>
                    <el-form-item label="A. " :rules="{required: true, message: '选项不能为空', trigger: 'blur'}"
                                  prop="a">
                        <el-input placeholder="A选项标题" v-model="question.a"></el-input>
                    </el-form-item>
                    <el-form-item label="B. " :rules="{required: true, message: '选项不能为空', trigger: 'blur'}"
                                  prop="b">
                        <el-input placeholder="B选项标题" v-model="question.b"></el-input>
                    </el-form-item>
                    <el-form-item label="C. " :rules="{required: true, message: '选项不能为空', trigger: 'blur'}"
                                  prop="c">
                        <el-input placeholder="C选项标题" v-model="question.c"></el-input>
                    </el-form-item>
                    <el-form-item label="D. " :rules="{required: true, message: '选项不能为空', trigger: 'blur'}"
                                  prop="d">
                        <el-input placeholder="D选项标题" v-model="question.d"></el-input>
                    </el-form-item>
                    <el-form-item label="正确答案" :rules="{required: true, message: '请选择活动区域', trigger: 'change'}"
                                  prop="answer">
                        <el-select v-model="question.answer" placeholder="答案" value="">
                            <el-option label="A" value="A"></el-option>
                            <el-option label="B" value="B"></el-option>
                            <el-option label="C" value="C"></el-option>
                            <el-option label="D" value="D"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.prevent="removeQuestion(question)">删除</el-button>
                    </el-form-item>
                </el-form>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="考试类型" prop="type">
                        <el-select v-model="ruleForm.type" placeholder="选择考试类型" value="">
                            <el-option label="平时测验" value="exercise"></el-option>
                            <el-option label="期末测验" value="exam"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属课程" prop="course" v-if="ruleForm.type==='exam'">
                        <el-select v-model="ruleForm.course" placeholder="选择课程" value="">
                            <el-option v-for="cos in course" :key="cos.courseID"
                                       :label="cos.courseName" :value="cos.courseID"
                                       :disabled="cos.examID!==null"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属视频" prop="video" v-if="ruleForm.type==='exercise'">
                        <el-select v-model="ruleForm.video" placeholder="选择视频" value="">
                            <el-option v-for="v in video" :key="v.videoID"
                                       :label="v.videoName" :value="v.videoID"
                                       :disabled="v.examID!==null"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="考试时间" required>
                        <el-col :span="11">
                            <el-form-item prop="startTime">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.startTime"
                                                style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-form-item prop="endTime">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.endTime"
                                                style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addQuestion">新增题目</el-button>
                        <el-button type="primary" @click="addSubmit">立即创建</el-button>
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
        name: "ExamManage",
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
                video: [],
                tableData: [],
                dynamicForm: {
                    question: []
                },
                ruleForm: {
                    type: null,
                    startTime: null,
                    endTime: null,
                    course: null,
                    video: null,
                },
                rules: {
                    type: [
                        {required: true, message: '请选择活动区域', trigger: 'change'}
                    ],
                    startTime: [
                        {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
                    ],
                    endTime: [
                        {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
                    ],
                    course: [
                        {required: true, message: '请选择课程', trigger: 'change'}
                    ],
                    video: [
                        {required: true, message: '请选择视频', trigger: 'change'}
                    ],
                }
            }
        },
        methods: {
            /* 获取考试信息 */
            async getPaper(page) {
                this.tableData = [];
                let res = await this.$axios.get(`/api/teacher/course/paper?page=${page}`);
                if (res.data.status === 1) {
                    let data = res.data.rows;
                    for (let i = 0; i < data.length; i++) {
                        this.tableData.push({
                            type: data[i]['CourseInformation.CourseID'] !== null ? "期末测验" : "课后测验",
                            name: data[i]['CourseInformation.CourseName'] === null ?
                                data[i]['CourseVideo.videoName'] : data[i]['CourseInformation.CourseName'],
                            startTime: moment(data[i]['startTime']).format('YYYY-MM-DD'),
                            endTime: moment(data[i]['endTime']).format('YYYY-MM-DD'),
                            course: data[i]['CourseInformation.CourseID'],
                            video: data[i]['CourseVideo.videoID'],
                            exam: data[i]['examID']
                        })
                    }
                    this.pageSum = res.data.count % 8 === 0 ?
                        Math.floor(res.data.count / 8) : Math.floor(res.data.count / 8) + 1;
                } else console.log(res.data.msg);
            },
            /* 页码改变 */
            pageChanged(val) {
                this.getPaper(val);
            },
            /* 添加试卷 */
            addPaper() {
                this.getCourse();
                this.getVideo();
                this.dialogFormVisible = true;
                this.dialogFormInfo.title = "添加试题";
            },
            /* 获取课程 */
            async getCourse() {
                try {
                    let response = await this.$axios.get('/api/teacher/course/teacher');
                    this.course = response.data.course;
                } catch (e) {
                    console.log(e);
                }
            },
            /* 获取视频 */
            async getVideo() {
                try {
                    let response = await this.$axios.get(`/api/teacher/course/video/all`);
                    this.video = response.data.video;
                } catch (e) {
                    console.log(e);
                }
            },
            /* 动态增加题目 */
            addQuestion() {
                this.dynamicForm.question.push({
                    title: '',
                    a: '',
                    b: '',
                    c: '',
                    d: '',
                    answer: '',
                    key: Date.now()
                })
            },
            /* 删除题目 */
            removeQuestion(item) {
                const index = this.dynamicForm.question.indexOf(item);
                if (index !== -1) {
                    this.dynamicForm.question.splice(index, 1)
                }
            },
            /* 提交添加试卷 */
            addSubmit() {
                this.$refs['ruleForm'].validate(async (valid) => {
                    if (this.dynamicForm.question.length === 0) {
                        Message.info("请先添加试题");
                        return false;
                    }
                    if (valid) {
                        let res = await this.$axios.post('/api/teacher/course/paper/add', {
                            question: this.dynamicForm.question,
                            condition: this.ruleForm
                        });
                        if (res.data.status === 1) {
                            Message.success(res.data.msg);
                            this.dialogFormVisible = false;
                            this.getPaper(1);
                        } else Message.error(res.data.msg);
                    } else return false;
                });
            },
            /* 删除考试 */
            async deleteExam(row) {
                let type = row.video === null ? 'exam' : 'exercise';
                let examID = row.exam;
                let res = await this.$axios.post('/api/teacher/course/paper/delete', {type, examID});
                if (res.data.status === 1) {
                    Message.success(res.data.msg);
                   this.getPaper(1);
                } else Message.error(res.data.msg);
            }
        },
        async created() {
            this.getPaper(1);
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