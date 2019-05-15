const CreateApplyRecord=require('../../service/project-createrecord')
const PaymentRecord=require('../../service/project-paymentrecord')
/**
* showdoc
* @catalog 实训项目/项目创建申请
* @title 获取项目申请记录页数
* @description 获取项目申请记录页数
* @method post
* @url 
* @param applyID 选填 int 记录ID号
* @param userID 选填 int 用户ID
* @param projectField 选填 int 项目领域
* @param applyStatue 选填 string 申请状态
* @param paymentID 选填 int 支付ID号
* @return 
* @return_param {status: 1, count: count}、
* @remark 备注：需要补充权限审查功能;只有教师可以创建项目申请，管理员、学生不可
* @number 0
*/  
exports.getRecordCount = async (req, res) => {
    const applyID = req.body.applyID;
    const userID = req.body.userID;
    const projectField = req.body.projectField;
    const applyStatue = req.body.applyStatue;
    const paymentID = req.body.paymentID;
    await CreateApplyRecord.selectCount(applyID,userID,projectField,applyStatue,paymentID).then((count) => {
        res.json({status: 1, count: count})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    })
};

 /**
* showdoc
* @catalog 实训项目/项目创建申请
* @title 获取项目申请记录列表
* @description 获取项目申请记录列表
* @method get
* @url 
* @param applyID 选填 int 记录ID号
* @param userID 选填 int 用户ID
* @param projectField 选填 int 项目领域
* @param applyStatue 选填 string 申请状态
* @param paymentID 选填 int 支付ID号
* @param page 选填 int 页号
* @return 
* @return_param {status: 1, record: rows}
* @remark 备注：需要补充权限审查功能;只有教师可以创建项目申请，管理员、学生不可
* @number 0
*/  
exports.getRecord = async (req, res) => {
    const applyID = req.query.applyID;
    const userID = req.query.userID;
    const projectField = req.query.projectField;
    const applyStatue = req.query.applyStatue;
    const paymentID = req.query.paymentID;
    const page = req.query.page;
    await CreateApplyRecord.selectRecord(applyID,userID,projectField,applyStatue,paymentID, page).then((rows) => {
        res.json({status: 1, record: rows})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    });
};

      /**
    * showdoc
    * @catalog 实训项目/项目创建申请
    * @title 提交项目创建申请
    * @description 提交项目创建申请
    * @method post
    * @url 
    * @param projectFee 必选 string 项目费用
    * @param projectField 必选 int 项目方向
    * @param projectIntro 必选 string 项目介绍
    * @param projectName 必选 string 项目名称
    * @param projectPic 必选 string 图片url地址
    * @return 
    * @return_param {status: 1}
    * @remark 备注：需要补充权限审查功能;只有教师可以创建项目申请，管理员、学生不可
    * @number 0
    */  
exports.createApply=async(req,res)=>{
    try{
        var userID=req.session.userID;
        if(null==userID) throw 'Illegal Access';
        var sqlRes=await CreateApplyRecord.insert({
            userID:userID, applyType:'PROJECT', projectType:0, 
            projectFee:req.body.projectFee, projectName:req.body.projectName, projectPic:req.body.projectPic, projectIntro:req.body.projectIntro, 
            projectField:req.body.projectField,paymentID:null,applyStatue:"WAITING"
        });
        console.log(sqlRes.dataValues.applyID);
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
    * @catalog 实训项目/项目创建申请
    * @title 拒绝项目创建申请
    * @description 根据ApplyID，拒绝一个项目创建申请
    * @method get
    * @url 
    * @param applyId 必选 int 申请ID号
    * @return {"flag":true}
    * @return_param flag bool 查询结果、
    * @remark 备注：需要补充权限审查功能;将申请状态由WAITING转为REJECTED
    * @number 0
    */   
exports.rejectApply=async(req,res)=>{
    try{
        var userID=req.session.userID;
        if(null==userID) throw 'Illegal Access';
        /**
         * 权限检查
         */
        var sqlRes=await CreateApplyRecord.select({applyID:req.query.applyID});
        if(sqlRes.length!=1||sqlRes[0].applyStatue!='WAITING') throw 'Illegal Operation: Wrong ApplyStatue or Invalid applyID'
        var sqlRes=await CreateApplyRecord.update({applyID:req.query.applyID},{applyStatue:'REJECTED'})
        // console.log(sqlRes);
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
    * @catalog 实训项目/项目创建申请
    * @title 同意项目创建申请
    * @description 根据ApplyID，同意一个项目创建申请
    * @method get
    * @url 
    * @param applyID 必选 int 申请ID号
    * @return {"flag":true}
    * @return_param flag bool 查询结果、
    * @remark 备注：需要补充权限审查功能(已实现);将申请状态由WAITING转为PENDING，并创建一个相关的支付事件
    * @number 0
    */  
   exports.agreeApply=async(req,res)=>{
    try{
        var userID=req.session.userID;
        if(null==userID) throw 'Illegal Access';
        /**
         * 权限检查
         */
        var sqlRes=await CreateApplyRecord.select({applyID:req.query.applyID});
        if(sqlRes.length!=1||sqlRes[0].applyStatue!='WAITING') throw 'Illegal Operation: Wrong ApplyStatue or Invalid applyID'
        var dataRow=sqlRes[0];
        
        console.log(sqlRes);
        /**
         * 添加相关支付事件
         */
        var paymentRow=await PaymentRecord.insert({
          payType:"C",
          relateEvent:dataRow.applyType,
          payAmount:dataRow.projectFee,
          userID:dataRow.userID,
          payStatue:0,
        })

        await CreateApplyRecord.update({
            applyID:req.query.applyID
        },{
            paymentID:paymentRow.dataValues.paymentID,
            applyStatue:'PENDING'
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
* @catalog 实训项目/项目创建申请
* @title 取消项目创建申请
* @description 根据ApplyID，取消一个项目创建申请
* @method get
* @url /api/project/createapply/createProjectCancel
* @param applyId 必选 int 申请ID号
* @return {"flag":true}
* @return_param flag bool 查询结果、
* @remark 备注：需要补充权限审查功能(已实现);将申请状态由PENDING转为CANCEL，并删除相关的支付事件
* @number 1
*/    
exports.cancelApply=async(req,res)=>{
    try{
        var userID=req.session.userID;
        if(null==userID) throw 'Illegal Access';
        /**
         * 权限检查
         */
        var sqlRes=await CreateApplyRecord.select({applyID:req.query.applyID});
        if(sqlRes.length!=1||sqlRes[0].applyStatue!='PENDING') throw 'Illegal Operation: Wrong ApplyStatue or Invalid applyID'
        var delID=sqlRes[0].paymentID;
        var sqlRes=await CreateApplyRecord.update({applyID:req.query.applyID},{paymentID:null,applyStatue:'CANCEL'})
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
