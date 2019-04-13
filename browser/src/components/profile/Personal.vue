<template>
    <div class="main">
        <table>
            <tbody class="base">
            <tr>
                <td class="top-line">
                    <el-upload
                            class="avatar"
                            enctype="multipart/form-data"
                            name="avatar"
                            action="/api/profile/personal/avatar"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" alt="">
                        <div v-else class="avatar-uploader-icon"><i class="fas fa-plus"></i></div>
                    </el-upload>
                </td>
                <td class="top-line">
                    <el-upload
                            action="/api/profile/personal/avatar"
                            name="avatar"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :show-file-list="false">
                        <a class="btn btn-normal">更换头像</a>
                    </el-upload>
                </td>
            </tr>
            <tr>
                <td class="setting-title">昵称</td>
                <td>
                    <label>
                        <input type="text" placeholder="请输入昵称"
                               v-model="informationForm.nickname"
                               @keyup="informationValidate.nickname = informationForm.nickname.length>15">
                        </input>
                    </label>
                    <span class="input-error" v-if="informationValidate.nickname">昵称长度超过限制</span>
                </td>
            </tr>
            <tr>
                <td class="setting-title">姓名</td>
                <td>
                    <label>
                        <input type="text" placeholder="您的真实姓名"
                               v-model="informationForm.realName"
                               @keyup="informationValidate.realName = informationForm.realName.length > 15">
                        </input>
                    </label>
                    <span class="input-error" v-if="informationValidate.realName">姓名长度超过限制</span>
                </td>
            </tr>
            <tr>
                <td class="setting-title">性别</td>
                <td>
                    <label class="label-radio">
                        <input type="radio" name="sex" value="S" checked="checked"
                               v-model="informationForm.sex"></input>
                        <span>保密</span>
                    </label>
                    <label class="label-radio">
                        <input type="radio" name="sex" value="M" v-model="informationForm.sex"></input>
                        <span>男</span>
                    </label>
                    <label class="label-radio">
                        <input type="radio" name="sex" value="F" v-model="informationForm.sex"></input>
                        <span>女</span>
                    </label>
                </td>
            </tr>
            <tr>
                <td class="setting-title">生日</td>
                <td>
                    <el-date-picker v-model="informationForm.birthday" size="small" type="date"
                                    placeholder="选择日期"></el-date-picker>
                </td>
            </tr>
            <tr>
                <td class="setting-title">邮箱</td>
                <td v-if="informationForm.email === ''">
                    <a class="btn btn-normal" @click="openDialog('email')">点击绑定</a>
                </td>
                <td v-else>
                    <div class="set-up">
                        <div>{{informationForm.email}}</div>
                        <i class="fas fa-check"></i>
                        <span>已验证</span>
                        <a class="change-bind" @click="deleteEmail">解除绑定</a>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="setting-title">手机</td>
                <td v-if="informationForm.mobile === ''">
                    <router-link class="btn btn-normal" to="/passport/register">点击绑定</router-link>
                </td>
                <td v-else>
                    <div class="set-up">
                        <div>{{informationForm.mobile}}</div>
                        <i class="fas fa-check"></i>
                        <span>已验证</span>
                        <a class="change-bind" @click="openDialog('mobile')">更换绑定的手机号</a>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <input class="btn setting-save" value="保存" @click="saveInformation" type="button"></input>
        <!--对话框 S-->
        <el-dialog :show-close="false" :visible.asnc="dialogFormVisible" top="20vh">
            <!--对话框标题 S-->
            <div slot="title" class="dialog-title">
                {{dialogFormInfo.title}}
                <button class="close" @click="dialogFormVisible = false">×</button>
            </div>
            <!--对话框标题 E-->
            <!--绑定邮箱 S-->
            <form v-if="dialogFormInfo.bindEmail.show">
                <div class="input-area">
                    <label class="first">
                        <input type="text" placeholder="邮箱" @keyup="verifyDialogInput('bindEmail')"
                               v-model="dialogForm.account">
                        </input>
                        <i class="fas fa-envelope"></i>
                        <i v-if="dialogFormInfo.bindEmail.success" class="check fas fa-check-circle"
                           style="color: #67c23a"></i>
                        <i v-if="dialogFormInfo.bindEmail.error" class="check fas fa-times-circle"
                           style="color: red"></i>
                    </label>
                </div>
                <div class="input-area">
                    <label class="second">
                        <input v-model="dialogForm.verifyCode" type="text" placeholder="验证码"></input>
                        <i class="fas fa-shield-alt"></i>
                        <a :class="{'btn-send':true,disable:!dialogFormInfo.bindEmail.sendButton}"
                           @click="sendVerifyCode('bindEmail')"
                        >{{dialogFormInfo.sendButtonText}}</a>
                    </label>
                </div>
            </form>
            <!--绑定邮箱 E-->
            <!--更换手机号 S-->
            <el-steps :active="stepsActive" finish-status="success" align-center
                      v-if="dialogFormInfo.changeMobile.show">
                <el-step title="安全验证"></el-step>
                <el-step title="修改手机"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <form v-if="dialogFormInfo.oldMobile.show || dialogFormInfo.newMobile.show">
                <div class="input-area">
                    <label class="first" v-if="dialogFormInfo.oldMobile.show">
                        <input type="text" placeholder="原手机号" @keyup="verifyDialogInput('oldMobile')"
                               v-model="dialogForm.account"></input>
                        <i class="fas fa-mobile-alt"></i>
                        <i v-if="dialogFormInfo.oldMobile.success" class="check fas fa-check-circle"
                           style="color: #67c23a"></i>
                        <i v-if="dialogFormInfo.oldMobile.error" class="check fas fa-times-circle"
                           style="color: red"></i>
                    </label>
                    <label class="first" v-if="dialogFormInfo.newMobile.show">
                        <input type="text" placeholder="新手机号" @keyup="verifyDialogInput('newMobile')"
                               v-model="dialogForm.account"></input>
                        <i class="fas fa-mobile-alt"></i>
                        <i v-if="dialogFormInfo.newMobile.success" class="check fas fa-check-circle"
                           style="color: #67c23a"></i>
                        <i v-if="dialogFormInfo.newMobile.error" class="check fas fa-times-circle"
                           style="color: red"></i>
                    </label>
                </div>
                <div class="input-area">
                    <label class="second">
                        <input v-model="dialogForm.verifyCode" type="text" placeholder="验证码"></input>
                        <i class="fas fa-shield-alt"></i>
                        <a :class="{'btn-send':true,disable:!dialogFormInfo.changeMobile.sendButton}"
                           @click="sendVerifyCode('changeMobile')"
                        >{{dialogFormInfo.sendButtonText}}</a>
                    </label>
                </div>
            </form>
            <!--更换手机号 E-->
            <!--对话框底部 S-->
            <div v-if="dialogFormInfo.bindEmail.show" slot="footer" class="dialog-footer">
                <a class="btn btn-confirm" @click="bindEmailSubmit">确定</a>
            </div>
            <div v-if="dialogFormInfo.changeMobile.show" slot="footer" class="dialog-footer">
                <a class="btn btn-confirm" @click="changeMobileSubmit">下一步</a>
            </div>
            <!--对话框底部 E-->
        </el-dialog>
        <!--对话框 E-->
    </div>
</template>

<script>
    import {Message, MessageBox} from 'element-ui'

    export default {
        name: "Personal",
        data() {
            return {
                imageUrl: '',
                informationForm: {
                    birthday: '', sex: 'S', nickname: '', realName: '', mobile: '', email: ''
                },
                informationValidate: {
                    nickname: false, realName: false
                },
                dialogFormVisible: false,
                stepsActive: 0,
                dialogFormInfo: {
                    bindEmail: {show: false, success: false, error: false, sendButton: false},
                    changeMobile: {show: false, sendButton: false},
                    oldMobile: {show: false, success: false, error: false},
                    newMobile: {show: false, success: false, error: false},
                    title: '',
                    sendButtonText: '发送验证码',
                },
                dialogForm: {
                    account: '',
                    verifyCode: ''
                }
            }
        },
        created() {
            this.$axios.get('/api/profile/personal').then((response) => {
                if (response.data.status === 1) {
                    let data = response.data.message;
                    this.informationForm.nickname = data.nickname;
                    this.informationForm.realName = data.realName;
                    this.informationForm.sex = data.sex;
                    this.informationForm.mobile = data.mobile;
                    this.informationForm.birthday = data.birthday === null ? '' : data.birthday;
                    this.informationForm.email = data.email === null ? '' : data.email;
                    this.imageUrl = data.avatarUrl === null ? '' : `http://localhost:3000${data.avatarUrl}`;
                }
            }).catch((error) => {
                console.log(error);
                Message.error(error);
            })
        },
        methods: {
            /* 更改头像成功后执行 */
            handleAvatarSuccess(res, file) {
                if (res.status === 1) {
                    this.imageUrl = URL.createObjectURL(file.raw);
                    this.$store.commit('changeAvatarUrl',
                        `http://localhost:3000${res.avatarUrl}`);
                    Message.success('更换头像成功');
                } else
                    Message.error(res.message);
            },
            /* 在提交头像之前检查 */
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) Message.error('上传头像图片只能是 JPG 格式!');
                if (!isLt2M) Message.error('上传头像图片大小不能超过 2MB!');
                return isJPG && isLt2M;
            },
            /* 删除邮箱 */
            deleteEmail() {
                MessageBox.confirm('确定要解绑邮箱吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.get('/api/profile/personal/delete-email').then((response) => {
                        if (response.data.status === 1) {
                            this.informationForm.email = '';
                            Message.success(response.data.message);
                        } else {
                            Message.error(response.data.message);
                        }
                    })
                }).catch(() => {
                    Message.info("已取消操作");
                })
            },
            /* 打开对话框 */
            openDialog(option) {
                this.dialogFormVisible = true;
                this.dialogForm.account = '';
                this.dialogForm.verifyCode = '';
                if (option === 'email') {
                    this.dialogFormInfo.title = '绑定邮箱';
                    this.dialogFormInfo.bindEmail = {
                        show: true, success: false, error: false, sendButton: false
                    };
                    this.dialogFormInfo.changeMobile.show = false;
                } else if (option === 'mobile') {
                    this.dialogFormInfo.title = '更换手机号';
                    this.dialogFormInfo.bindEmail.show = false;
                    this.dialogFormInfo.changeMobile.show = true;
                    this.dialogFormInfo.oldMobile.show = this.stepsActive === 0;
                }
            },
            /* 验证邮箱/手机号是否合法 */
            verifyDialogInput(option) {
                const regMail = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                const regMobile = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
                let pass = option === 'bindEmail' ? this.dialogForm.account.match(regMail) : this.dialogForm.account.match(regMobile);
                if (option === 'bindEmail') this.dialogFormInfo.bindEmail.sendButton = pass;
                else this.dialogFormInfo.changeMobile.sendButton = pass;
                this.dialogFormInfo[option].success = pass;
                this.dialogFormInfo[option].error = !pass;
            },
            /* 发送验证码 */
            sendVerifyCode: async function (option) {
                this.dialogFormInfo[option].sendButton = false;
                let times = 60;   //按钮点击间隔
                let self = this;
                let timer = await setInterval(function () {
                    self.dialogFormInfo.sendButtonText = "重新发送(" + times + "s)";
                    times--;
                    if (times < 0) window.clearInterval(timer);
                }, 1000);
                setTimeout(function () {
                    self.dialogFormInfo.sendButtonText = "发送验证码";
                    self.dialogFormInfo[option].sendButton = true;
                }, 61000);
                let url = (this.dialogFormInfo.changeMobile.show) ? "/api/sms" : "/api/email-send";
                this.$axios.post(url, {
                    account: this.dialogForm.account,
                    option: "change"
                }).then((response) => {
                    if (response.data.status === 1) Message.success(response.data.message);
                    else Message.error(response.data.message);
                }).catch((error) => {
                    console.log(error);
                })
            },
            /* 绑定邮箱 */
            bindEmailSubmit() {
                if (this.dialogForm.account === '') Message.error('请输入邮箱');
                else if (this.dialogForm.verifyCode === '') Message.error('请输入验证码');
                else this.$axios.post('/api/profile/personal/add-email', {
                        data: this.dialogForm
                    }).then((response) => {
                        if (response.data.status === 1) {
                            this.dialogForm.account = '';
                            this.dialogForm.verifyCode = '';
                            this.informationForm.email = response.data.email;
                            Message.success(response.data.message);
                            this.dialogFormVisible = false;
                        } else Message.error(response.data.message);
                    }).catch((err) => {
                        console.log(err);
                    });
            },
            /* 更换手机号 */
            changeMobileSubmit() {
                if (this.stepsActive > 2) {
                    this.stepsActive = 0;
                    this.dialogFormVisible = false;
                } else if (this.stepsActive === 2) {
                    this.stepsActive += 1;
                    Message.success('已更改绑定手机号');
                } else if (this.dialogForm.account === '') Message.error('请输入手机号');
                else if (this.dialogForm.verifyCode === '') Message.error('请输入验证码');
                else {
                    this.$axios.post('/api/profile/personal/change-mobile', {
                        data: this.dialogForm,
                        step: this.stepsActive
                    }).then((response) => {
                        if (response.data.status === 1) {
                            if (this.stepsActive === 0) {
                                this.dialogForm.account = '';
                                this.dialogForm.verifyCode = '';
                                this.dialogFormInfo.changeMobile.sendButton = true;
                                this.dialogFormInfo.oldMobile.show = false;
                                this.dialogFormInfo.newMobile.show = true;
                            } else if (this.stepsActive === 1) {
                                this.dialogFormInfo.oldMobile.show = false;
                                this.dialogFormInfo.newMobile.show = false;
                                this.informationForm.mobile = response.data.message;
                                this.stepsActive += 1;
                            }
                            this.stepsActive += 1;
                        } else Message.error(response.data.message);
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            },
            /* 页面提交更改 */
            saveInformation() {
                this.$axios.post('/api/profile/personal/update', {
                    data: this.informationForm
                }).then((response) => {
                    if (response.data.status === 1) {
                        this.$store.commit('changeNickname', this.informationForm.nickname);
                        Message.success(response.data.message);

                    } else
                        Message.error(response.data.message);
                }).catch((error) => {
                    Message.error(error);
                })
            }
        },
    }
</script>
<!--本页面用src导入方式防止全局引用-->
<style src="../../assets/css/profile.css" scoped></style>
<style scoped>
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        height: 100px;
        width: 100px;
        border: 1px solid #ddd;
        border-radius: 50%;
        line-height: 100px;
    }

    .avatar-uploader-icon i {
        vertical-align: middle;
        margin-bottom: 5px;
    }

    .dialog-title {
        padding-bottom: 5px;
        color: #333;
        font-size: 18px;
        width: 100%;
    }

    .dialog-footer {
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

    .input-area {
        position: relative;
        width: 100%;
    }

    .input-area input {
        width: 100%;
        height: 50px;
        line-height: 50px;
        margin-bottom: 0;
        background-color: hsla(0, 0%, 71%, 0.1);
        vertical-align: middle;
        padding: 4px 12px 4px 35px !important;
        border-radius: 0;
    }

    .input-area .second input {
        border-top: 0;
    }

    .input-area i {
        position: absolute;
        top: 14px;
        left: 10px;
        font-size: 18px;
        color: #969696;
    }

    .input-area .first .check {
        position: absolute;
        left: auto;
        right: 18px;
    }

    .input-area .second .btn-send {
        position: absolute;
        top: 7px;
        right: 7px;
        width: 100px;
        height: 36px;
        font-size: 13px;
        text-align: center;
        color: #fff;
        background-color: #409eff;
        border-radius: 20px;
        line-height: 36px;
        cursor: pointer;
    }

    .disable {
        opacity: .5;
        pointer-events: none;
    }

    .btn-confirm {
        width: 100%;
        text-align: center;
        color: #fff;
        background-color: #409eff;
        cursor: pointer;
        border-radius: 20px;
    }


</style>
<!--用来修改Element-UI样式-->
<style>
    .el-date-editor {
        border-radius: 4px;
    }

    .el-date-editor input {
        background-color: hsla(0, 0%, 71%, .1);
        color: #000;
    }

    .el-dialog {
        width: 420px;
        border-radius: 6px;
    }

    .el-dialog__header {
        border-bottom: 1px solid #e5e5e5;
    }

    .el-dialog__body {
        padding: 30px 20px 0 20px;
    }

    .el-dialog__footer {
        padding: 15px;
    }
</style>
