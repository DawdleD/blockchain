<template>
    <div class="my-course-list">
        <!--课程列表顶部信息 S-->
        <template>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="支付管理" name="first">
                <div class="my-course-list-header">
                <div class="my-course-row">
                    <div class="my-course-cell first">项目信息/支付ID码</div>
                    <div class="my-course-cell">支付金额</div>
                    <div class="my-course-cell">支付状态/类型</div>
                    <div class="my-course-cell">操作</div>
                </div>
            </div>
            <!--课程列表顶部信息 E-->
            <!--课程列表 S-->
            <!--课程不存在 S-->
            <div class="my-course-list-no-data" v-if="paymentRecords.length===0">
                <div class="status-box">
                    <div class="box-icon">
                        <span class="fas fa-info-circle"></span>
                    </div>
                    <div class="box-text">
                        <div>暂无支付信息</div>
                    </div>
                </div>
            </div>
            <!--课程不存在 E-->
            <!--课程存在 S-->
            <div class="my-course-list-item" v-else v-for="payment in paymentRecords" :key="payment['paymentID']">
                <div class="my-course-row head">
                    <!-- <div class="time">{{project.ProjectMembers[0]['joinTime']}}</div> -->
                </div>
                <div class="my-course-row content">
                    <div class="my-course-cell first cover">
                        <router-link :to="``">
                            <img src="../../assets/image/project-hot.png" alt="">
                            <div class="title">项目编号/名称：{{genTitle(payment)}}<br/>支付ID号：{{payment['paymentID']}}</div>
                        </router-link>
                    </div>
                    <div class="my-course-cell price">{{payment.payAmount}}</div>
                    <div class="my-course-cell state">支付状态:{{myTotalOption.labelPaymentStatue[payment['payStatue']]}}<br/>支付类型:{{myTotalOption.labelPaymentType[payment['payType']]}}</div>
                    <div class="my-course-cell operating">
                        <a :class="[payment.payStatue!='0'?'btn-operate-disabled':'btn-operate']"
                            @click="dealWithPayment(payment)">
                            进行支付
                        </a>
                        <a class="btn-operate" @click="paymentInfo(payment)">
                            支付详情
                        </a>
                    </div>
                </div>
            </div>
            <!--课程存在 E-->
            <!--课程列表 E-->
            <!--分页 S-->
            <div class="course-sort-page" v-if="paymentRecords.length>0">
                <el-pagination background layout="prev, pager, next"
                            :pager-count="10" @current-change="paymentPageChanged"
                            :total="10*recordCount">
                </el-pagination>
            </div>
            </el-tab-pane>
        </el-tabs>
        </template>
        <information-dialog @dialogClose="handleDialogClose" :infoArr="infoArr" :infoTableWidth="infoTableWidth" :infoDialogVisible="infoDialogVisible" :infoTable="infoTable"></information-dialog>
    </div>
  </template>


<script>
import InformationDialog from '../common/InformationDialog'
import {
    Message,
    MessageBox,
    ElTabs
} from 'element-ui'
import {
    TotalOption,
} from '../../utils/constant/options';

export default {
    name: "Wallet",
    data() {
        return {
            recordCount: 1,
            activeName: 'first',
            paymentRecords: [],
            myTotalOption: [],

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
        genTitle(item){
            var titleName="N/A";
            // InvestProject
            // CreateApply
            // AttendApply
            if(null!=item.InvestProject){
                titleName=item.InvestProject.projectID+'/'+item.InvestProject.projectName;
            }else if(null!=item.CreateApply){
                titleName=item.CreateApply.applyID+'/'+item.CreateApply.projectName;
            }else if(null!=item.AttendApply){
                titleName=item.AttendApply.projectID+'/'+item.AttendApply.projectName;
            }
            return titleName
        },
        paymentInfo(item){
            this.infoDialogVisible=true;
            this.infoArr=[]
            this.infoArr.push({'title':'支付人用户ID','value':item.PaymentSender.userID});
            this.infoArr.push({'title':'关联事件','value':item.relateEvent});
            this.infoArr.push({'title':'投资项目编号','value':item.objectID!=null?item.objectID:'无'});
            this.infoArr.push({'title':'事件区块ID','value':item.txHash!=null?item.txHash:'无'});
            this.infoArr.push({'title':'区块日志编号','value':item.logIndex!=null?item.logIndex:'无'});
            this.infoTableWidth=0;
            this.infoTable=[];
        },
        //获取课程信息
        async getPayment(page) {
            try {
                let response = await this.$axios.get(`/api/project/query/getPaymentRecord?page=${page}`);
                let responseCount = await this.$axios.post(`/api/project/query/getPaymentCount`);
                if (response.data.status === 0) Message.info(response.data.msg);
                else {
                    this.recordCount = responseCount.data.count % 10 === 0 ?
                        Math.floor(responseCount.data.count / 10) : Math.floor(responseCount.data.count / 10) + 1;
                    this.paymentRecords = response.data.sqlres;
                }
            } catch (e) {
                console.log(e);
            }
        },

        //进行支付
        async cancelApply(applyID) {
            MessageBox.confirm('确定取消报名该项目？相关的支付事件将被自动删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async() => {
                let response = await this.$axios.post(`/api/project/ApplyRecord/cancelApply`, {
                    applyID
                });
                if (response.data.status === -1) Message.info(response.data.msg);
                else if (response.data.status === 1) {
                    Message.success(response.data.msg);
                    this.getAttendApply(1);
                } else Message.error(response.data.msg);
            }).catch(() => {
                Message.info("已取消操作");
            })
        },

        // 进行支付
        dealWithPayment:async function(dealItem){
            let TID=dealItem.payType+dealItem.paymentID;
            var sendDict = {};
            sendDict["from"] = this.$store.state.web3.coinbase;
            sendDict["gas"] = 100000;
            // 将Finney单位的金额转为Wei单位
            sendDict["value"] = await this.$store.state.web3.web3Instance().utils.toWei(dealItem.payAmount.toString(),'finney');
            TID=this.$store.state.web3.web3Instance().utils.fromAscii(TID);
            this.$store.state.contractInstance().methods.submitPayment(TID)
                .send(sendDict)
                .on('receipt', receipt => {
                   Message.success('支付成功')
                })
                .on('error', error => {
                    Message.error('支付失败！')
                })
        },           
        //页码改变
        paymentPageChanged(val) {
            this.getPayment(val);
        },
    },
    components: {            
        "information-dialog":InformationDialog,
    },    
    created() {
        this.myTotalOption=TotalOption;
        this.getPayment(1);
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