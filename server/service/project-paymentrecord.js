
const {ProjectPaymentRecord, UserInformation,ProjectInformation} = require('../model/create-table');
const Op = require('sequelize').Op;

/**
 * 处理查询的 where 语句
 * 
 * paymentID:申请记录号ID
 * userID:申请人ID
 * payStatue:支付状态
 * objectID:投资项目
 * payType:支付类型 C/A/O (创建/参加/其他)
 * relateEvent:相关事件：COURSE/PROJECT
 */
function dealWhere(paymentID,userID,payStatue,objectID,payType,relateEvent) {
    let whereCase = {};
    if (paymentID !== undefined && !isNaN(parseInt(paymentID)))
        whereCase.paymentID = paymentID;
    if (userID !== undefined && !isNaN(parseInt(userID)))
        whereCase.userID = userID;     
    if (payStatue !== undefined && !isNaN(parseInt(payStatue)))
        whereCase.payStatue = payStatue;     
    if (objectID !== undefined && !isNaN(parseInt(objectID)))
        whereCase.objectID = objectID;        
    if (payType !== undefined)
        whereCase.payType = payType;
    if (relateEvent !== undefined )
        whereCase.relateEvent = relateEvent;

    return JSON.stringify(whereCase) === '{}' ? undefined : whereCase;
}


/**
 * 获取申请记录
 */
exports.select = where => {
    return ProjectPaymentRecord.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: where,
        raw: true
    })
};

/**
 * 获取指定条件的支付记录总数
 * paymentID:申请记录号ID
 * userID:申请人ID
 * payStatue:支付状态
 * objectID:投资项目
 * payType:支付类型 C/A/O (创建/参加/其他)
 * relateEvent:相关事件：COURSE/PROJECT
 */
exports.selectCount = (paymentID,userID,payStatue,objectID,payType,relateEvent) => {
    let where = dealWhere(paymentID,userID,payStatue,objectID,payType,relateEvent);
    let object = where === undefined ? {} : where;
    console.log(object);
    return ProjectPaymentRecord.count({where:object});
};


/**
 * 获取指定条件的支付记录总数
 * paymentID:申请记录号ID
 * userID:申请人ID
 * payStatue:支付状态
 * objectID:投资项目
 * payType:支付类型 C/A/O (创建/参加/其他)
 * relateEvent:相关事件：COURSE/PROJECT
 */
exports.selectRecord = async (paymentID,userID,payStatue,objectID,payType,relateEvent, page) => {
    let where = dealWhere(paymentID,userID,payStatue,objectID,payType,relateEvent);
    // let order = dealOrder(sort);
    let offset = !isNaN(parseInt(page)) ? parseInt(page) : 1;
    let object = {
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [{
            attributes: ['userID','nickName'],
            model: UserInformation,
            as:'PaymentSender',
        }],
        limit: 10, offset: (10 * (offset - 1))
    };
    if (where !== undefined) object.where = where;
    // if (order !== undefined) object.order = order;
    // return ProjectPaymentRecord.findAll(object)
    var res=await ProjectPaymentRecord.findAll(object).then(then2await);
    for(item of res){
        var paymentRecordItem=item;
        var getRes=await paymentRecordItem.getPaymentInProject(
            {
                attributes:['projectID','projectName']
            }
        ).then(then2await);
        // 支付请求与项目投资有关，获取所投资的项目信息
        if(getRes!=null) paymentRecordItem.dataValues.InvestProject=getRes.dataValues;

        // 查询参加申请未内联项目信息表时，进行再查询。
        var getRes=await paymentRecordItem.getPaymentInCreateRecord(
            {
                attributes: ['applyID','projectName'],
            }
        ).then(then2await);
        // 支付请求与创建项目有关，获取所创建项目的基本信息
        if(getRes!=null) paymentRecordItem.dataValues.CreateApply=getRes.dataValues;       
        var getRes=await paymentRecordItem.getPaymentInApplyRecord(
            {
                attributes: ['projectID'],
            }
        ).then(then2await);
        // 支付请求与参加项目有关，获取所参加项目的基本信息
        if(getRes!=null){
            var projectInformationRes=await ProjectInformation.findOne({
                where:{projectID:getRes.dataValues.projectID},
                attributes:['projectID','projectName'],
            });
            // console.log(projectInformationRes);
            paymentRecordItem.dataValues.AttendApply=projectInformationRes.dataValues;     
        }            
    }    
    return res;

};

/**
 * 获取推荐项目
 */
// exports.selectReCourse = () => {
//     return ProjectPaymentRecord.findAll({
//         order: [['applyCount', 'DESC']],
//         offset: 0,
//         limit: 8
//     })
// };

/**
 * 更新
 */
exports.update = (where, rows) => {
    return ProjectPaymentRecord.update(rows, {where: where})
};

exports.insert = (value) => {
    return ProjectPaymentRecord.create(value)
};

exports.delete = (where)=>{
    return ProjectPaymentRecord.destroy({where:where})
}