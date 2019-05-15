const PaymentRecord=require('../../service/project-paymentrecord')
const UserInformation=require('../../service/user-information')
const ProjectInformation=require('../../service/project-information')
const CreateRecord=require('../../service/project-createrecord')
const ApplyRecord=require('../../service/project-applyrecord')
const ProjectMember=require('../../service/project-projectmember')

const web3Instance=require('../../ethereum/initWeb3').web3;
const BigNumber = require('bignumber.js');
let moment = require('moment');
/**
 * GetRecord
 */
/**
* showdoc
* @catalog 实训项目/查询
* @title 获取支付记录
* @description 获取支付记录数组（包括支付完毕和待支付的‘账单’）
* @method get
* @url 
* @param userID 可选 int 用户ID
* @param paymentID 可选 int 支付ID码
* @param payType 可选 string 支付类型
* @param payStatue 可选 int 用户ID
* @param objectID 可选 string 投资项目、
* @param relateEvent 可选 关联事件（课程/项目）
* @param Page 可选 int 分页
* @return_param flag bool 查询结果
* @return_param sqlres dict 支付记录数组
* @return_parm length int 数组长度
* @remark 备注：需要检查权限(已实现)；需要分页功能
* @number 0
*/        
exports.getRecord = async (req, res) => {
    const userID = req.query.userID;
    const paymentID = req.query.paymentID;
    const payType = req.query.payType;
    const payStatue = req.query.payStatue;
    const objectID = req.query.objectID;
    const relateEvent=req.query.relateEvent;
    const page=req.query.page;
    await PaymentRecord.selectRecord(paymentID,userID,payStatue,objectID,payType,relateEvent, page).then((rows) => {
        res.json({status: 1, record: rows})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    });
};

/**
 * Test MemberAdd (测试将指定ID成员加入项目，并初始化成员身份、金额等功能)
 */

/**
* showdoc
* @catalog 实训项目/项目参加申请
* @title 获取申请列表总页数
* @description 根据筛选参数，获取申请列表总页数
* @method post
* @url 
* @param userID 可选 int 用户ID
* @param paymentID 可选 int 支付ID码
* @param payType 可选 string 支付类型
* @param payStatue 可选 int 用户ID
* @param objectID 可选 string 投资项目、
* @param relateEvent 可选 关联事件（课程/项目）
* @return {status: 1, count: count}
* @return_param flag bool 查询结果、
* @remark 
* @number 0
*/       
 exports.getRecordCount = async (req, res) => {
    // applyID,userID,projectID,applyStatue,paymentID
    const userID = req.body.userID;
    const paymentID = req.body.paymentID;
    const payType = req.body.payType;
    const payStatue = req.body.payStatue;
    const objectID = req.body.objectID;
    const relateEvent=req.body.relateEvent;
    await AttendApplyRecord.selectCount(userID,paymentID,payType,payStatue,objectID,relateEvent).then((count) => {
        res.json({status: 1, count: count})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    })
};


  /**
   * ComfirmPayment
   * 供事件监听器使用，不直接公开使用接口
  */

//   exports.comfirmPayment_test=async(req,res)=>{
//       try {
//         await comfirmPayment(req.query.ID,req.query.msgVal);
//         res.json({status: 1, msg: '测试成功'})
//       } catch (error) {
//         console.log(err);
//         res.json({status: 0, msg: '服务器错误'})          
//       }
//   }
  exports.comfirmPayment=async(ID,msgVal)=>
  {
      try{
        var rows=await PaymentRecord.select({
            paymentID:ID
        })
        if(rows.length!=1){
            throw "Illegal Data!"
        }
        // Check PayAmount
        var dataRow=rows[0];
        let payAmount=dataRow.payAmount;
        //Turn Wei Into Finney;
        msgVal=web3Instance.utils.fromWei(msgVal, 'finney');
        if(dataRow.payStatue!=0){
            throw("Illegal PayStatue!")
        }
        // Use Fenny 作为基本支付单位，已提前进行转换！
        if(parseInt(payAmount)!==parseInt(msgVal)){
            throw("Illegal payAmount!")
        }

        await PaymentRecord.update({paymentID:ID},{payStatue:1});
        //Project Part
        if(dataRow.relateEvent=='PROJECT'){
            if(dataRow.payType=='C'){
                var rows=await CreateRecord.select({paymentID:ID});
                var dataRow=rows[0];
                if(dataRow.applyStatue!="PENDING") throw("Illegal applyStatue!")
                await CreateRecord.update({applyID:dataRow.applyID},{
                    applyStatue:'ACCEPTED'
                });
                //Create project
                var res=await ProjectInformation.insert({
                    creatorID:dataRow.userID,
                    createTime:moment(new Date()).format('YYYY-MM-DD'),
                    projectType:dataRow.projectType,
                    projectStatue:0,
                    projectFee:dataRow.projectFee,
                    projectName:dataRow.projectName,
                    projectPic:dataRow.projectPic,
                    projectIntro:dataRow.projectIntro,
                    projectField:dataRow.projectField,
                }) 
                // Insert Creator As member of the project
                // /reator 's frozenBalance is autolly updated With payment's payAmount!!!
                var res=await ProjectMember.insert({
                    projectID:res.dataValues.projectID,
                    memberID:dataRow.userID,
                    joinTime:moment(new Date()).format('YYYY-MM-DD'),
                    memberType:1,
                    frozenBalance:payAmount,
                })                   
            }else if('A'==dataRow.payType){
                var rows=await ApplyRecord.select({paymentID:ID})
                var dataRow=rows[0];
                if(dataRow.applyStatue!="PENDING") throw ("Illegal applyStatue!")
                ApplyRecord.update({applyID:dataRow.applyID},{applyStatue:'ACCEPTED'})
                rows=await ProjectInformation.select({projectID:dataRow.projectID});
                var projectRow=rows[0];

                // InsertMember
                await ProjectMember.insert({
                    projectID:dataRow.projectID,
                    memberID:dataRow.userID,
                    joinTime:moment(new Date()).format('YYYY-MM-DD'),
                    memberType:0,
                    frozenBalance:0,
                })
                //UPDATE Creator's payAmount With payment's payAmount!!!
                rows=await ProjectMember.select({
                    projectID:dataRow.projectID,
                    memberID:projectRow.creatorID,
                })
                var creatorRow=rows[0];

                let currentBalance=parseInt(creatorRow.frozenBalance);
                currentBalance=currentBalance+parseInt(payAmount);
                ProjectMember.update({projectID:creatorRow.projectID,memberID:creatorRow.memberID},
                    {frozenBalance:currentBalance})
            }else if(dataRow.payType=='O'){
                //Invest Part
                var rows=await ProjectInformation.select({projectID:dataRow.objectID})
                var projectRow=rows[0];
                rows=await ProjectMember.select({projectID:dataRow.objectID,memberID:projectRow.creatorID})
                var creatorRow=rows[0];
                let currentBalance=parseInt(creatorRow.frozenBalance);
                currentBalance=currentBalance+parseInt(payAmount);
                ProjectMember.update(
                    {projectID:projectRow.projectID,memberID:projectRow.creatorID},
                    {frozenBalance:currentBalance}
                )
                //Invest Part
            }
        }else{
            throw "Illegal Event Type"
        }

        // Check PayAmount
      }catch(err){
        console.log('error happened in comfirmPayment!')
        console.log(err);
      }
  };