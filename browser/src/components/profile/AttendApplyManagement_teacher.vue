<template>
    <div class="my-course-list">
        <!--课程列表顶部信息 S-->
        <template>
                <div class="my-course-list-header">
                <div class="my-course-row">
                    <div class="my-course-cell first">项目</div>
                    <div class="my-course-cell">申请人信息</div>
                    <div class="my-course-cell">申请状态</div>
                    <div class="my-course-cell">操作</div>
                </div>
            </div>
            <!--课程列表顶部信息 E-->
            <!--课程列表 S-->
            <!--课程不存在 S-->
            <div class="my-course-list-no-data" v-if="applyRecords.length===0">
                <div class="status-box">
                    <div class="box-icon">
                        <span class="fas fa-info-circle"></span>
                    </div>
                    <div class="box-text">
                        <div>暂无申请信息</div>
                    </div>
                </div>
            </div>
            <!--课程不存在 E-->
            <!--课程存在 S-->
            <div class="my-course-list-item" v-else v-for="apply in applyRecords" :key="apply['applyID']">

                <div class="my-course-row content">
                    <div class="my-course-cell first cover">
                        <!-- 注意ApplyInProject -->
                        <router-link :to="`/project/${apply.ApplyInProject['projectID']}/information`">
                            <img src="../../assets/image/project-hot.png" alt="">
                            <div class="title">{{apply.ApplyInProject['projectName']}}</div>
                        </router-link>
                    </div>
                    <div class="my-course-cell state">{{apply.ApplyerInfo['nickName']}}</div>
                    <div class="my-course-cell state">{{myTotalOption.labelProjectApplyStatue[apply.applyStatue]}}</div>
                    <div class="my-course-cell operating">
                        <a :class="[apply.applyStatue!='WAITING'?'btn-operate-disabled':'btn-operate']" 
                            @click="agreeApply(apply['applyID'])">
                            同意请求
                        </a>
                        <a :class="[apply.applyStatue!='WAITING'?'btn-operate-disabled':'btn-operate']"
                            @click="rejectApply(apply['applyID'])">
                            拒绝请求
                        </a>
                    </div>
                </div>
            </div>
            <!--课程存在 E-->
            <!--课程列表 E-->
            <!--分页 S-->
            <div class="course-sort-page" v-if="applyRecords.length>0">
                <el-pagination background layout="prev, pager, next"
                            :pager-count="10" @current-change="applyPageChanged"
                            :total="10*applyCount">
                </el-pagination>
            </div>    
        </template>        

    <information-dialog @dialogClose="handleDialogClose" :infoArr="infoArr" :infoTableWidth="infoTableWidth" :infoDialogVisible="infoDialogVisible" :infoTable="infoTable"></information-dialog>
    </div>

</template>

<script>
    import InformationDialog from '../common/InformationDialog'
    import {Message, MessageBox,ElTabs} from 'element-ui'
    import {
        TotalOption,
    } from '../../utils/constant/options'; 

    export default {
        name: "Project",
        data() {
            return {
                projectCount: 1,
                applyCount:1,
                activeName:'first',
                projects: [],
                applyRecords:[],

                myTotalOption:[],
                scoreForm:{
                    projectID:"",
                    memberList:[],
                },                
                scoreFormVisible:false,

                infoDialogVisible:false,
                infoArr:[{title:'defualt',value:'default'}],
                infoTableWidth:0,
                infoTable:[],
            }
        },
        methods: {
            handleDialogClose(){
                this.infoDialogVisible=false;
            },                 


            //获取参加请求信息
            async getAttendApply(page) {
                try {
                    let response = await this.$axios.get(`/api/project/query/getApplyRecord?page=${page}`);
                    let responseCount=await this.$axios.post(`/api/project/query/getApplyRecordCount`);
                    if (response.data.status === 0) Message.info(response.data.msg);
                    else {
                        this.projectCount = responseCount.data.count % 10 === 0 ?
                            Math.floor(responseCount.data.count / 10) : Math.floor(responseCount.data.count / 10) + 1;
                        this.applyRecords = response.data.sqlres;
                    }
                } catch (e) {
                    console.log(e);
                }
            },            

            //打开互评栏
            async openDialog(projectID) {
                try {
                    let res=await this.$axios.get('/api/project/query/getProjectMember',{
                        params:{'projectID':projectID}
                    })
                    res=res.data
                    if(res.status==0) throw "Query Failed!"
                    this.scoreForm.memberList=[];
                    var ind=0;
                    for(var index in res.sqlres){
                        // console.log(item)
                        var item=res.sqlres[index];
                        if(item.memberType==1){
                            ;
                        }else{
                            item.userID=item.memberID
                            item.memberDesignScore=0
                            item.memberCodeScore=0
                            item.memberAttitudeScore=0
                            item.memberScore=0
                            this.scoreForm.memberList.push(
                                item
                            );
                        }
                    }
                    console.log(this.scoreForm.memberList)
                    this.scoreForm.projectID=projectID;
                    this.scoreFormVisible=true;
                } catch (error) {
                    this.scoreFormVisible=false;
                    console.log(error);
                }          
            },
            // 提交得分
            submitScore: async function(){
                try {
                    for(var index in this.scoreForm.memberList){
                        this.scoreForm.memberList[index].designScore=this.scoreForm.memberList[index].memberDesignScore
                        this.scoreForm.memberList[index].codeScore=this.scoreForm.memberList[index].memberCodeScore
                        this.scoreForm.memberList[index].attitudeScore=this.scoreForm.memberList[index].memberAttitudeScore
                    }
                    console.log(this.scoreForm.projectID)
                    console.log(this.scoreForm.memberList)
                    let res=await this.$axios.post('/api/project/projectmanagement/submitScore',{'projectID':this.scoreForm.projectID,
                        'memberList':this.scoreForm.memberList})
                    if(res.data.status==0){
                        throw "Failed"
                    }
                    this.scoreFormVisible=false;
                    Message.success("操作成功");    
                } catch (error) {
                    Message.error("操作失败，非法操作/数据或你已经完成评分!");  
                    this.scoreFormVisible=false;
                    console.log(error);
                }           
            },        

            //同意请求
            async agreeApply(applyID){
                MessageBox.confirm('确定同意该报名申请？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        let response = await this.$axios.get(`/api/project/ApplyRecord/agreeApply`,{
                            params:{applyID}
                        });
                        if (response.data.status != 1) Message.info('操作失败!');
                        else if (response.data.status === 1) {
                            Message.success('操作成功');
                            this.getAttendApply(1);
                        } ;                       
                    } catch (error) {
                        Message.error("操作失败!");
                    }

                }).catch(() => {
                    Message.info("已取消操作");
                })                
            },
            //同意请求
            async rejectApply(applyID){
                MessageBox.confirm('确定拒绝该报名申请？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        let response = await this.$axios.get(`/api/project/ApplyRecord/rejectApply`,{
                            params:{applyID}
                        });
                        if (response.data.status != 1) Message.info('操作失败!');
                        else if (response.data.status === 1) {
                            Message.success('操作成功!');
                            this.getAttendApply(1);
                        } ;                       
                    } catch (error) {
                        Message.error("操作失败!");
                    }

                }).catch(() => {
                    Message.info("已取消操作");
                })                
            },            
            //页码改变

            // 页码改变（项目参加申请）
            applyPageChanged(val) {
                this.getAttendApply(val);
            },           
        },
        components: {            
            "information-dialog":InformationDialog,
        },        
        created() {
            this.myTotalOption=TotalOption;
            this.getAttendApply(1);
        }
    }
</script>

<style scoped>
    .my-course-list {
        box-sizing: border-box;
        font-size: 14px;
        color: #333;
    }
    .my-course-list-header {
        line-height: 42px;
        margin-top: 20px;
        border: 1px solid #ddd;
    }
    .my-course-list-no-data {
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
    .box-icon span {
        font-size: 36px;
        color: #409eff;
    }
    .status-box .box-text {
        font-size: 18px;
        line-height: 36px;
        display: table-cell;
        vertical-align: middle;
    }
    .my-course-row {
        width: 100%;
        display: flex;
        align-items: center;
    }
    .my-course-cell {
        position: relative;
        display: flex;
        width: 128px;
        -webkit-box-pack: center;
        justify-content: center;
    }
    .my-course-list .first {
        -webkit-box-flex: 1;
        flex-grow: 1;
        padding: 0 20px;
        -webkit-box-pack: start;
        justify-content: flex-start;
    }
    .my-course-list-item {
        border: 1px solid #ddd;
        margin-top: 21px;
    }
    .my-course-list-item .head {
        line-height: 43px;
        border-bottom: 0;
        background-color: #f8f8f8;
    }
    .my-course-list-item .head .time {
        padding-left: 20px;
    }
    .my-course-list-item .content {
        -webkit-box-align: stretch;
        align-items: stretch;
    }
    .my-course-list-item .content .my-course-cell {
        padding-top: 20px;
        padding-bottom: 20px;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
    }
    .my-course-list-item .content .cover a {
        display: flex;
        position: relative;
        text-decoration: none;
    }
    .my-course-list-item .content .cover a img {
        margin-right: 20px;
        position: relative;
        z-index: 1;
        width: 90px;
        height: 50px;
        border: 0;
        vertical-align: middle;
        max-width: 100%;
    }
    .my-course-list-item .content .title {
        line-height: 20px;
        color: #000;
    }
    .my-course-list-item .content .price {
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        color: #000;
    }
    .my-course-list-item .content .state {
        text-align: center;
    }
    .my-course-list-item .content .operating {
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .my-course-list-item .content .operating a {
        display: block;
        color: #000;
    }
    .my-course-list-item .content .operating .btn-operate {
        margin-bottom: 8px;
    }
    .my-course-list-item .content .operating .btn-operate-disabled {
        margin-bottom: 8px;
        pointer-events: none;
        color:darkgrey;
    }            
    .course-sort-page {
        margin-top: 30px;
        text-align: center;
    }
    .dialog-title {
        padding-bottom: 5px;
        color: #333;
        font-size: 18px;
        width: 100%;
    }
    .verbose-rating {
        margin: 0;
        padding: 0;
        outline: none;
        text-align: left;
    }
    .rating-text-area {
        margin-top: 20px;
        text-align: left;
    }
    .label-rate {
        margin-bottom: 9px;
        line-height: 19px;
        font-size: 14px;
        color: #151515;
    }
    .text-area-remain {
        margin-top: -30px;
        position: absolute;
        right: 35px;
        color: #999;
    }
    .rating-text-area textarea {
        width: 100%;
        height: 300px;
        margin-bottom: 5px;
        padding: 10px 15px;
        box-sizing: border-box;
        line-height: 24px;
        font-size: 14px;
        color: #333;
        border: 1px solid #e6e6e6;
    }
    .tip-error {
        color: #F56C6C;
    }
    .dialog-footer {
        margin-top: 25px;
        padding: 0;
    }
    .dialog-button {
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        height: 34px;
        line-height: 34px;
        border-radius: 3px;
        cursor: pointer;
    }
    .dialog-button-submit {
        margin-right: 14px;
        width: 120px;
        color: white;
        background-color: #409ef0;
        border: 1px solid #409ef0;
    }
    .dialog-button-cancer {
        width: 80px;
        color: #409ef0;
        border: 1px solid #409ef0;
    }
    .dialog-button-cancer:hover {
        color: white;
        background-color: #409ef0;
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