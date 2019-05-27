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
                        <el-dropdown>
                        <span class="el-dropdown-link">
                            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                @click.native.prevent="closeProjectApply(project['projectID'])">关闭课程</el-dropdown-item>
                            <el-dropdown-item 
                                @click.native.prevent="modifyProject(project)">编辑</el-dropdown-item>
                            <el-dropdown-item 
                                @click.native.prevent="openInvestForm(project)"   :disabled="(project.projectStatue!=0)">
                                    投资</el-dropdown-item>
                            <el-dropdown-item  :disabled="(project.remarkPhase!='OPEN')"
                                @click.native.prevent="openDialog(project['projectID'])">项目评分</el-dropdown-item>
                            <el-dropdown-item  :disabled="((project.remarkPhase!='OPEN'))"
                                @click.native.prevent="openProScoreForm(project['projectID'])">确认评分</el-dropdown-item>
                        </el-dropdown-menu>
                        </el-dropdown>                        

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
   <el-dialog title="发起项目评分" :visible.sync="scoreFormVisible"  width="60%">
    <el-form :model="scoreForm">
        <el-form-item label="项目ID" >
        {{scoreForm.projectID}}
        </el-form-item>

        <el-form-item>
            <el-table
                :data="scoreForm.memberList"
                border
                style="width: 100%">
                <el-table-column
                fixed
                prop="memberID"
                label="成员ID"
                width="80">
                </el-table-column>
                <el-table-column
                prop="UserInformation.nickname"
                label="成员姓名"
                width="100">
                </el-table-column>
                <el-table-column
                label="设计创新评分"
                >
                <template slot-scope="scope">
                      <el-input-number v-model="scope.row.memberDesignScore"  :min="0" :max="40" size="mini"></el-input-number>
                </template>
                </el-table-column>
                <el-table-column
                label="代码能力评分">
                <template slot-scope="scope">
                      <el-input-number v-model="scope.row.memberCodeScore"  :min="0" :max="40" size="mini"></el-input-number>
                </template>
                </el-table-column>
                <el-table-column
                label="态度评分">
                <template slot-scope="scope">
                      <el-input-number v-model="scope.row.memberAttitudeScore"  :min="0" :max="20" size="mini"></el-input-number>
                </template>
                </el-table-column>                                                
                <el-table-column
                fixed="right"
                label="成员总评分">
                <template slot-scope="scope">
                     {{scope.row.memberDesignScore+scope.row.memberCodeScore+scope.row.memberAttitudeScore}}
                </template>                

                </el-table-column>
            </el-table>
        </el-form-item>  
              
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="scoreFormVisible = false">取 消</el-button>
            <el-button type="primary"  @click="submitScore()">确 定</el-button>
        </div>
        </el-dialog>     
        <!--对话框 E-->
    <information-dialog @dialogClose="handleDialogClose" :infoArr="infoArr" :infoTableWidth="infoTableWidth" :infoDialogVisible="infoDialogVisible" :infoTable="infoTable"></information-dialog>
    
   <el-dialog title="项目成绩单" :visible.sync="proScoreFormVisible"  width="60%">
    <el-form :model="proScoreForm">
        <el-form-item label="项目ID" >
        <el-input v-model="proScoreForm.projectID" autocomplete="off" :disabled="true" ></el-input>
        </el-form-item>
        <el-form-item label="有效评分人数" >
            <span>{{proScoreForm.memberNum}}</span>
        </el-form-item>

        <el-form-item>
            <el-table
                :data="proScoreForm.scoreList"
                border
                style="width: 100%">
                <el-table-column
                fixed
                prop="userID"
                label="成员ID"
                width="80">
                </el-table-column>
                <el-table-column
                label="设计创新评分"
                prop="desScore"
                >
                </el-table-column>
                <el-table-column
                label="代码能力评分"
                prop="codScore">
                </el-table-column>
                <el-table-column
                label="态度评分"
                prop="attScore">
                </el-table-column>                                                
                <el-table-column
                label="成员总评分">
                <template slot-scope="scope">
                     {{scope.row.desScore+scope.row.codScore+scope.row.attScore}}
                </template>                

                </el-table-column>
            </el-table>
        </el-form-item>  
              
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="proScoreFormVisible = false">取 消</el-button>
        <el-button type="primary"  @click="comfirmProScore()">结束评分流程并登记成绩</el-button>
    </div>
    </el-dialog> 

    <el-dialog title="发起项目投资" :visible.sync="investFormVisible">
    <el-form :model="investForm">
        <el-form-item label="项目ID" >
        <el-input v-model="investForm.projectID" autocomplete="off" :disabled="true" ></el-input>
        </el-form-item>

        <el-form-item label="项目名称" >
            <el-input v-model="investForm.projectName" :disabled="true" autocomplete="off" ></el-input>
        </el-form-item>  
           
        <el-form-item label="投资额度" >
            <el-input v-model.number="investForm.payAmount" type="number" autocomplete="off" ></el-input>
        </el-form-item>
               
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="investFormVisible = false">取 消</el-button>
        <el-button type="primary"  @click="submitInvest()">确 定</el-button>
    </div>
    </el-dialog> 

    <el-dialog title="项目信息编辑" :visible.sync="modifyFormVisible">
    <el-form :model="modifyForm">
        <el-form-item label="项目ID" >
        <el-input v-model="modifyForm.projectID" autocomplete="off" :disabled="true" ></el-input>
        </el-form-item>

        <el-form-item label="项目名称" >
            <el-input v-model="modifyForm.projectName" :disabled="true" autocomplete="off" ></el-input>
        </el-form-item>  

        <el-form-item label="项目封面" >
                    <el-upload
                            class="avatar-uploader"
                            enctype="multipart/form-data"
                            name="projectavatar"
                            :data="uploadData"
                            action="/api/project/projectmanagement/updateAvatar"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <!--  -->
                        <img  :src="modifyForm.projectPic" alt="项目封面"  class="avatar">
                    </el-upload>        
        </el-form-item>
           
        <el-form-item label="项目费用（保证金）/单位(Finney)" >
            <el-input v-model.number="modifyForm.projectFee" type="number" autocomplete="off" :change="check_num(val,'modifyForm','projectFee')" ></el-input>
        </el-form-item>

        <el-form-item label="项目介绍" >
            <el-input v-model="modifyForm.projectIntro" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="项目领域" >
                <el-select v-model="modifyForm.projectField" placeholder="请选择项目领域">
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
        <el-button @click="modifyFormVisible = false">取 消</el-button>
        <el-button type="primary"  @click="submitModify()">确 定</el-button>
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
                dialogCourseID: 0,
                dialogVisible: false,
                dialogFormInfo: {
                    title: '评价课程',
                    rateValue: 5,
                    remain: 1000,
                    qualified: true,
                    errorMsg: '',
                    text: ''
                },
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

                proScoreFormVisible:false,
                proScoreForm:{
                    projectID:"",
                    scoreList:"",
                },     
                investFormVisible:false,
                investForm:{
                    projectID:'',
                    projectName:'',
                    payAmount:'',
                },

                modifyFormVisible:false,
                modifyForm:{
                    projectID:'',
                    projectName:'',
                    projectPic:'',
                    projectField:'',
                    projectFee:'',
                    projectIntro:'',
                },
                uploadData:{},
            }
        },
        methods: {
            check_num: function(val,formname,value){
                var awardAmount = this[formname][value];
                awardAmount = awardAmount.toString().replace(/[^\d]/g, ''); // 清除“数字”和“.”以外的字符
                if (awardAmount.indexOf('.') < 0 && awardAmount != '') {
                    // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                    awardAmount = parseInt(awardAmount);
                }
                this[formname][value] = awardAmount;
            },                  
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
                    // console.log(this.scoreForm.memberList)
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

            submitModify:async function(){
                try {
                    let res=await this.$axios.post('/api/project/projectmanagement/modifyProject',{
                        'projectID':this.modifyForm.projectID,
                        'projectName':this.modifyForm.projectName,
                        'projectField':this.modifyForm.projectField,
                        'projectFee':this.modifyForm.projectFee,
                        'projectIntro':this.modifyForm.projectIntro,
                        })
                    if(res.data.status==0){
                        throw "Failed"
                    }             
                    this.modifyFormVisible=false;
                    Message.success("操作成功");  
                } catch (error) {
                    Message.error("操作失败");  
                    this.modifyFormVisible=false;
                    console.log(error);
                }
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
                    let res=await this.$axios.get('/api/project/query/getProScore',{
                        params:{'projectID':qid}
                    })
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
            // 确认项目最终得分并结束互评阶段
            comfirmProScore:async function(){
                try {
                    let res=await this.$axios.get('/api/project/projectmanagement/comfirmProScore',{
                        params:{'projectID':this.proScoreForm.projectID}
                    })
                    res=res.data
                    if(res.status==0) throw "Query Failed!"
                    this.$message.success("操作成功")
                    this.proScoreFormVisible=false;
                } catch (error) {
                    this.$message.error("操作失败")
                    this.proScoreFormVisible=false;
                    console.log(error);
                }          
                
            },  
            closeProjectApply:async function(projectID){
                MessageBox.confirm('确定对该项目进行关闭操作？项目关闭后，互评阶段将自动开启，且各成员将根据冻结资金的分配形式获取奖励。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        let data = {
                            params:{projectID}
                        };     
                        let res=await this.$axios.get(`/api/project/projectmanagement/closeProject`, data)   
                        if(res.data.status==0) throw "Fetch Failed!"
                        Message.success("操作成功");      
                    } catch (error) {
                        Message.error("操作失败");  
                    }

                }).catch(() => {
                    Message.info("已取消操作");
                })         
            },

            openInvestForm: async function(projectItem){
                try {
                    this.investForm.projectName=projectItem.projectName;
                    this.investForm.projectID=projectItem.projectID;
                    this.investForm.payAmount=0;
                    this.investFormVisible=true;
                } catch (error) {
                    this.rewardFormVisible=false;
                    console.log(error);
                }
            },     
            submitInvest:async function () {
                try {
                    let data = {
                    };     
                    data.projectID=this.investForm.projectID
                    data.payAmount=this.investForm.payAmount
                    console.log(data);
                    let res=await this.$axios.post(`/api/project/projectmanagement/submitInvest`, data)   
                    if(res.data.status==0) throw "Fetch Failed!"
                    this.investFormVisible=false;
                    Message.success("操作成功");      
                } catch (error) {
                    Message.error("操作失败");   
                    console.log(error);
                }
            } ,
            modifyProject:function(project){
                this.uploadData={'projectID':project.projectID};
                this.modifyForm.projectID=project.projectID;
                this.modifyForm.projectName=project.projectName;
                this.modifyForm.projectPic=project.projectPic;
                this.modifyForm.projectField=project.projectField;
                this.modifyForm.projectFee=project.projectFee;
                this.modifyForm.projectIntro=project.projectIntro;
                this.modifyFormVisible=true;
            },
            /* 更改头像成功后执行 */
            handleAvatarSuccess(res, file) {
                if (res.status === 1) {
                    this.modifyForm.projectPic = URL.createObjectURL(file.raw);
                } else
                    Message.error(res.msg);
            },
            /* 在提交头像之前检查 */
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) Message.error('上传头像图片只能是 JPG 格式!');
                if (!isLt2M) Message.error('上传头像图片大小不能超过 2MB!');
                return isJPG && isLt2M;
            },            

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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>