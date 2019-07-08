<template>
    <div class="card-content">
        <div class="card-header">
            <div class="search-area">
                <el-input v-model="searchContent" placeholder="请输入视频名" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </div>
        </div>
        <div class="card-list">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="name" label="所属视频" width="220">
                </el-table-column>
                <el-table-column prop="course" label="所属课程" width="200"></el-table-column>
                <el-table-column prop="chapter" label="所属章节" width="200">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" v-if="scope.row.ware===null"
                                   @click="addWare(scope.row)">添加课件
                        </el-button>
                        <el-button size="mini" @click="changeWare(scope.row)"
                                   v-if="scope.row.ware!==null">更改课件
                        </el-button>
                        <el-button size="mini" type="danger" v-if="scope.row.ware!==null"
                                   @click="deleteWare(scope.row)">删除课件
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
            <div class="dialog-content">
                <el-upload class="upload-demo" drag :data="uploadData" :before-upload="beforeUpload"
                           action="/api/teacher/course/ware" :on-success="uploadSuccess" name="pdf">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传PDF文件，且不超过5MB</div>
                </el-upload>
            </div>
        </el-dialog>
        <!--对话框 E-->
    </div>
</template>

<script>
    import {Message, MessageBox, Loading} from 'element-ui'
    import Tcvod from 'vod-js-sdk-v6'

    export default {
        name: "PDFManage",
        data() {
            return {
                isSearch: false,
                selectValue: null,
                searchContent: null,
                pageSum: 0,
                dialogFormVisible: false,
                dialogFormInfo: {
                    title: null,
                    id: null
                },
                tableData: [],
                uploadData: {},
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
                                cseID: data[i]['CourseChapter.CourseInformation.courseID'],
                                ware: data[i]['wareUrl']
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
                this.isSearch ?
                    this.getVideo(val, this.searchContent) :
                    this.getChapter(val);
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
            /* 添加课件 */
            addWare(val) {
                this.dialogFormVisible = true;
                this.dialogFormInfo.title = "添加课件";
                this.uploadData = {videoID: val.id, courseID: val.cseID};
            },
            /* 更换课件 */
            changeWare(val) {
                this.dialogFormVisible = true;
                this.dialogFormInfo.title = "更换课件";
                this.uploadData = {videoID: val.id, courseID: val.cseID};
            },
            /* 删除课件 */
            deleteWare(val) {
                MessageBox.confirm('确定要删除该课件吗？(不可还原)', "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await this.$axios.post('/api/teacher/course/ware/delete', {
                        videoID: val.id, courseID: val.cseID
                    });
                    if (res.data.status === 1) {
                        Message.success(res.data.msg);
                        this.getVideo(1);
                    } else Message.error(res.data.msg);
                }).catch(() => {
                    Message.info("已取消删除操作");
                })
            },
            /* 文件上传以前检查 */
            beforeUpload(file) {
                const isPDF = file.type === 'application/pdf';
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isPDF) Message.error('仅支持.pdf格式的文件上传!');
                if (!isLt5M) Message.error('上传文件大小不能超过 5MB!');
                return isPDF && isLt5M;
            },
            /* 上传至服务器成功 */
            uploadSuccess(res) {
                if (res.status === 1) {
                    Message.success(res.msg);
                    this.dialogFormVisible = false;
                    this.getVideo(1);
                } else {
                    Message.error(res.msg);
                }
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
        min-width: 400px !important;
    }
</style>