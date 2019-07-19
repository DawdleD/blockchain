const AttendApplyRecord=require('../../service/project-applyrecord')
const PaymentRecord=require('../../service/project-paymentrecord')
const ProjectInformation=require('../../service/project-information')
const ProjectMember=require('../../service/project-projectmember')
/**
* showdoc
* @catalog 实训项目/项目参加申请
* @title 获取申请列表总页数
* @description 根据筛选参数，获取申请列表总页数
* @method post
* @url 
* @param applyID 选填 int 申请ID号
* @param userID 选填 int 用户ID
* @param projectID 选填 int 项目ID
* @param applyStatue 选填 int 申请状态
* @param paymentID 选填 int 支付ID号
* @return {status: 1, count: count}
* @return_param flag bool 查询结果、
* @remark 
* @number 0
*/       
exports.getRecordCount = async (req, res) => {
    // applyID,userID,projectID,applyStatue,paymentID
    const applyID = req.body.applyID;
    const userID = req.body.userID;
    const projectID = req.body.projectID;
    const applyStatue = req.body.applyStatue;
    const paymentID = req.body.paymentID;
    await AttendApplyRecord.selectCount(applyID,userID,projectID,applyStatue,paymentID).then((count) => {
        res.json({status: 1, count: count})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    })
};

/**
* showdoc
* @catalog 实训项目/项目参加申请
* @title 获取申请列表
* @description 根据筛选参数，获取申请列表
* @method get
* @url 
* @param applyID 选填 int 申请ID号
* @param userID 选填 int 用户ID
* @param projectID 选填 int 项目ID
* @param applyStatue 选填 int 申请状态
* @param paymentID 选填 int 支付ID号
* @return {status: 1, record: rows}
* @return_param flag bool 查询结果、
* @remark 
* @number 0
*/  
exports.getRecord = async (req, res) => {
    const applyID = req.query.applyID;
    const userID = req.query.userID;
    const projectID = req.query.projectID;
    const applyStatue = req.query.applyStatue;
    const paymentID = req.query.paymentID;
    await AttendApplyRecord.selectRecord(applyID,userID,projectID,applyStatue,paymentID, page).then((rows) => {
        res.json({status: 1, record: rows})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    });
};

/**
* showdoc
* @catalog 实训项目/项目参加申请
* @title 提交项目参加申请
* @description 提交项目参加申请
* @method post
* @url 
* @param projectID 必选 int 报名项目ID
* @return {status: 1}
* @return_param flag bool 查询结果、
* @remark 备注：需要补充权限审查功能;只有教师可以创建项目申请，管理员、学生不可
* @number 0
*/  
exports.createApply=async(req,res)=>{
    try{
        var userID=req.session.userID;
        if(null==userID) throw 'Illegal Access';
        var existApply=await AttendApplyRecord.findExistedApply({projectID:req.body.projectID,userID:userID});
        if(existApply!=0) throw 'Apply Existed';
        var existedMember=await ProjectMember.selectCount({projectID:req.body.projectID,memberID:userID});
        if(existedMember!=0) throw 'Member Existed';
        var sqlRes=await ProjectInformation.select({projectID:req.body.projectID});
        if(sqlRes.length!=1) throw "Invalid ProjectID";
        // 检查课程是否开放
        if(sqlRes.projectStatue!=0) throw "Course is closed";
        /**
         * 检查ProjectMember中用户是否已参加项目
         */
        var sqlRes=await AttendApplyRecord.insert({
            projectID:req.body.projectID,userID:userID,applyType:'PROJECT',
            paymentID:null,applyStatue:'WAITING'
        });
        res.json({status: 1})
    } catch (error) {
        console.log(error);
        res.json({status:0,'msg':'服务器错误'});
      }finally{
        res.end();
      }
};

      /**
    * showdoc
    * @catalog 实训项目/项目参加申请
    * @title 拒绝项目参加申请
    * @description 根据ApplyID，拒绝一个项目参加申请
    * @method get
    * @url 
    * @param applyId 必选 int 申请ID号
    * @return {status: 1}
    * @return_param flag bool 查询结果、
    * @remark 备注：需要补充权限审查功能;将申请状态由WAITING转为REJECTED
    * @number 0
    */   
exports.rejectApply=async(req,res)=>{
    try{
        var userID=req.session.userID;
        if(null==userID) throw 'Illegal Access';

        var sqlRes=await AttendApplyRecord.select({applyID:req.query.applyID});
        if(sqlRes.length!=1||sqlRes[0].applyStatue!='WAITING') throw 'Illegal Operation: Wrong ApplyStatue or Invalid applyID'
        /**
         * 权限检查
         */
        var memberRes=await ProjectMember.select({memberID:req.session.userID,projectID:sqlres[0].projectID})
        if (!(req.session.level==2||(memberRes.length==1&&memberRes[0].memberType==1))){
            throw "Illegal Access!"
        }
        /**
         * 权限检查
         */        
        var sqlRes=await AttendApplyRecord.update({applyID:req.query.applyID},{applyStatue:'REJECTED'})
        console.log(sqlRes);
        res.json({status: 1})
    } catch (error) {
        console.log(error);
        res.json({status:0,'msg':'服务器错误'});
      }finally{
        res.end();
      }

};


      /**
    * showdoc
    * @catalog 实训项目/项目参加申请
    * @title 同意项目参加申请
    * @description 根据ApplyID，同意一个项目参加申请
    * @method get
    * @url 
    * @param applyId 必选 int 申请ID号
    * @return {status: 1}
    * @return_param flag bool 查询结果、
    * @remark 备注：需要补充权限审查功能(已实现);将申请状态由WAITING转为PENDING，并创建一个相关的支付事件
    * @number 0
    */  
   exports.agreeApply=async(req,res)=>{
    try{
        var userID=req.session.userID;
        if(null==userID) throw 'Illegal Access';


        var sqlRes=await AttendApplyRecord.select({applyID:req.query.applyID});
        if(sqlRes.length!=1||sqlRes[0].applyStatue!='WAITING') throw 'Illegal Operation: Wrong ApplyStatue or Invalid applyID'

        /**
         * 权限检查
         */
        var memberRes=await ProjectMember.select({memberID:req.session.userID,projectID:sqlRes[0].projectID})
        if (!(req.session.level==2||(memberRes.length==1&&memberRes[0].memberType==1))){
            throw "Illegal Access!"
        }
        /**
         * 权限检查完成
         */  
        var dataRow=sqlRes[0];
        var sqlRes=await ProjectInformation.select({projectID:dataRow.projectID});
        /**
         * 添加相关支付事件、更新申请状态
         */

        // 获取项目信息
        var projectRow=sqlRes[0];
        // 根据申请信息、项目信息创建支付信息
        var paymentRow=await PaymentRecord.insert({
            payType:"A",
            relateEvent:dataRow.applyType,
            payAmount:projectRow.projectFee,
            userID:dataRow.userID,
            payStatue:0,
        })      
        // 创建项目信息
        await AttendApplyRecord.update({applyID:req.query.applyID},{
            paymentID:paymentRow.dataValues.paymentID,
            applyStatue:'PENDING'
        })
       
        res.json({status: 1})
    } catch (error) {
        console.log(error);
        res.json({status:0,'msg':'服务器错误'});
      }finally{
        res.end();
      }
};

    /**
* showdoc
* @catalog 实训项目/项目参加申请
* @title 取消项目参加申请
* @description 根据ApplyID，取消一个项目参加申请
* @method get
* @url /api/project/createapply/createProjectCancel
* @param applyId 必选 int 申请ID号
* @return {status: 1}
* @return_param flag bool 查询结果、
* @remark 备注：需要补充权限审查功能;将申请状态由PENDING转为CANCEL，并删除相关的支付事件
* @number 1
*/    
exports.cancelApply=async(req,res)=>{
    try{
        var userID=req.session.userID;
        if(null==userID) throw 'Illegal Access';
        /**
         * 权限检查
         */
        var sqlRes=await AttendApplyRecord.select({applyID:req.query.applyID});
        if(sqlRes.length!=1||sqlRes[0].applyStatue!='PENDING') throw 'Illegal Operation: Wrong ApplyStatue or Invalid applyID'
        var delID=sqlRes[0].paymentID;
        var sqlRes=await AttendApplyRecord.update({applyID:req.query.applyID},{paymentID:null,applyStatue:'CANCEL'})
        console.log(sqlRes);
        /**
         * 删除相关支付事件
         */
        await PaymentRecord.delete({paymentID:delID});
        res.json({status: 1})
    } catch (error) {
        console.log(error);
        res.json({status:0,'msg':'服务器错误'});
      }finally{
        res.end();
      }
};
