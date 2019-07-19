const ProjectInformation=require('../../service/project-information')
const ProjectMember=require('../../service/project-projectmember')

const ScoreRecord=require('../../service/project-scorerecord');
const RewardRecord=require('../../service/project-rewardrecord');
const PaymentRecord=require('../../service/project-paymentrecord')
const moment=require('moment');
const UserInformation=require('../../service/user-information');
const ContractFun=require('../../ethereum/contractFun');

// 文件上传组件
const uploadFile = require('../../utils/upload');
const uploadSetting =
    uploadFile.uploadSetting('image/jpeg', 'public/images/projectPic', 2 * 1024 * 1024);
const uploadImg = uploadSetting.single('projectavatar');
const deleteFile = require('../../utils/delete-file');

/**
 * Submit Reward
 */
/**
* showdoc
* @catalog 实训项目/项目管理
* @title 发起项目奖励
* @description 项目创建者对项目发起奖励
* @method post
* @url /api/project/projectmanagement/submitReward
* @param projectID 必选 int 项目ID号
* @param userID 必选 int 受奖励成员ID
* @param awardAmount 必选 string 奖惩金额
* @param awardType 必选 int 奖惩类型（奖励/处罚）
* @param awardReason 必选 string 奖励理由
* @return_param status bool 操作结果
* @remark 备注：需要检查权限(已实现)；
* @number 0
*/       
exports.submitReward=async(req,res)=>{
    try {
        if(req.session.userID==null||req.body.projectID==null) throw "Illegal Parameter!" 
        var sqlres=await ProjectInformation.select({projectID:req.body.projectID})
        if(sqlres.length!=1) throw "Illegal projectID!"
        if(sqlres[0].projectStatue!=0) throw "Illegal Status!"
        // 检查是否具有操作权限
        var sqlres=await ProjectMember.select({projectID:req.body.projectID,memberID:req.session.userID})
        // 检查权限
        if(sqlres.length!=1||sqlres[0].memberType!=1) throw "Illegal Access!"
        // 检查项目状态

        // 进行金额操作
        var senderRow=sqlres[0];
        var rows=await ProjectMember.select({projectID:req.body.projectID,memberID:req.body.userID});
        if(rows.length!=1) throw "Illegal userID!";
        var userRow=rows[0];
        var newUserBalance,newSenderBalance;
        newUserBalance=parseInt(userRow.frozenBalance);newSenderBalance=parseInt(senderRow.frozenBalance);
        if(req.body.awardType==0){
            if(senderRow.frozenBalance<req.body.awardAmount) throw "Illegal award amount!"
            newUserBalance+=req.body.awardAmount
            newSenderBalance-=req.body.awardAmount
        }else{
            if(usreRow.frozenBalance<req.body.awardAmount) throw "Illegal award amount!"
            newUserBalance-=req.body.awardAmount
            newSenderBalance+=req.body.awardAmount    
        }
        ProjectMember.update({projectID:req.body.projectID,memberID:senderRow.memberID},
            {frozenBalance:newSenderBalance})
        ProjectMember.update({projectID:req.body.projectID,memberID:userRow.memberID},
            {frozenBalance:newUserBalance})                
        
        var rewardRow=await RewardRecord.insert({
            projectID:req.body.projectID,userID:userRow.memberID,awardTime:moment(new Date()).format('YYYY-MM-DD'),
            awardType:req.body.awardType,awardAmount:req.body.awardAmount,awardReason:req.body.awardReason,
            senderID:senderRow.memberID
        })
        ContractFun.emitRewardEvent(req.body.userID,req.body.projectID,req.body.awardAmount,
            req.body.awardType,(new Date()).valueOf(),req.body.awardReason,
            rewardRow.dataValues.rewardID,senderRow.memberID);
        /**
         * rewardID:rewardRow.dataValues.projectID
         * 使用智能合约函数登记奖励事件
         */
        res.json({status:1})
    } catch (error) {
        console.log(error);
        res.json({status:'0',msg:'服务器错误'})
    }
}

/**
 * submitScore
 */
/**
* showdoc
* @catalog 实训项目/项目管理
* @title 提交项目评分
* @description 项目互评阶段，拥有互评权限资格的人员提交评分表单
* @method post
* @url 
* @param projectID 必选 int 项目ID号
* @param memberList 必选 arr_of_dict 成员打分清单，包含打分成员ID，三栏分数
* @return_param flag bool 查询结果
* @return_param sqlres dict 支付记录数组
* @return_parm length int 数组长度
* @remark 备注：需要检查权限(已实现)；需要分页功能
* @number 0
*/ 
exports.submitScore=async(req,res)=>{
    try {
        if(null==req.body.projectID) throw "Illegal ProjectID";
        if(null==req.session.userID) throw "Illegal access";
        var sqlres=await ProjectInformation.select({projectID:req.body.projectID});
        if(sqlres[0].projectStatue==0) {throw "The Project is no closed"};
        if(sqlres[0].remarkPhase!='OPEN') {throw "Illegal Remark Phase : NOT OPEN"};

        var sqlres=await ProjectMember.select({projectID:req.body.projectID,memberID:req.session.userID});
        if(sqlres.length!=1||sqlres[0].boolRemark!=0) throw "Illegal member or Already Scored"

        var sqlres=await ProjectMember.select({projectID:req.body.projectID});
        if(sqlres.length==0||sqlres.length-1!=req.body.memberList.length) throw "Invalid querySpeProjectMember or submit data in api/submitscore"

        for(var index=0;index<req.body.memberList.length;index++){
            var listItem=req.body.memberList[index];
            //MODIFIED:Score will be composed of 3 parts
            //Check if scorelist is legal by checking every scored member
            var memberScore=listItem.attitudeScore+listItem.designScore+listItem.codeScore
            if((memberScore)>100||memberScore<0) throw "Illegal score in memberList"
            var sqlres=await ProjectMember.select({projectID:req.body.projectID,memberID:listItem.userID})
            if(sqlres.length!=1||sqlres[0].memberType!=0) throw "Illegal memberList!"
        }

        // Marked Already
        ProjectMember.update({projectID:req.body.projectID,memberID:req.session.userID},{
            boolRemark:1
        })
        for(var index=0;index<req.body.memberList.length;index++){
            var listItem=req.body.memberList[index];
            // await?
            ScoreRecord.insert({
                projectID:req.body.projectID,userID:listItem.userID,scorerID:req.session.userID,scoreTime:moment(new Date()).format('YYYY-MM-DD'),
                attitudeScore:listItem.attitudeScore,designScore:listItem.designScore,codeScore:listItem.codeScore
            });

        }
          
        res.json({status:1})
    } catch (error) {
        console.log(error);
        res.json({status:'0',msg:'服务器错误'})
    }
}


// 0426代码检查

    /**
* showdoc
* @catalog 实训项目/项目管理
* @title 提交项目投资信息
* @description 项目创建者发起对一个项目发起投资事件，并自动在ProjectPaymentRecord表中创建一个O类型的支付事件
* @method post
* @url 
* @param projectID 必选 int 项目ID号
* @param payAmount 必选 ubt 投资金额
* @return {"status": 1}
* @return_param flag bool 操作结果、
* @remark 备注：具有权限审查功能，投资发起者必须是项目的创建者（管理员不可）
* @number 0
*/   
exports.submitInvest=async function(req,res,next){
    try {
        var userID=req.session.userID;
        if(null==userID) throw "Illegal Access!"
        if(null==req.body.projectID) throw "Invalid projectID!"
        /**
         * Check Auth&phase
         */
        var sqlres=await ProjectMember.select({memberID:userID,projectID:req.body.projectID});
        if(sqlres.length!=1||sqlres[0].memberType!=1) throw "Illegal Access!";

        var sqlres=await ProjectInformation.select({projectID:req.body.projectID});
        if(sqlres.length!=1||sqlres[0].projectStatue!=0) throw "Illegal Project(Statue)";
        /**
         * Check Auth&phase
         */        
         await PaymentRecord.insert({
            payType:'O',relateEvent:'PROJECT',payAmount:req.body.payAmount,userID:req.session.userID,
            payStatue:0,objectID:req.body.projectID
         });     
         res.json({status:1})   
    } catch (error) {
        console.log(error);
        res.json({status:'0',msg:'服务器错误'})        
    }

}


  /**
    * showdoc
    * @catalog 实训项目/项目管理
    * @title 关闭项目
    * @description 项目创建者发起对项目关闭件，ProjectMember内记载的FrozenBalance将被返回至各用户的账户中（通过智能合约方法返还）；同时项目互评环节将开放
    * @method get
    * @url 
    * @param projectID 必选 int 项目ID号
    * @return {"flag":true}
    * @return_param flag bool 操作结果
    * @remark 备注：具有权限审查功能，事件发起者必须是项目的创建者或管理员(已实现)，调用智能合约函数
    * @number 0
    */       
exports.closeProject=async function(req,res,next){
    try {
        var userID=req.session.userID;
        if(null==req.query.projectID) throw "Invalid projectID";

        /**
         * check Auth & project statue
         */

        var sqlres=await ProjectInformation.select({projectID:req.query.projectID})
        if(sqlres.length==0||sqlres[0].projectStatue!=0) throw "The project is CLOSED or not existed"
         /**
          * check Auth
          */
         if(req.session.level==2){
            //Pass
         }else{
            var sqlres=await ProjectMember.select({memberID:userID,projectID:req.query.projectID});
            if(sqlres.length!=1||sqlres[0].memberType!=1) throw "Illegal Access!";   
         }
        ProjectInformation.update({projectID:req.query.projectID},{
            projectStatue:1,
            remarkPhase:'OPEN'
        })

        var sqlres=await ProjectMember.select({projectID:req.query.projectID});
        if(sqlres.length==0) throw "Invalid query on ProjectMember";

        var [userList,amountList,modtypeList]=[[],[],[]]
        for(var index=0;index<sqlres.length;index++){
            // get user's adddress in userinformation
            var addrRes=await UserInformation.select({userID:sqlres[index].memberID});
            userList.push(addrRes[0].userAddress);
            amountList.push(sqlres[index].frozenBalance);
            modtypeList.push(0);
        }
        /**
         * Use contract function to refund
         */
        ProjectMember.update({projectID:req.query.projectID},{frozenBalance:0})
        console.log('Refunding:',userList, amountList, modtypeList);
        await ContractFun.modifyBalance( userList, amountList, modtypeList)        
        res.json({'status':1});

    } catch (error) {
        console.log(error);
        res.json({status:'0',msg:'服务器错误'})                
    }
}

/**
 * 内置方法
 * @param {int} projectID 
 * @param {int} creatorID 
 * @return [memberNum,scoreList]
 */
async function getProScore(projectID,creatorID){
    try {
        var sqlres=await ScoreRecord.getScoreMemberNum(projectID);
        memberNum=sqlres[0].memberNum;
        if(memberNum==0) throw "illegal memNum"
        var scoreList=await ScoreRecord.queryScoreFinal(projectID);
        var sqlres=await ScoreRecord.select({projectID:projectID,scorerID:creatorID})
        var creatorScoreList={};
        for(var index in sqlres){
            creatorScoreList[sqlres[index].userID]={
                attitudeScore:sqlres[index].attitudeScore,
                designScore:sqlres[index].designScore,
                codeScore:sqlres[index].codeScore
            }
        }
        for(var index in scoreList){
            //获取创建者对该成员的评分，如果未评分，则获取当前的平均权值
            var creatorScore=creatorScoreList[scoreList[index].userID]==undefined?scoreList[index].attScore:
            creatorScoreList[scoreList[index].userID].attitudeScore;
            
            scoreList[index].attScore=parseInt(scoreList[index].attScore)+(memberNum)/2*parseInt(creatorScore)
            scoreList[index].attScore=parseInt(scoreList[index].attScore/(memberNum*1.5))

            var creatorScore=creatorScoreList[scoreList[index].userID]==undefined?scoreList[index].codScore:
            creatorScoreList[scoreList[index].userID].codeScore;
            scoreList[index].codScore=parseInt(scoreList[index].codScore)+(memberNum)/2*parseInt(creatorScore)
            scoreList[index].codScore=parseInt(scoreList[index].codScore/(memberNum*1.5))

            var creatorScore=creatorScoreList[scoreList[index].userID]==undefined?scoreList[index].desScore:
            creatorScoreList[scoreList[index].userID].designScore;            
            scoreList[index].desScore=parseInt(scoreList[index].desScore)+(memberNum)/2*parseInt(creatorScore)
            scoreList[index].desScore=parseInt(scoreList[index].desScore/(memberNum*1.5))        
            }      
            return [memberNum,scoreList];            
    } catch (error) {
        console.log(error);
        return [0,[]]
    }}

   /**
    * showdoc
    * @catalog 实训项目/项目管理
    * @title 确认评分_关闭评分阶段
    * @description 项目互评阶段开发期间，项目创建者调用该函数对评分进行最终确认，互评阶段将关闭，各成员的最后得分将被计入区块链中
    * @method get
    * @url 
    * @param projectID 必选 int 项目ID号
    * @return {"flag":true}
    * @return_param flag bool 操作结果、
    * @remark 备注：具有权限审查功能，事件发起者必须是项目的创建者；会检查当前的评分阶段是否开放;需调用智能合约函数;函数将根据ScoreRecord表中的数据根据特定公式计算评分
    * @number 0
    */   
exports.comfirmProScore=async(req,res,next)=>{
    try {
        if(null==req.session.userID) throw "Illegal Access"
        var userID=req.session.userID;

        /**
         * Check Auth
         */

        //  Check Phase
        var sqlres=await ProjectInformation.select({projectID:req.query.projectID});
        if(sqlres.length!=1) throw "Illegal ProjectID";
        var projectRow=sqlres[0];
        if(projectRow.remarkPhase!="OPEN") throw "Illegal Remark Phase: NOT OPEN";
        
        if(req.session.level==2){
            //Pass
         }else{
            var sqlres=await ProjectMember.select({memberID:userID,projectID:req.query.projectID});
            if(sqlres.length!=1||sqlres[0].memberType!=1) throw "Illegal Access!";   
        }

        var sqlres=await getProScore(req.query.projectID,projectRow.creatorID);
        var memberNum=sqlres[0]
        var scoreList=sqlres[1];
        if(memberNum==0) throw "illegal result from getProScore"
        var [idList,attList,codList,desList]=[[],[],[],[]]
        for(var index=0;index<scoreList.length;index++){
            ///Should Await be used HERE?
            await ProjectMember.update({projectID:req.query.projectID,memberID:scoreList[index].userID},{
                attitudeScore:scoreList[index].attScore,
                designScore:scoreList[index].desScore,
                codeScore:scoreList[index].codScore
        })
        idList.push(scoreList[index].userID);
        attList.push(scoreList[index].attScore);
        desList.push(scoreList[index].desScore);
        codList.push(scoreList[index].codScore);
        }
        ContractFun.emitScoreEvent(idList,attList,codList,desList,req.query.projectID,(new Date()).valueOf())
          //Emit Score Event On Chain                    
        await ProjectInformation.update({projectID:req.query.projectID},{
            remarkPhase:'COMPLETED'
        })

        res.json({status:1})
    } catch (error) {
        console.log(error);
        res.json({status:'0',msg:'服务器错误'})                        
    }
}

   /**
    * showdoc
    * @catalog 实训项目/项目管理
    * @title 查询项目最终得分
    * @description 项目互评阶段开发期间，可查询拟定的项目各成员最终得分
    * @method get
    * @url 
    * @param projectID 必选 int 项目ID号
    * @return {"status":true}
    * @return_param status bool 操作结果
    * @remark 备注：当没有有效评分人数时回返回操作结果错误 会检查权限
    * @number 0
    */   
exports.queryProScore=async(req,res)=>{
    try {
        /**
         * Check Auth
         */
        if(null==req.session.userID) throw "Illegal Access"
        var projectRow=await ProjectInformation.select({projectID:req.query.projectID})
        if(projectRow.length!=1) throw "Illegal projectID";
        if(projectRow[0].remarkPhase!="OPEN")
        if(req.session.level==2){
            //Pass
         }else{
            var sqlres=await ProjectMember.select({memberID:req.session.userID,projectID:req.query.projectID});
            if(sqlres.length!=1||sqlres[0].memberType!=1) throw "Illegal Access!";   
        }

        var sqlres=await getProScore(req.query.projectID,projectRow[0].creatorID);
        res.json({status:'1',memberNum:sqlres[0],scoreList:sqlres[1]});                                

    } catch (error) {
        console.log(error);
        res.json({status:'0',msg:'服务器错误'})                                
    }
}

    /**
* showdoc
* @catalog 实训项目/项目管理
* @title 删除项目成员
* @description 项目创建人或管理员从项目中移除一名用户（用户不可以是项目创建人本人
* @method get
* @url 
* @param projectID 必选 int 项目ID号
* @param memberID 必选 int 成员ID号
* @return 
* @return_param flag bool 操作结果、
* @remark 备注：具有权限审查功能;发起人必为项目创建者或管理员;需要调用智能合约函数;对应成员已有的冻结资产会被返回至成员当前的钱包中;不能够在已关闭的项目中删除成员;不能删除一个项目创建者
* @number 0
*/     
exports.deleteProjectMember=async(req,res)=>{
    try {
        var userID=req.session.userID;
        if(null==req.query.projectID||null==userID||null==req.query.memberID) throw "Invalid parameter in deleteProjectMember"
        
        // Check Auth
        var sqlres=await ProjectMember.select({memberID:userID,projectID:req.query.projectID});
        if(sqlres.length!=1||sqlres[0].memberType!=1) throw "Illegal Access!";

        // Check Auth


        // Check project statue
        var sqlres=await ProjectInformation.select({projectID:req.query.projectID});
        if(sqlres[0].projectStatue!=0) throw "Project is not open"

        var sqlres=await ProjectMember.select({projectID:req.query.projectID,memberID:req.query.memberID})
        if(sqlres.length!=1||sqlres[0].memberType==1)
            throw "Invalid request on deleteProMmeber"
        var memberRow=sqlres[0];

        var sqlres=await UserInformation.select({userID:req.query.memberID});
        var userRow=sqlres[0];
        await ProjectMember.delete({memberID:req.query.memberID,projectID:req.query.projectID})
        // Refund
        await ContractFun.modifyBalance([userRow.userAddress],[memberRow.frozenBalance], [0])


    } catch (error) {
        console.log(error);
        res.json({status:'0',msg:'服务器错误'})               
    }
}



      /**
    * showdoc
    * @catalog 实训项目/项目管理
    * @title 登记项目状态
    * @description 项目创建人发起项目登记申请，站点将调取数据库中项目的相关信息并将其登记入区块链事件
    * @method post
    * @url /api/project/projectmanagement/registerProjectState
    * @param projectID 必选 int 项目ID号
    * @return {"flag":true}
    * @return_param flag bool 操作结果、
    * @remark 备注：具有权限审查功能;发起人必须为项目创建者或管理员;需要调用智能合约函数
    * @number 0
    */      
   exports.registerProjectState=async function(req, res, next) {
    try {
            ///Try to get userID

            var userID=req.session.userID
            if(null==req.body.projectID||null==userID) throw "Invalid projectID/userID!"
            // var cntaccessLevel=await utils_accessLevel.getCntaccessLevel(req.session.userID)            
            
            ///Check Auth :user must be creator of the project or an admin
            if(req.session.level==2){
                //Pass
             }else{
                var sqlres=await ProjectMember.select({memberID:userID,projectID:req.body.projectID});
                if(sqlres.length!=1||sqlres[0].memberType!=1) throw "Illegal Access!";   
            }
            ///Check Auth    
            ///Check Phase

            //Gen project State
            var sqlres=await ProjectInformation.getProjectDetail(req.body.projectID);
            var sqlres2=sqlres.ProjectMembers; 
            var [MemberList,FrozenBalanceList]=[[],[]];
            // console.log(sqlres2);
            for(var index in sqlres2){
            MemberList.push(sqlres2[index].memberID);
            FrozenBalanceList.push(sqlres2[index].frozenBalance);
            }
            if(sqlres.projectIntro==null){
                sqlres.projectIntro="无介绍内容。";
            }
            //Gen project State
            ContractFun.emitProjectRegisterEvent(
            sqlres.creatorID,req.body.projectID,(new Date()).valueOf(),
            sqlres.projectType,sqlres.projectName,sqlres.projectIntro,
            sqlres.projectField,MemberList,FrozenBalanceList);
            //Emit project State Event On Chain 
        
            console.log('Trying to emit project current statue on chain...')
            res.jsonp({'status':1});
        } catch (error) {
            console.log(error);
            res.jsonp({'status':0,'msg':'服务器错误'});
        }finally{
            res.end();
        }
    }

/**
 * 修改项目信息-需检查权限（POST)
 */
exports.modifyProject=async function(req,res){
    try {
        var userID=req.session.userID
        if(null==req.body.projectID||null==userID) throw "Invalid projectID/userID!"
        // var cntaccessLevel=await utils_accessLevel.getCntaccessLevel(req.session.userID)            
        
        ///Check Auth :user must be creator of the project or an admin
        if(req.session.level==2){
            //Pass
         }else{
            var sqlres=await ProjectMember.select({memberID:userID,projectID:req.body.projectID});
            if(sqlres.length!=1||sqlres[0].memberType!=1) throw "Illegal Access!";   
        }
        var dict={};
        if(req.body.projectField!=null){
            dict.projectField=req.body.projectField
        }
        if(req.body.projectName!=null){
            dict.projectName=req.body.projectName
        }        
        if(req.body.projectFee!=null){
            dict.projectFee=req.body.projectFee
        }    
        if(req.body.projectIntro!=null){
            dict.projectIntro=req.body.projectIntro
        }                
        var sqlres=await ProjectInformation.update({projectID:req.body.projectID},{dict});
        res.jsonp({'status':1});
    } catch (error) {
        console.log(error);
        res.jsonp({'status':0,'msg':'服务器错误'});    
    }
}

/**
 * 修改项目封面-需检查权限(POST)
 */
exports.updateAvatar = async (req, res) => {
    // console.log('UploadData:',req);
    if (req.session.userID === undefined) {
        res.json({status: 0, msg: '非法请求'})
    } else {
     
        /* 验证通过，执行上传 */
        uploadImg(req, res, async (err) => {
            /* 文件是否合法 */
            // console.log(req.body);
            if(req.body.projectID == null) throw "Illegal ProjectID"
            if(req.session.level==2){
                //Pass
             }else{
                var sqlres=await ProjectMember.select({memberID:req.session.userID,projectID:req.body.projectID});
                if(sqlres.length!=1||sqlres[0].memberType!=1) throw "Illegal Access!";   
            }               
            /* 上传的文件没有错误，且成功上传*/
            if (err === undefined && req['file'] !== undefined) {
                /* 如果头像已经存在，则在数据库中得到头像地址 */
                const projectID=req.body.projectID;
                await ProjectInformation.select({projectID: projectID}).then(async (rows) => {
                    // if (rows[0].avatarUrl !== null) {
                    //     /* 删除原来的头像 */
                    //     deleteFile.unLink(`public/${rows[0].avatarUrl}`);
                    // }
                    /* 新的头像地址 */
                    const avatar = `/images/projectpic/${req['file'].filename}`;
                    /* 更新头像地址 */
                    await ProjectInformation.update({projectID: projectID}, {projectPic: avatar}).then(() => {
                        res.json({status: 1, avatarUrl: avatar, msg: '上传成功'});
                    })
                }).catch((error) => {
                    console.log(error);
                    res.json({status: 0, msg: '服务器错误'})
                });
            }
            /* 上传失败时的错误（直接前端传过来的文件） */
            else if (err !== undefined) {
                let msg = "未知错误";
                switch (err.message) {
                    case 'Unexpected field':
                        msg = "非法文件请求";
                        break;
                    case 'ErrorMimetype':
                        msg = "上传文件类型错误";
                        break;
                }
                res.json({status: 0, msg: msg})
            }
            /* 用POSTMEN测试上传文件时,err为undefined，
            此时req['file']也为undefined，文件并没有上传成功 */
            else {
                res.json({status: 0, msg: '文件错误'});
            }
        })
    }
};