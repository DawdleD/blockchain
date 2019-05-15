
const {ProjectCreateRecord, UserInformation} = require('../model/create-table');
const Op = require('sequelize').Op;
then2await=(gres)=>{return new Promise(function(resolve,reject){resolve(gres)})}

/**
 * 处理查询的 where 语句
 * 
 * applyID:申请记录号ID
 * userID:申请人ID
 * projectField 项目领域
 * applyStatue:申请状态
 * paymentID:支付ID
 */
function dealWhere(applyID,userID,projectField,applyStatue,paymentID) {
    let whereCase = {};
    if (userID !== undefined && !isNaN(parseInt(userID)))
        whereCase.userID = userID;
    if (projectField !== undefined && !isNaN(parseInt(projectField)))
        whereCase.projectField = projectField;
    if (applyID !== undefined && !isNaN(parseInt(applyID)))
        whereCase.applyID = applyID;
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
    return ProjectCreateRecord.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: where,
        raw: true
    })
};

/**
 * 获取指定条件的项目总数
 * applyID:申请记录号ID
 * userID:申请人ID
 * projectField 项目领域
 * applyStatue:申请状态
 * paymentID:支付ID
 */
exports.selectCount = (applyID,userID,projectField,applyStatue,paymentID) => {
    let where = dealWhere(applyID,userID,projectField,applyStatue,paymentID);
    let object = where === undefined ? {} : where;
    return ProjectCreateRecord.count({where:object});
};

/**
 * 获取指定条件的课程
 * applyID:申请记录号ID
 * userID:申请人ID
 * projectField 项目领域
 * applyStatue:申请状态
 * paymentID:支付ID
 * @param page 分页
 */
exports.selectRecord = async (applyID,userID,projectField,applyStatue,paymentID, page) => {
    let where = dealWhere(applyID,userID,projectField,applyStatue,paymentID);
    // let order = dealOrder(sort);
    let offset = !isNaN(parseInt(page)) ? parseInt(page) : 1;
    let object = {
        attributes: {exclude: ['createdAt', 'updatedAt']},
        limit: 10, offset: (10 * (offset - 1))
    };
    if (where !== undefined) object.where = where;
    // if (order !== undefined) object.order = order;
    // Instead Of Include: use GET
    var res=await ProjectCreateRecord.findAll(object).then(then2await);
    for(item of res){
        var createRecordItem=item
        var getRes=await createRecordItem.getCreateApplySender(
            {
                attributes:['nickName','userID']
            }
        ).then(then2await);
        createRecordItem.dataValues.ProjectCreator=getRes.dataValues;
    }
    return res;

};


/**
 * 更新
 */
exports.update = (where, rows) => {
    return ProjectCreateRecord.update(rows, {where: where})
};


exports.insert = (value) => {
    return ProjectCreateRecord.create(value)
};
