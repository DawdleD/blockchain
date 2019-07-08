<template>
    <div class="card-content">
        <div class="card-header">
            <div class="add-button" @click="addChapter">添加章节</div>
            <div class="search-area">
                <el-input v-model="searchContent" placeholder="请输入章节名" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </div>
        </div>
        <div class="card-list">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="id" label="章节ID" width="180">
                </el-table-column>
                <el-table-column prop="name" label="章节名" width="230">
                </el-table-column>
                <el-table-column prop="course" label="所属课程" width="230"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" v-if="!scope.row.delete"
                                   @click="updateChapter(scope.row.id,scope.row.name,scope.row.cid)">编辑
                        </el-button>
                        <el-button size="mini" type="danger" v-if="!scope.row.delete"
                                   @click="deleteChapter(scope.row.cid,scope.row.id)">删除
                        </el-button>
                        <el-button size="mini" type="success" v-if="scope.row.delete"
                                   @click="recoverChapter(scope.row.cid,scope.row.id)">还原
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
        <el-dialog :show-close="false" top="20vh" width="20%" :visible.asnc="dialogFormVisible">
            <!--对话框标题 S-->
            <div slot="title" class="dialog-title">
                {{dialogFormInfo.title}}
                <button class="close" @click="dialogFormVisible = false">×</button>
            </div>
            <!--对话框标题 E-->
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="章节名">
                    <el-input v-model="formInline.chapter" placeholder="章节名"></el-input>
                </el-form-item>
                <el-form-item label="选择课程">
                    <el-select v-model="formInline.course" placeholder="选择课程" value="">
                        <el-option v-for="cos in course" :key="cos.courseID"
                                   :label="cos.courseName" :value="cos.courseID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addChapterSubmit"
                               v-if="dialogFormInfo.type === 'add'">添加
                    </el-button>
                    <el-button type="primary" @click="updateChapterSubmit"
                               v-if="dialogFormInfo.type === 'update'">更新
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--对话框 E-->
    </div>
</template>

<script>
    import {Message, MessageBox} from 'element-ui'

    export default {
        name: "ChapterManage",
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
                formInline: {
                    chapter: '',
                    course: ''
                },
                course: [],
                tableData: []
            }
        },
        methods: {
            /* 获取章节信息 */
            async getChapter(page, search) {
                try {
                    this.tableData = [];
                    let url = search === '' ?
                        `/api/teacher/course/chapter?page=${page}` :
                        `/api/teacher/course/chapter?page=${page}&search=${search}`;
                    let response = await this.$axios.get(url);
                    if (response.data.status === 1) {
                        let data = response.data.chapter;
                        this.pageSum = response.data.count % 8 === 0 ?
                            Math.floor(response.data.count / 8) : Math.floor(response.data.count / 8) + 1;
                        for (let i = 0; i < data.length; i++) {
                            this.tableData.push({
                                id: data[i]['chapterID'],
                                name: data[i]['chapterName'],
                                course: data[i]['CourseInformation.courseName'],
                                cid: data[i]['CourseInformation.courseID'],
                                delete: data[i]['deletedAt']
                            })
                        }
                    } else console.log(response.data.msg);
                } catch (e) {
                    console.log(e);
                }
            },
            /* 页码改变 */
            pageChanged(val) {
                this.isSearch ?
                    this.getChapter(val, this.searchContent) :
                    this.getChapter(val, '');
            },
            /* 搜索 */
            search() {
                if (this.searchContent === null || this.searchContent === '') Message.info('输入内容不能为空');
                else {
                    this.isSearch = true;
                    this.tableData = [];
                    this.getChapter(1, this.searchContent);
                }
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
            /* 添加章节 */
            addChapter() {
                this.getCourse();
                this.dialogFormVisible = true;
                this.dialogFormInfo.title = "添加章节";
                this.dialogFormInfo.type = "add";
            },
            /* 检查输入 */
            checkInput() {
                if (this.formInline.chapter === '') {
                    Message.warning('请输入学员账号');
                    return false;
                } else if (this.formInline.chapter.length > 30) {
                    Message.warning('章节名应小于30个字符');
                    return false;
                } else if (this.formInline.course === '') {
                    Message.warning('请选择课程');
                    return false;
                } else return true;
            },
            /* 添加章节提交 */
            async addChapterSubmit() {
                if (this.checkInput()) {
                    try {
                        let res = await this.$axios.post('/api/teacher/course/chapter/add', {
                            courseID: this.formInline.course, name: this.formInline.chapter
                        });
                        if (res.data.status === 1) {
                            Message.success(res.data.msg);
                            this.getChapter(1, '');
                            this.formInline.course = '';
                            this.formInline.chapter = '';
                            this.dialogFormVisible = false;
                        } else Message.warning(res.data.msg);
                    } catch (e) {
                        console.log(e);
                        Message.error(e);
                    }
                }
            },
            /* 更新章节 */
            updateChapter(chapterID, chapterName, courseID) {
                this.getCourse();
                this.formInline.chapter = chapterName;
                this.formInline.course = courseID;
                this.dialogFormInfo.title = "编辑章节";
                this.dialogFormInfo.type = "update";
                this.dialogFormInfo.id = chapterID;
                this.dialogFormVisible = true;
            },
            /* 更新章节提交 */
            async updateChapterSubmit() {
                if (this.checkInput()) {
                    try {
                        let res = await this.$axios.post('/api/teacher/course/chapter/update', {
                            courseID: this.formInline.course, name: this.formInline.chapter,
                            chapterID: this.dialogFormInfo.id
                        });
                        if (res.data.status === 1) {
                            Message.success(res.data.msg);
                            this.getChapter(1, '');
                            this.formInline.course = '';
                            this.formInline.chapter = '';
                            this.dialogFormVisible = false;
                        } else Message.warning(res.data.msg);
                    } catch (e) {
                        console.log(e);
                        Message.error(e);
                    }
                }
            },
            /* 删除章节 */
            deleteChapter(courseID, chapterID) {
                MessageBox.confirm('确定从该课程中删除该章节？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await this.$axios.post('/api/teacher/course/chapter/delete', {courseID, chapterID});
                    if (res.data.status === 1) {
                        Message.success(res.data.msg);
                        this.getChapter(1, '');
                    } else Message.warning(res.data.msg);
                }).catch(() => {
                    Message.info('已取消操作')
                })
            },
            /* 还原章节 */
            async recoverChapter(courseID, chapterID) {
                let res = await this.$axios.post('/api/teacher/course/chapter/recover', {courseID, chapterID});
                if (res.data.status === 1) {
                    Message.success(res.data.msg);
                    this.getChapter(1, '');
                } else Message.warning(res.data.msg);
            }
        },
        async created() {
            this.getChapter(1, '');
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

    .cover-uploader-icon {
        font-size: 20px;
        color: #8c939d;
        height: 50px;
        width: 90px;
        border: 1px solid #ddd;
        line-height: 50px;
    }

    .cover-uploader-icon i {
        vertical-align: middle;
        margin-bottom: 5px;
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