<template>
    <div class="my-course-list">
        <!--课程列表顶部信息 S-->
        <template>
                <div class="my-course-list-header">
                <div class="my-course-row">
                    <div class="my-course-cell first">项目</div>
                    <div class="my-course-cell">冻结资产</div>
                    <div class="my-course-cell">状态</div>
                    <div class="my-course-cell">操作</div>
                </div>
            </div>
            <!--课程列表顶部信息 E-->
            <!--课程列表 S-->
            <!--课程不存在 S-->
            <div class="my-course-list-no-data" v-if="projects.length===0">
                <div class="status-box">
                    <div class="box-icon">
                        <span class="fas fa-info-circle"></span>
                    </div>
                    <div class="box-text">
                        <div>暂无项目信息</div>
                    </div>
                </div>
            </div>
            <!--课程不存在 E-->
            <!--课程存在 S-->
            <div class="my-course-list-item" v-else v-for="project in projects" :key="project['projectID']">
                <div class="my-course-row head">
                    <div class="time">{{project.ProjectCreatorMemberInfo['joinTime']}}</div>
                </div>
                <div class="my-course-row content">
                    <div class="my-course-cell first cover">
                        <router-link :to="`/project/${project['projectID']}/information`">
                            <img src="../../assets/image/project-hot.png" alt="">
                            <div class="title">{{project['projectName']}}</div>
                        </router-link>
                    </div>
                    <div class="my-course-cell price">{{project.ProjectCreatorMemberInfo['frozenBalance']}}</div>
                    <div class="my-course-cell state">项目状态:{{myTotalOption.labelProjectStatus[project.projectStatue]}}<br/>互评阶段:{{myTotalOption.labelRemarkPhase[project.remarkPhase]}}</div>
                    <div class="my-course-cell operating">
                        <a :class="['btn-operate']"
                            @click="openDialog(project)">
                            成员管理
                        </a>                     
                    </div>
                </div>
            </div>
            <!--课程存在 E-->
            <!--课程列表 E-->
            <!--分页 S-->
            <div class="course-sort-page" v-if="projects.length>0">
                <el-pagination background layout="prev, pager, next"
                            :pager-count="10" @current-change="projectPageChanged"
                            :total="10*projectCount">
                </el-pagination>
            </div>
        </template>        

        <!--分页 E-->
        <!--对话框 S-->
   <el-dialog title="成员管理" :visible.sync="memberFormVisible"  width="60%">
    <el-form :model="memberForm">
        <el-form-item label="项目ID" >
        {{memberForm.projectID}}
        </el-form-item>
        <el-form-item label="项目名" >
        {{memberForm.projectName}}
        </el-form-item>
        <el-form-item>
            <el-table
                :data="memberForm.memberList"
                border
                style="width: 100%">
                <el-table-column
                fixed
                prop="memberID"
                label="成员ID"
                width="80">
                </el-table-column>
                <el-table-column
                prop="UserInformation.nickName"
                label="成员姓名"
                width="100">
                </el-table-column>
                <el-table-column
                label="当前余额"
                prop="frozenBalance"
                >
                </el-table-column>
                <el-table-column
                label="代码能力评分">
                    <template slot-scope="scope">
                        <div>
                            <el-button
                            @click.native.prevent="deleteProjectMember(scope.row)"
                            type="text"
                            size="small"
                            :disabled="memberForm.projectStatue==1">
                            移除成员
                            </el-button>    
                            <el-button
                            @click.native.prevent="rewardProjectMember(scope.row)"
                            type="text"
                            size="small"
                            :disabled="(memberForm.projectStatue==1)">
                            成员奖励
                            </el-button>                         
                        </div>                
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>  
              
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary"  @click="memberFormVisible = false">关 闭</el-button>
        </div>
        </el-dialog>     
        <!--对话框 E-->
        <information-dialog @dialogClose="handleDialogClose" :infoArr="infoArr" :infoTableWidth="infoTableWidth" :infoDialogVisible="infoDialogVisible" :infoTable="infoTable"></information-dialog>
    
        <el-dialog title="发起项目奖励/惩罚" :visible.sync="rewardFormVisible">
        <el-form :model="rewardForm">
            <el-form-item label="项目ID" >
            <el-input v-model="rewardForm.projectID" autocomplete="off" :disabled="true" ></el-input>
            </el-form-item>
            <el-form-item label="操作成员ID" >
                <el-input v-model="rewardForm.awardMember" autocomplete="off" :disabled="true" ></el-input>           
            </el-form-item>  
            <el-form-item label="操作额度" >
                <el-input v-model.number="rewardForm.awardAmount" type="number" autocomplete="off" ></el-input>
            </el-form-item>  
            <el-form-item label="操作类型" >
                <el-select v-model="rewardForm.awardType" placeholder="请选择操作类型">
                        <el-option
                        v-for="item in myTotalOption.optionRewardType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                </el-select>           
            </el-form-item>             
            <el-form-item label="管理者目前余额" >
                <el-input v-model="rewardForm.creatorBalance" autocomplete="off" :disabled="true" ></el-input>
            </el-form-item>
            <el-form-item label="操作对象目前余额" >
                <el-input v-model="rewardForm.memberBalance" autocomplete="off" :disabled="true" ></el-input>
            </el-form-item>  
            <el-form-item label="操作理由" >
                <el-input v-model="rewardForm.awardReason" autocomplete="off"  ></el-input>
            </el-form-item>                
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="rewardFormVisible = false">取 消</el-button>
            <el-button type="primary" :disabled="!rewardForm.rewardCheck" @click="submitReward()">确 定</el-button>
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
                projects: [],
                dialogCourseID: 0,

                myTotalOption:[],
                memberForm:{
                    projectID:"",
                    projectName:"",
                    projectStatue:0,
                    memberList:[],
                    creatorBalance:0,
                },                
                memberFormVisible:false,

                rewardForm:{
                    rewardCheck:false,
                    projectID:"",
                    awardMember:"",
                    awardAmount:"",
                    awardType:"",
                    creatorBalance:"",
                    memberBalance:"",
                    awardReason:"",
                },
                rewardFormVisible:false,

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
            // 跳转至支付页面
            redirectToPayment(){
                this.$router.replace({path:'/profile/wallet'});
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
      

            //打开互评栏
            async openDialog(project) {
                try {
                    let res=await this.$axios.get('/api/project/query/getProjectMember',{
                        params:{'projectID':project.projectID}
                    })
                    res=res.data
                    if(res.status==0) throw "Query Failed!"
                    this.memberForm.memberList=[];
                    var ind=0;
                    for(var index in res.sqlres){
                        // console.log(item)
                        var item=res.sqlres[index];
                        if(item.memberType==1){
                            // get creator's balance
                            this.memberForm.creatorBalance=item.frozenBalance;
                        }else{
                            item.userID=item.memberID
                            this.memberForm.memberList.push(
                                item
                            );
                        }
                    }
                    // console.log(this.memberForm.memberList)
                    this.memberForm.projectID=project.projectID;
                    this.memberForm.projectName=project.projectName;
                    this.memberForm.projectStatue=project.projectStatue;
                    this.memberFormVisible=true;
                } catch (error) {
                    this.memberFormVisible=false;
                    console.log(error);
                }          
            },
            // 提交得分
            rewardProjectMember: async function(item){
                try {
                    this.rewardForm.projectID=item.projectID;
                    this.rewardForm.awardMember=item.memberID;
                    this.rewardForm.awardAmount=0;
                    this.rewardForm.awardType="0";
                    this.rewardForm.awardReason="";
                    this.rewardForm.creatorBalance=this.memberForm.creatorBalance;
                    this.rewardForm.memberBalance=item.frozenBalance;
                    this.rewardFormVisible=true;
                } catch (error) {
                    console.log(error);
                    Message.error("操作失败!");  
                }           
            },        

            submitReward: async function(){
                try {
                    let data = {
                    };     
                    data.projectID=this.rewardForm.projectID
                    data.userID=this.rewardForm.awardMember
                    data.awardType=this.rewardForm.awardType
                    data.awardAmount=this.rewardForm.awardAmount
                    data.awardReason=this.rewardForm.awardReason
                    console.log(data);
                    let res=await this.$axios.post(`/api/project/projectmanagement/submitReward`, data)   
                    if(res.data.status==0) throw "Fetch Failed!"
                    this.rewardFormVisible=false;
                    this.memberFormVisible=false;
                    Message.success("操作成功");      
                } catch (error) {
                    Message.error("操作失败");   
                    console.log(error);
                }
            },

            deleteProjectMember:async function(item){
                MessageBox.confirm('确定从项目中移除该成员？成员现拥有的项目内冻结资金将被退还至其钱包中。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        
                    } catch (error) {
                        let response = await this.$axios.get(`/api/project/projectmanagement/deleteProjectMember`,{
                            params:{                            
                                projectID:item.projectID,
                                memberID:item.memberID,
                            },

                        });
                        if (response.data.status != 1) Message.info('操作失败!');
                        else if (response.data.status === 1) {
                            Message.success(response.data.msg);
                        } ;
                    }

                }).catch(() => {
                    Message.info("已取消操作");
                })  
            },


            //页码改变
            projectPageChanged(val) {
                this.getProject(val);
            },
     


        },
        computed:{
            rewardCheck(){
                if(0==this.rewardForm.awardAmount) return false;
                let awdType=this.rewardForm.awardType;
                if(awdType==0){
                    //reward
                    if(this.rewardForm.creatorBalance<this.rewardForm.awardAmount) return false;
                }else{
                    //punishment
                    if(this.rewardForm.memberBalance<this.rewardForm.awardAmount) return false;
                }
                return true;
            }
        },
        watch:{
            rewardCheck(nval,oval){
                this.rewardForm.rewardCheck=nval
            }
        },
        components: {            
            "information-dialog":InformationDialog,
        },        
        created() {
            this.myTotalOption=TotalOption;
            this.getProject(1);
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