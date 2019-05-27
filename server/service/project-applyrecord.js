
const {ProjectApplyRecord, ProjectInformation,UserInformation} = require('../model/create-table');
const Op = require('sequelize').Op;

/**
 * 处理查询的 where 语句
 * 
 * applyID:申请记录号ID
 * userID:申请人ID
 * projectID:项目ID
 * applyStatue:申请状态
 * paymentID:支付ID
 */
function dealWhere(applyID,userID,projectID,applyStatue,paymentID) {
    let whereCase = {};
    if (applyID !== undefined && !isNaN(parseInt(applyID)))
        whereCase.applyID = applyID;
    if (userID !== undefined && !isNaN(parseInt(userID)))
        whereCase.userID = userID;        
    if (projectID !== undefined && !isNaN(parseInt(projectID)))
        whereCase.projectID = projectID;
    if (applyStatue !== undefined )
        whereCase.applyStatue = applyStatue;
    if (paymentID !== undefined && !isNaN(parseInt(paymentID)))
        whereCase.paymentID = paymentID;

    return JSON.stringify(whereCase) === '{}' ? undefined : whereCase;
}


/**
 * 获取申请记录
 */
exports.select = where => {
    return ProjectApplyRecord.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: where,
        raw: true
    })
};

/**
 * 获取指定条件的项目总数
 * applyID:申请记录号ID
 * userID:申请人ID
 * projectID:项目ID
 * applyStatue:申请状态
 * paymentID:支付ID
 * CreatorID:项目创建人iD 用于授权查询
 */
exports.selectCount = (applyID,userID,projectID,applyStatue,paymentID,creatorID=undefined) => {
    let where = dealWhere(applyID,userID,projectID,applyStatue,paymentID);
    let object = where === undefined ? {} : where;
    if(creatorID!=undefined){
        object["include"]=[{
            model:ProjectInformation,
            where:{creatorID},
            as:'ApplyInProject',
            attributes: ['projectID','projectName'],
        }]
    }
    return ProjectApplyRecord.count(object);
};

/**
 * 获取指定条件的课程
 * applyID:申请记录号ID
 * userID:申请人ID
 * projectID:项目ID
 * applyStatue:申请状态
 * paymentID:支付ID
 * creatorID:创建人ID（用于授权查询）
 * @param page 分页
 */
exports.selectRecord = async (applyID,userID,projectID,applyStatue,paymentID, page,creatorID=undefined) => {
    let where = dealWhere(applyID,userID,projectID,applyStatue,paymentID);
    // let order = dealOrder(sort);
    let offset = !isNaN(parseInt(page)) ? parseInt(page) : 1;
    let object = {
        attributes: {exclude: ['createdAt', 'updatedAt']},
        limit: 10, offset: (10 * (offset - 1))
    };
    if(creatorID!=undefined){
        object["include"]=[{
            attributes: ['projectID','projectName'],
            model:ProjectInformation,
            where:{creatorID},
            as:'ApplyInProject',
        }]
    }    
    if (where !== undefined) object.where = where;
    // if (order !== undefined) object.order = order;
    // return ProjectApplyRecord.findAll(object);
    var res=await ProjectApplyRecord.findAll(object).then(then2await);
    for(item of res){
        var applyRecordItem=item;
        var getRes=await applyRecordItem.getAttendApplySender(
            {
                attributes:['nickname','userID']
            }
        ).then(then2await);
        applyRecordItem.dataValues.ApplyerInfo=getRes.dataValues;
        // 查询参加申请未内联项目信息表时，进行再查询。
        if(creatorID==undefined){
            var getRes=await applyRecordItem.getApplyInProject(
                {
                    attributes: ['projectID','projectName'],
                }
            ).then(then2await);
            applyRecordItem.dataValues.ProjectInformation=getRes.dataValues;                
        }
    }    
    return res; 
};

/**
 * 获取推荐项目
 */
// exports.selectReCourse = () => {
//     return ProjectApplyRecord.findAll({
//         order: [['applyCount', 'DESC']],
//         offset: 0,
//         limit: 8
//     })
// };

/**
 * 更新
 */
exports.update = (where, rows) => {
    return ProjectApplyRecord.update(rows, {where: where})
};

exports.insert = (value) => {
    return ProjectApplyRecord.create(value)
};

/**
 * 查找用户是否已提交存在待审核或待支付的项目
 * projectID userID
 * 返回一个整数
 */
exports.findExistedApply=(where) =>{
    if(where.projectID === undefined||where.userID === undefined) return 0;
    where.applyStatue= {
        [Op.in]: ['PENDING','WAITING']
    };
    return ProjectApplyRecord.count({where:where})
};