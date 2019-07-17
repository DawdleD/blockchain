const ProjectInfo = require('../../service/project-information');
const PaymentRecord=require('../../service/project-paymentrecord');
const ApplyRecord=require('../../service/project-applyrecord');
const CreateRecord=require('../../service/project-createrecord');
const ProjectMember=require('../../service/project-projectmember');

/**
 * 获取项目总页数
 * 方式:POST
 */
exports.getProjectCount = async (req, res) => {
    const field = req.body.field;
    const search = req.body.search;
    const projectID = req.body.projectID;
    // Wait
    const creatorID=req.body.creatorID;
    const userID=req.body.userID;

    await ProjectInfo.selectCount(field,creatorID, search,userID,projectID).then((count) => {
        res.json({status: 1, count: count})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    })
};

/**
 * 获取最新项目（首页）
 */
exports.getIndexProject= async(req,res)=>{
    try {
        var sqlres=await ProjectInfo.selectIndexProject();
        return res.json({status: 1, sqlres});            
    } catch (error) {
        console.log(error);
        res.json({status: 0, msg: '服务器错误'})        
    }
}

/**
 * 获取项目
 * 方式:Get
 */
exports.getProject = async (req, res) => {
    const field = req.query.projectField;
    const page = req.query.page;
    const search = req.query.search;
    const projectID=req.query.projectID;
    // Wait to be modified
    var creatorID=req.query.creatorID;
    // Wait 
    var userID=req.query.userID;
    try {
        var sqlres=await ProjectInfo.selectProject(field,creatorID, page, search, projectID,userID);
        // console.log(sqlres);
        res.json({status:1,sqlres});
    } catch (error) {
        console.log(error);
        res.json({status: 0, msg: '服务器错误'})

    }
};

/**
 * 获取课程（权限模式，供管理界面、个人中心页面使用
 * 方式:Get
 */
exports.getProjectAuthed = async (req, res) => {
    const field = req.query.projectField;
    const page = req.query.page;
    const search = req.query.search;
    const projectID=req.query.projectID;
    // Wait to be modified
    var creatorID=req.query.creatorID;
    // Wait 
    var userID=req.query.userID;
    // 学生用户 强制只能对自己参与的项目进行管理
    if(req.session.accessLevel==0){
        userID=req.session.userID;
        if(userID==null) throw "Illegal Access";
    }
    // 教师用户 强制只能对自己创建的项目进行管理
    else if(req.session.accessLevel==1){
        creatorID=req.session.userID;
        if(creatorID==null) throw "Illegal Access";
    }else if(req.session.accessLevel==null){
        throw "Illegal Access"
    }
    
    try {
        var sqlres=await ProjectInfo.selectProject(field,creatorID, page, search,projectID,userID,true);
        // console.log(sqlres);
        res.json({status:1,sqlres});
    } catch (error) {
        console.log(error);
        res.json({status: 0, msg: '服务器错误'})

    }
};
/**
 * 获取项目总页数（权限模式）
 * 方式:POST
 */
exports.getProjectCountAuthed = async (req, res) => {
    const field = req.body.field;
    const search = req.body.search;
    const projectID=req.query.projectID;
    // Wait
    var creatorID=req.body.creatorID;
    var userID=req.body.userID;
    // 学生用户 强制只能对自己参与的项目进行管理
    if(req.session.accessLevel==0){
        userID=req.session.userID;
        if(userID==null) throw "Illegal Access";        
    }
    else if(req.session.accessLevel==1){
        creatorID=req.session.userID;
        if(creatorID==null) throw "Illegal Access";
    }else if(req.session.accessLevel==null){
        throw "Illegal Access"
    }    
    await ProjectInfo.selectCount(field,creatorID, search,userID,projectID).then((count) => {
        res.json({status: 1, count: count})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    })
};

/**
 * 获取指定项目的详细信息
 * await Test
 */
exports.getProjectDetail = async (req, res) => {
    const projectID = req.query.projectID;
    await ProjectInfo.getProjectDetail(projectID).then((rows) => {
        res.json({status: 1, sqlres: rows})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    });
};

/**
 * 获取指定用户的详细项目信息
 */
exports.getMemberDetail = async (req, res) => {
    const userID = req.query.userID;
    await ProjectInfo.getMemberDetail(userID).then((rows) => {
        res.json({status: 1, sqlres: rows})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    });
};



// 支付请求

/**
 * 获取支付请求总页数
 * 方式:POST
 */
exports.getPaymentCount = async (req, res) => {
    const paymentID = req.body.paymentID;
    var userID = req.body.userID;
    const payStatue=req.body.payStatue;
    const objectID = req.body.objectID;
    const payType = req.body.payType;
    const relateEvent=req.body.relateEvent;
    // 管理员用户可以管理所有人的支付记录
    if(req.session.accessLevel!=3){
        userID=req.session.userID;
        if(userID==null) throw "Illegal Access";        
    }        
    await PaymentRecord.selectCount(paymentID,userID,payStatue,objectID,payType,relateEvent).then((count) => {
        res.json({status: 1, count: count})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    })
};

/**
 * 获取支付请求
 * 方式:Get
 */
exports.getPaymentRecord = async (req, res) => {
    const paymentID = req.query.paymentID;
    var userID = req.query.userID;
    const payStatue=req.query.payStatue;
    const objectID = req.query.objectID;
    const payType = req.query.payType;
    const relateEvent=req.query.relateEvent;  
    const page=req.query.page; 
    if(req.session.accessLevel!=3){
        userID=req.session.userID;
        if(userID==null) throw "Illegal Access";        
    }       
    await PaymentRecord.selectRecord(paymentID,userID,payStatue,objectID,payType,relateEvent, page).then((rows) => {
        res.json({status: 1, sqlres: rows})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    });
};


// 项目参加请求

/**
 * 获取项目参加请求总页数
 * 方式:POST
 */
exports.getAttendApplyCount = async (req, res) => {
    const paymentID = req.body.paymentID;
    var userID = req.body.userID;
    const applyID=req.body.applyID;
    const applyStatue = req.body.applyStatue;
    // wait
    var creatorID = req.body.creatorID;
    const projectID = req.body.projectID;
    // 用户为学生时，只能管理自己的项目参加申请
    if(req.session.accessLevel==0){
        userID=req.session.userID;
        if(userID==null) throw "Illegal Access";        
    }
    else if(req.session.accessLevel==1){
        creatorID=req.session.userID;
        if(creatorID==null) throw "Illegal Access";        
    }  
    await ApplyRecord.selectCount(applyID,userID,projectID,applyStatue,paymentID,creatorID).then((count) => {
        res.json({status: 1, count: count})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    })
};

/**
 * 获取项目参加请求
 * 方式:Get
 */
exports.getAttendApply = async (req, res) => {
    const paymentID = req.query.paymentID;
    var userID = req.query.userID;
    const applyID=req.query.applyID;
    const applyStatue = req.query.applyStatue;
    // wait
    var creatorID = req.query.creatorID;
    const projectID = req.query.projectID;
    const page=req.query.page;

    // 用户为学生时，只能管理自己的项目参加申请
    if(req.session.accessLevel==0){
        userID=req.session.userID;
        if(userID==null) throw "Illegal Access";        
    }    
    // 用户为教师时，智能管理自己创建项目的参加申请
    else if(req.session.accessLevel==1){
        creatorID=req.session.userID;
        if(creatorID==null) throw "Illegal Access";        
    }     
    await ApplyRecord.selectRecord(applyID,userID,projectID,applyStatue,paymentID,page,creatorID).then((rows) => {
        res.json({status: 1, sqlres: rows})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    });
};


// 项目创建请求

/**
 * 获取项目创建请求总页数
 * 方式:POST
 */
exports.getCreateApplyCount = async (req, res) => {
    const paymentID = req.body.paymentID;
    var userID = req.body.userID;
    const applyID=req.body.applyID;
    const applyStatue = req.body.applyStatue;
    // wait
    const projectField = req.body.projectField;
    if(req.session.accessLevel==1){
        userID=req.session.userID;
        if(userID==null) throw "Illegal Access";
    }else{
        throw "Illegal Access";
    }
    await CreateRecord.selectCount(applyID,userID,projectField,applyStatue,paymentID).then((count) => {
        res.json({status: 1, count: count})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    })
};

/**
 * 获取创建项目请求
 * 方式:Get
 */
exports.getCreateApply = async (req, res) => {
    const paymentID = req.query.paymentID;
    var userID = req.query.userID;
    const applyID=req.query.applyID;
    const applyStatue = req.query.applyStatue;
    // wait
    const projectField = req.query.projectField;
    const page=req.query.page;
    if(req.session.accessLevel==1){
        userID=req.session.userID;
        if(userID==null) throw "Illegal Access";
    }else{
        throw "Illegal Access";
    }
    await CreateRecord.selectRecord(applyID,userID,projectField,applyStatue,paymentID, page).then((rows) => {
        res.json({status: 1, sqlres: rows})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    });
};


// 项目成员

/**
 * 获取项目成员列表总页数
 * 方式:POST
 */
exports.getProjectMemberCount = async (req, res) => {
    const memberID = req.body.memberID;
    const projectID = req.body.projectID;
    const memberType=req.body.memberType;
    // Wait
    var creatorID = req.body.creatorID;

    await ProjectMember.selectProjectMemberCount(memberID,projectID,memberType,creatorID).then((count) => {
        res.json({status: 1, count: count})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    })
};

/**
 * 获取创建项目请求
 * 方式:Get
 */
exports.getProjectMember = async (req, res) => {
    const memberID = req.query.memberID;
    const projectID = req.query.projectID;
    const memberType=req.query.memberType;
    // Wait
    var creatorID = req.query.creatorID;
    const page=req.query.page;
    await ProjectMember.selectMember(memberID,projectID,memberType,page,creatorID).then((rows) => {
        res.json({status: 1, sqlres: rows})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    });
};
