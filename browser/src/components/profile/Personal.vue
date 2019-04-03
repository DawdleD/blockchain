<template>
    <div class="main">
        <table>
            <tbody class="base">
            <tr>
                <!--https://jsonplaceholder.typicode.com/posts/-->
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
                <td v-if="informationForm.phone === ''">
                    <a class="btn btn-normal">点击绑定</a>
                </td>
                <td v-else>
                    <div class="set-up">
                        <div>{{informationForm.email}}</div>
                        <i class="fas fa-check"></i>
                        <span>已验证</span>
                        <a class="change-bind">更换绑定的邮箱</a>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="setting-title">手机</td>
                <td v-if="informationForm.phone === ''">
                    <a class="btn btn-normal">点击绑定</a>
                </td>
                <td v-else>
                    <div class="set-up">
                        <div>{{informationForm.phone}}</div>
                        <i class="fas fa-check"></i>
                        <span>已验证</span>
                        <a class="change-bind">更换绑定的手机号</a>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <label>
            <input class="btn setting-save" value="保存" @click="saveInformation"></input>
        </label>
    </div>
</template>

<script>
    import {Message} from 'element-ui'

    export default {
        name: "Personal",
        data() {
            return {
                imageUrl: '',
                informationForm: {
                    birthday: '', sex: 'S', nickname: '', realName: '', phone: '', email: ''
                },
                informationValidate: {
                    nickname: false, realName: false
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
                    this.informationForm.phone = data.phone;
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
            handleAvatarSuccess(res, file) {
                if (res.status === 1) {
                    this.imageUrl = URL.createObjectURL(file.raw);
                    Message.success('更换头像成功');
                } else
                    Message.error(res.message);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) Message.error('上传头像图片只能是 JPG 格式!');
                if (!isLt2M) Message.error('上传头像图片大小不能超过 2MB!');
                return isJPG && isLt2M;
            },
            saveInformation() {
                this.$axios.post('/api/profile/personal/update', {
                    data: this.informationForm
                }).then((response) => {
                    if (response.data.status === 1)
                        Message.success(response.data.message);
                    else
                        Message.error(response.data.message);
                }).catch((error) => {
                    Message.error(error);
                })
            }
        }
    }
</script>

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
</style>
