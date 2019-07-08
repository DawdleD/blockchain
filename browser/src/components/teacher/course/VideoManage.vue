<template>
    <div class="card-content">
        <div class="card-header">
            <div class="add-button" @click="addVideo">添加视频</div>
            <div class="search-area">
                <el-input v-model="searchContent" placeholder="请输入视频名" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </div>
        </div>
        <div class="card-list">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="id" label="视频ID" width="120">
                </el-table-column>
                <el-table-column prop="name" label="视频名" width="230">
                </el-table-column>
                <el-table-column prop="course" label="所属课程" width="200"></el-table-column>
                <el-table-column prop="chapter" label="所属章节" width="200">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="updateVideo(scope.row)">编辑
                        </el-button>
                        <el-button size="mini" type="danger" @click="deleteVideo(scope.row)">删除
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
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="视频名称" prop="name">
                        <el-input v-model="ruleForm.name">
                            <template slot="append" v-if="dialogFormInfo.type==='add'">
                                <label>
                                    <input type="file" id="upload" accept="video/*" style="display:none"
                                           ref="file" @change="getFileInfo"></input>
                                    <el-button type="primary" @click="chooseFile">选取视频</el-button>
                                </label>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="所属课程" prop="course">
                        <el-select v-model="ruleForm.course" placeholder="请选择课程" value="" @change="getChapter">
                            <el-option v-for="cos in course" :key="cos.courseID"
                                       :label="cos.courseName" :value="cos.courseID"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属章节" prop="chapter">
                        <el-select v-model="ruleForm.chapter" placeholder="请选择章节" value="">
                            <el-option v-for="cpt in chapter" :key="cpt.chapterID"
                                       :label="cpt.chapterName" :value="cpt.chapterID"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上传进度" v-if="dialogFormInfo.type==='add'">
                        <el-progress :percentage="percent" :text-inside="true" :stroke-width="18"></el-progress>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="uploadVideo" :disabled="upload"
                                   v-if="dialogFormInfo.type==='add'">
                            立即添加
                        </el-button>
                        <el-button type="primary" @click="updateSubmit" v-if="dialogFormInfo.type==='update'">
                            立即更新
                        </el-button>
                        <el-button @click="resetForm('ruleForm')" :disabled="upload"
                                   v-if="dialogFormInfo.type==='add'">重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <!--对话框 E-->
    </div>
</template>

<script>
    import {Message, MessageBox, Loading} from 'element-ui'
    import Tcvod from 'vod-js-sdk-v6'

    export default {
        name: "VideoManage",
        data() {
            return {
                isSearch: false,
                selectValue: null,
                searchContent: null,
                pageSum: 0,
                dialogFormVisible: false,
                dialogFormInfo: {
                    title: null,
                    type: null,
                    id: null
                },
                course: [],
                chapter: [],
                ruleForm: {
                    name: '',
                    duration: 0,
                    course: '',
                    chapter: '',
                },
                rules: {
                    name: [
                        {required: true, message: '请输入视频名称', trigger: 'blur'},
                        {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
                    ],
                    course: [
                        {required: true, message: '请选择课程', trigger: 'change'}
                    ],
                    chapter: [
                        {required: true, message: '请选择章节', trigger: 'change'}
                    ]
                },
                upload: false,
                tableData: [],
                file: null,
                percent: 0
            }
        },
        methods: {
            /* 获取视频信息 */
            async getVideo(page, search) {
                this.tableData = [];
                try {
                    let url = search === undefined ?
                        `/api/teacher/course/video?page=${page}` :
                        `/api/teacher/course/video?page=${page}&search=${search}`;
                    let response = await this.$axios.get(url);
                    if (response.data.status === 1) {
                        let data = response.data.video;
                        for (let i = 0; i < data.length; i++) {
                            this.tableData.push({
                                id: data[i]['videoID'], name: data[i]['videoName'],
                                chapter: data[i]['CourseChapter.chapterName'],
                                cptID: data[i]['CourseChapter.chapterID'],
                                course: data[i]['CourseChapter.CourseInformation.courseName'],
                                cseID: data[i]['CourseChapter.CourseInformation.courseID']
                            })
                        }
                        this.pageSum = response.data.count % 8 === 0 ?
                            Math.floor(response.data.count / 8) : Math.floor(response.data.count / 8) + 1;
                    } else console.log(response.data.msg);
                } catch (e) {
                    console.log(e);
                }
            },
            /* 获取课程章节 */
            async getChapter(courseID) {
                let res = await this.$axios.get(`/api/teacher/course/file/chapter?courseID=${courseID}`);
                if (res.data.status === 1) this.chapter = res.data.chapter;
                else console.log(res.data.msg);
            },
            /* 页码改变 */
            pageChanged(val) {
                this.isSearch ?
                    this.getVideo(val, this.searchContent) :
                    this.getVideo(val);
            },
            /* 搜索 */
            search() {
                if (this.searchContent === null || this.searchContent === '') Message.info('输入内容不能为空');
                else {
                    this.isSearch = true;
                    this.tableData = [];
                    this.getVideo(1, this.searchContent);
                }
            },
            /* 添加章节 */
            addVideo() {
                this.getCourse();
                this.dialogFormVisible = true;
                this.dialogFormInfo.title = "添加视频";
                this.dialogFormInfo.type = "add";
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
            /* 文件检查 */
            beforeUpload(file) {
                const isValid = (file.type === 'video/mp4' || file.type === 'video/flv'
                    || file.type === 'video/wmv' || file.type === 'video/mpg'
                    || file.type === 'video/mpeg' || file.type === 'video/avi'
                    || file.type === 'video/webm' || file.type === 'video/mkv');
                const isLt1G = file.size / 1024 / 1024 < 1024;
                if (!isValid) Message.error('仅支持.mp4, .flv, .wmv, .mpg, .mepg, .webm, .avi, .mkv视频文件上传!');
                if (!isLt1G) Message.error('上传文件大小不能超过 1GB!');
                return isValid && isLt1G;
            },
            /* 从服务端获取签名 */
            async getSignature() {
                return await this.$axios.get('/api/teacher/course/video/signature').then(function (response) {
                    return response.data.signature;
                });
            },
            /* 选择文件 */
            chooseFile() {
                const fileInput = document.getElementById('upload');
                fileInput.click();
            },
            /* 获取视频信息 */
            getFileInfo() {
                let file = this.$refs.file.files[0];
                this.ruleForm.name = file.name;

            },
            /* 上传视频 */
            uploadVideo() {
                let file = this.$refs.file.files[0];
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid && this.beforeUpload(file)) {
                        this.upload = true;
                        const tcVod = new Tcvod({getSignature: this.getSignature});
                        const uploader = tcVod.upload({
                            mediaFile: file, // 媒体文件（视频或音频或图片），类型为 File
                        });
                        uploader.on('media_progress', (info) => {
                            this.percent = info.percent * 100; // 进度
                        });
                        uploader.done().then(async (doneResult) => {
                            Loading.service({
                                fullscreen: true,
                                text: '正在处理视频，请稍等.....'
                            });
                            let fileId = doneResult.fileId.toString();
                            let res = await this.$axios.post('/api/teacher/course/video/add', {
                                courseID: this.ruleForm.course, chapterID: this.ruleForm.chapter,
                                videoName: this.ruleForm.name, fileId
                            });
                            if (res.data.status === 1) {
                                Loading.service({}).close();
                                this.getVideo(1);
                                this.dialogFormVisible = false;
                                Message.success(res.data.msg);
                                this.ruleForm = {
                                    name: '', duration: 0, course: '', chapter: '',
                                }
                            } else {
                                Loading.service({}).close();
                                this.dialogFormVisible = false;
                                Message.error(res.data.msg);
                            }
                        });
                    } else return false;
                });
            },
            /* 重置表单内容 */
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            /* 更新视频信息 */
            updateVideo(val) {
                this.getCourse();
                this.dialogFormVisible = true;
                this.ruleForm.name = val.name;
                this.ruleForm.course = val.cseID;
                this.getChapter(val.cseID);
                this.ruleForm.chapter = val.cptID;
                this.dialogFormInfo.id = val.id;
                this.dialogFormInfo.title = "更新视频";
                this.dialogFormInfo.type = "update";
            },
            /* 更新视频提交 */
            updateSubmit() {
                this.$refs['ruleForm'].validate(async valid => {
                    if (valid) {
                        let res = await this.$axios.post('/api/teacher/course/video/update', {
                            courseID: this.ruleForm.course, chapterID: this.ruleForm.chapter,
                            videoName: this.ruleForm.name, videoID: this.dialogFormInfo.id
                        });
                        if (res.data.status === 1) {
                            this.dialogFormVisible = false;
                            this.getVideo(1);
                            Message.success(res.data.msg);
                            this.ruleForm = {
                                name: '', duration: 0, course: '', chapter: '',
                            }
                        } else {
                            this.dialogFormVisible = false;
                            Message.error(res.data.msg);
                        }
                    } else return false;
                });
            },
            /* 删除视频 */
            deleteVideo(val) {
                MessageBox.confirm('确定从该课程中删除该视频？（不可恢复）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await this.$axios.post('/api/teacher/course/video/delete', {
                        courseID: val.cseID, videoID: val.id
                    });
                    if (res.data.status === 1) {
                        Message.success(res.data.msg);
                        this.getVideo(1);
                    } else Message.warning(res.data.msg);
                }).catch(() => {
                    Message.info('已取消操作')
                })
            }
        },
        async created() {
            this.getVideo(1);
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

<style>
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .el-form-item__content .line {
        text-align: center;
    }

    .el-dialog {
        min-width: 650px;
    }
</style>