<template>
    <div class="card-content">
        <div class="card-header">
            <div class="add-button" @click="addFile">添加文件</div>
            <div class="search-area">
                <el-input v-model="searchContent" placeholder="请输入内容" class="input-with-select">
                    <el-select slot="prepend" v-model="selectValue" value="">
                        <el-option label="文件名" value="name"></el-option>
                        <el-option label="文件类型" value="type"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </div>
        </div>
        <div class="card-list">
            <!--列表顶部信息 S-->
            <div class="card-list-header">
                <div class="card-row">
                    <div class="card-cell">文件名</div>
                    <div class="card-cell">所属课程</div>
                    <div class="card-cell">所属章节</div>
                    <div class="card-cell">文件类型</div>
                    <div class="card-cell">文件大小</div>
                    <div class="card-cell">操作</div>
                </div>
            </div>
            <!--列表顶部信息 E-->
            <!--列表不存在 S-->
            <div class="card-list-no-data" v-if="file.length===0">
                <div class="status-box">
                    <div class="box-icon">
                        <font-awesome-icon icon="info-circle"></font-awesome-icon>
                    </div>
                    <div class="box-text">
                        <div>暂无文件信息</div>
                    </div>
                </div>
            </div>
            <!--列表不存在 E-->
            <!--列表存在 S-->
            <div class="card-list-item" v-else>
                <div class="card-row content" v-for="f in file" :key="f.fileID">
                    <div class="card-cell">{{f.fileName}}</div>
                    <div class="card-cell green">{{f['CourseChapter.CourseInformation.courseName']}}</div>
                    <div class="card-cell green">{{f['CourseChapter.chapterName']}}</div>
                    <div class="card-cell blue">{{f.fileType}}</div>
                    <div class="card-cell gold">{{f.fileSize > 1024*1024 ? `${(f.fileSize / (1024 *
                        1024)).toFixed(2)}MB` :
                        `${(f.fileSize / 1024).toFixed(2)}KB`}}
                    </div>
                    <div class="card-cell operating" v-if="f.deletedAt===null">
                        <a class="btn-operate mark"
                           @click="updateFile(f)">更新信息</a>
                        <a class="btn-operate delete"
                           @click="deleteFile(f,false)">删除文件</a>
                    </div>
                    <div class="card-cell operating" v-else>
                        <a class="btn-operate mark"
                           @click="recoverFile(f)">恢复文件</a>
                        <a class="btn-operate delete"
                           @click="deleteFile(f,true)">彻底删除</a>
                    </div>
                </div>
            </div>
            <!--列表存在 E-->
            <!--分页 S-->
            <!--分页 S-->
            <div class="card-sort-page" v-if="file.length!==0">
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
                    <el-form-item label="文件名称" prop="name">
                        <el-input v-model="ruleForm.name">
                            <template slot="append" v-if="dialogFormInfo.type==='add'">
                                <el-upload ref="upload" action="/api/teacher/course/file/add"
                                           :auto-upload="false" :show-file-list="false" :data="ruleForm"
                                           :on-change="chooseFile" :on-success="handleSuccess">
                                    <el-button type="primary">选取文件</el-button>
                                </el-upload>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="文件信息">
                        <el-col :span="11">
                            <el-form-item>
                                <el-input v-model="ruleForm.size" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="2">&nbsp;</el-col>
                        <el-col :span="11">
                            <el-form-item>
                                <el-input v-model="ruleForm.type" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
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
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')" v-if="dialogFormInfo.type==='add'">
                            立即添加
                        </el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')" v-if="dialogFormInfo.type==='update'">
                            立即更新
                        </el-button>
                        <el-button @click="resetForm('ruleForm')" v-if="dialogFormInfo.type==='add'">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <!--对话框 E-->
    </div>
</template>

<script>
    import {Message, MessageBox} from 'element-ui'

    export default {
        name: "FileManage",
        data() {
            return {
                isSearch: false,
                selectValue: 'name',
                searchContent: null,
                file: [],
                pageSum: 0,
                dialogFormVisible: false,
                dialogFormInfo: {
                    id: null,
                    title: null,
                    type: null
                },
                course: [],
                chapter: [],
                ruleForm: {
                    name: '',
                    size: '',
                    type: '',
                    course: '',
                    chapter: '',
                },
                rules: {
                    name: [
                        {required: true, message: '请输入文件名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    course: [
                        {required: true, message: '请选择课程', trigger: 'change'}
                    ],
                    chapter: [
                        {required: true, message: '请选择章节', trigger: 'change'}
                    ]
                },
                fileChoose: false
            }
        },
        methods: {
            /* 获取文件信息 */
            async getFile(page, type, content) {
                try {
                    let url = type === '' ?
                        `/api/teacher/course/file?page=${page}` :
                        `/api/teacher/course/file?page=${page}&type=${type}&content=${content}`;
                    let response = await this.$axios.get(url);
                    if (response.data.status === 1) {
                        this.file = response.data.file;
                        this.pageSum = response.data.count % 8 === 0 ?
                            Math.floor(response.data.count / 8) : Math.floor(response.data.count / 8) + 1;
                    } else console.log(response.data.msg);
                } catch (e) {
                    console.log(e);
                }
            },
            /* 页码改变 */
            pageChanged(val) {
                this.isSearch ?
                    this.getFile(val, this.selectValue, this.searchContent) :
                    this.getFile(val, '', null);
            },
            /* 搜索 */
            search() {
                if (this.searchContent === null || this.searchContent === '') Message.info('输入内容不能为空');
                else {
                    this.isSearch = true;
                    this.getFile(1, this.selectValue, this.searchContent);
                }
            },
            /* 提交表单 */
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (this.dialogFormInfo.type === 'add' && !this.fileChoose) Message.warning('请选择要上传的文件');
                    else if (valid) {
                        if (this.dialogFormInfo.type === 'add') this.$refs.upload.submit();
                        else {
                            let res = await this.$axios.post('/api/teacher/course/file/update', {
                                name: this.ruleForm.name, course: this.ruleForm.course,
                                chapter: this.ruleForm.chapter, id: this.dialogFormInfo.id
                            });
                            this.handleSuccess(res.data);
                        }
                        this.init();
                    } else return false;
                })
            },
            /* 初始化 */
            init() {
                this.ruleForm = {
                    name: '',
                    size: '',
                    type: '',
                    course: '',
                    chapter: '',
                };
                this.fileChoose = false;
                this.dialogFormInfo = {
                    id: null,
                    title: null,
                    type: null
                };
                this.course = [];
                this.chapter = [];
            },
            /* 添加文件 */
            async addFile() {
                this.init();
                this.dialogFormVisible = true;
                this.dialogFormInfo.title = "添加文件";
                this.dialogFormInfo.type = "add";
                try {
                    let res = await this.$axios.get('/api/teacher/course/teacher');
                    this.course = res.data.course;
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
            /* 选择文件 */
            chooseFile(file) {
                if (this.beforeCoverUpload(file.raw)) {
                    this.fileChoose = true;
                    this.ruleForm.name = file.name;
                    this.ruleForm.size = file.size > (1024 * 1024) ? `${(file.size / (1024 * 1024)).toFixed(2)}MB` :
                        `${(file.size / 1024).toFixed(2)}KB`;
                    this.ruleForm.type = this.mimeTypeToExtension(file.raw.type);
                }
            },
            /* 文件类型转化为后缀名 */
            mimeTypeToExtension(mimeType) {
                switch (mimeType) {
                    case 'image/jpeg':
                        return 'jpg';
                    case 'image/png':
                        return 'png';
                    case 'application/x-zip-compressed':
                        return 'zip';
                    case 'text/plain':
                        return 'txt';
                    case 'application/pdf':
                        return 'pdf';
                    case 'application/msword':
                        return 'doc';
                    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        return 'docx';
                    case 'application/vnd.ms-excel':
                        return 'xls';
                    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                        return 'xlsx';
                    case 'application/vnd.ms-powerpoint':
                        return 'ppt';
                    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                        return 'pptx';
                }
            },
            /* 文件检查 */
            beforeCoverUpload(file) {
                const isValid = (file.type === 'image/jpeg' || file.type === 'image/png' ||
                    file.type === 'application/x-zip-compressed' ||
                    file.type === 'text/plain' || file.type === 'application/pdf' ||
                    file.type === 'application/msword' || file.type === 'application/vnd.ms-excel' ||
                    file.type === 'application/vnd.ms-powerpoint' ||
                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
                const isLt100M = file.size / 1024 / 1024 < 100;
                if (!isValid) Message.error('仅支持.jpg .png .zip .txt .pdf .doc .docx .xls .xlsx .ppt .pptx格式的文件上传!');
                if (!isLt100M) Message.error('上传文件大小不能超过 100MB!');
                return isValid && isLt100M;
            },
            /* 添加/更改提交成功后执行 */
            handleSuccess(res) {
                if (res.status === 1) {
                    Message.success(res.msg);
                    this.dialogFormVisible = false;
                    this.getFile(1, '', null);
                    this.resetForm('ruleForm');
                } else {
                    Message.error(res.msg);
                }
            },
            /* 重置表单内容 */
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //从课程中删除成员
            deleteFile(val, force) {
                let msg = force ? '确定删除该文件（不可恢复）？' : '确定删除该文件（可恢复）？';
                MessageBox.confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await this.$axios.post('/api/teacher/course/file/delete', {
                        course: val['CourseChapter.CourseInformation.courseID'],
                        chapter: val['CourseChapter.chapterID'],
                        id: val['fileID'],
                        force
                    });
                    if (res.data.status === 1) {
                        Message.success(res.data.msg);
                        this.getFile(1, '', null);
                    } else Message.warning(res.data.msg);
                }).catch(() => {
                    Message.info('已取消操作')
                })
            },
            /* 更新文件信息 */
            async updateFile(val) {
                this.init();
                this.dialogFormVisible = true;
                this.dialogFormInfo.title = "更新文件";
                this.dialogFormInfo.type = "update";
                this.dialogFormInfo.id = val['fileID'];
                try {
                    let res = await this.$axios.get('/api/teacher/course/teacher');
                    this.course = res.data.course;
                    this.ruleForm.name = val['fileName'];
                    this.ruleForm.course = val['CourseChapter.CourseInformation.courseID'];
                    await this.getChapter(this.ruleForm.course);
                    this.ruleForm.chapter = val['CourseChapter.chapterID'];
                    this.ruleForm.type = val['fileType'];
                    this.ruleForm.size = val['fileSize'];
                } catch (e) {
                    console.log(e);
                }
            },
            /* 恢复文件 */
            async recoverFile(val) {
                MessageBox.confirm('确认恢复该文件吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(async () => {
                    let res = await this.$axios.post('/api/teacher/course/file/recover', {
                        course: val['CourseChapter.CourseInformation.courseID'],
                        chapter: val['CourseChapter.chapterID'],
                        id: val['fileID'],
                    });
                    if (res.data.status === 1) {
                        Message.success(res.data.msg);
                        this.getFile(1, '', null);
                    } else Message.warning(res.data.msg);
                }).catch(() => {
                    Message.info('已取消操作')
                })
            }
        },
        async created() {
            this.getFile(1, '', null);
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

    .card-list-item .content .blue {
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        color: #00a1d6;
    }

    .card-list-item .content .green {
        text-align: center;
        color: #67c23a;
    }

    .card-list-item .content .gold {
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
        margin-left: 5px;
        margin-right: 5px;
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

</style>

<style>
    .el-select .el-input {
        width: 130px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

    .el-dialog {
        min-width: 650px;
    }
</style>