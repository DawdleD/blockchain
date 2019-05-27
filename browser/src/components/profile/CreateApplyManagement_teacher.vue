<template>
    <div class="my-course-list">
        <!--课程列表顶部信息 S-->
        <template>
                <div class="my-course-list-header">
                <div class="my-course-row">
                    <div class="my-course-cell first">
                        <el-button @click="openCreateForm()">发起项目申请</el-button>
                    </div>
                </div>                    
                <div class="my-course-row">
                    <div class="my-course-cell first">项目名</div>
                    <div class="my-course-cell">支付事件号</div>
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
                <div class="my-course-row head">
                    <!-- <div class="time">{{project.ProjectMembers[0]['joinTime']}}</div> -->
                </div>
                <div class="my-course-row content">
                    <div class="my-course-cell first cover">
                        <router-link :to="``">
                            <img src="../../assets/image/project-hot.png" alt="">
                            <div class="title">{{apply.projectName}}</div>
                        </router-link>
                    </div>
                    <div class="my-course-cell price">{{(apply.paymentID==undefined)?"暂无":apply.paymentID}}</div>
                    <div class="my-course-cell state">{{myTotalOption.labelProjectApplyStatue[apply.applyStatue]}}</div>
                    <div class="my-course-cell operating">
                        <a :class="[apply.applyStatue!='PENDING'?'btn-operate-disabled':'btn-operate']" 
                            @click="redirectToPayment">
                            进行支付
                        </a>
                        <a :class="[apply.applyStatue!='PENDING'?'btn-operate-disabled':'btn-operate']"
                            @click="cancelApply(apply['applyID'])">
                            取消创建
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
    
    <el-dialog title="发起项目创建申请" :visible.sync="createFormVisible">
    <el-form :model="createForm">
        <el-form-item label="项目名称" >
            <el-input v-model="createForm.projectName"  autocomplete="off" ></el-input>
        </el-form-item>  
           
        <el-form-item label="项目费用（保证金）/单位(Finney)" >
            <el-input v-model.number="createForm.projectFee" type="number" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="项目介绍" >
            <el-input v-model="createForm.projectIntro" type="text" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="项目领域" >
                <el-select v-model="createForm.projectField" placeholder="请选择操作类型">
                        <el-option
                        v-for="item in myTotalOption.optionProjectField"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                </el-select>              
        </el-form-item>
               
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="createFormVisible = false">取 消</el-button>
        <el-button type="primary"  @click="submitApply()">确 定</el-button>
    </div>
    </el-dialog> 

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


                infoDialogVisible:false,
                infoArr:[{title:'defualt',value:'default'}],
                infoTableWidth:0,
                infoTable:[],

                createFormVisible:false,
                createForm:{
                    projectIntro:'',
                    projectName:'',
                    projectField:'',
                    projectFee:'',
                },
            }
        },
        methods: {
            handleDialogClose(){
                this.infoDialogVisible=false;
            },                 
            // 跳转至支付页面
            redirectToPayment(){
                this.$router.replace({path:'/profile/wallet'});
            },
            openCreateForm(){
                for (var key in this.createForm) {
                　　this.createForm[key]="";
                }
                this.createFormVisible=true;
            },
            memberInfo(item){
                this.infoDialogVisible=true;
                this.infoArr=[];
                this.infoArr.push({'title':'项目ID','value':item.projectID});
                this.infoArr.push({'title':'成员类型','value':this.myTotalOption.labelMemberType[item.memberType]});
                this.infoArr.push({'title':'冻结金额','value':item.frozenBalance});
                this.infoArr.push({'title':'是否参与评分','value':item.boolRemark==0?'否':'是'});

                this.infoTableWidth=0;
                this.infoTable=[];
            },
            //获取课程信息
            async getProject(page) {
                try {
                    let response = await this.$axios.get(`/api/project/query/getprojectauthed?page=${page}`);
                    let responseCount=await this.$axios.post(`/api/project//query/getprojectcountauthed`);
                    if (response.data.status === 0) Message.info(response.data.msg);
                    else {
                        this.projectCount = responseCount.data.count % 10 === 0 ?
                            Math.floor(responseCount.data.count / 10) : Math.floor(responseCount.data.count / 10) + 1;
                        this.projects = response.data.sqlres;
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            //获取课程信息
            async getCreateApply(page) {
                try {
                    let response = await this.$axios.get(`/api/project/query/getCreateRecord?page=${page}`);
                    let responseCount=await this.$axios.post(`/api/project/query/getCreateRecordCount`);
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

            submitApply: async function(){
                try {
                    let res=await this.$axios.post('/api/project/CreateRecord/createapply',{
                        'projectName':this.createForm.projectName,
                        'projectIntro':this.createForm.projectIntro,
                        'projectFee':this.createForm.projectFee,
                        'projectField':this.createForm.projectField,
                        })
                    if(res.data.status==0){
                        throw "Failed"
                    }
                    this.createFormVisible=false;
                    Message.success("操作成功");    
                } catch (error) {
                    Message.error("操作失败!");  
                    this.createFormVisible=false;
                    console.log(error);
                }           
            },   
            //取消报名
            async cancelApply(applyID){
                MessageBox.confirm('确定取消创建该项目？相关的支付事件将被自动删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        let response = await this.$axios.post(`/api/project/CreateRecord/cancelApply`,{
                            applyID
                        });
                        if (response.data.status != 1) Message.info('操作失败!');
                        else if (response.data.status === 1) {
                            Message.success(response.data.msg);
                            this.getCreateApply(1);
                        } ;
                    } catch (error) {
                        Message.info("操作失败");
                    }

                }).catch(() => {
                    Message.info("已取消操作");
                })                
            },
            //页码改变
            projectPageChanged(val) {
                this.getProject(val);
            },
            // 页码改变（项目参加申请）
            applyPageChanged(val) {
                this.getCreateApply(val);
            },           
            // 查询项目最终评分
            openProScoreForm:async function(qid){
                try {
                    let res=await this.$axios.post('/api/project/query/getProScore',{'projectID':qid})
                    res=res.data
                    if(res.flag==false) throw "Query Failed!"
                    this.proScoreForm.scoreList=res.scoreList;
                    this.proScoreForm.memberNum=res.memberNum;
                    console.log(this.scoreForm.memberList)
                    this.proScoreForm.projectID=qid;
                    this.proScoreFormVisible=true;
                } catch (error) {
                    this.proScoreFormVisible=false;
                    console.log(error);
                }          
                
            },   


        },
        
        components: {            
            "information-dialog":InformationDialog,
        },        
        created() {
            this.myTotalOption=TotalOption;
            this.getCreateApply(1);
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