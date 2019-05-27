
const {ProjectRewardRecord, ProjectInformation,UserInformation} = require('../model/create-table');
const Op = require('sequelize').Op;

/**
 * 处理查询的 where 语句
 * 
 * rewardID:申请记录号ID
 * userID:受奖励人ID
 * projectID:项目ID
 * awardType:奖惩类型
 * senderID:颁发者ID
 */
function dealWhere(rewardID,userID,projectID,awardType,senderID) {
    let whereCase = {};
    if (rewardID !== undefined && !isNaN(parseInt(rewardID)))
        whereCase.rewardID = rewardID;
    if (userID !== undefined && !isNaN(parseInt(userID)))
        whereCase.userID = userID;        
    if (projectID !== undefined && !isNaN(parseInt(projectID)))
        whereCase.projectID = projectID;
    if (awardType !== undefined && !isNaN(parseInt(awardType)))
        whereCase.awardType = awardType;
    if (senderID !== undefined && !isNaN(parseInt(senderID)))
        whereCase.senderID = senderID;

    return JSON.stringify(whereCase) === '{}' ? undefined : whereCase;
}


/**
 * 获取申请记录
 */
exports.select = where => {
    return ProjectRewardRecord.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: where,
        raw: true
    })
};

/**
 * 获取指定条件的项目总数
 * rewardID:申请记录号ID
 * userID:受奖励人ID
 * projectID:项目ID
 * awardType:奖惩类型
 * applyStatue:申请状态
 * senderID:颁奖人ID
 */
exports.selectCount = (rewardID,userID,projectID,awardType,senderID) => {
    let where = dealWhere(rewardID,userID,projectID,awardType,senderID);
    let object = where === undefined ? {} : where;
    return ProjectRewardRecord.count({where:object});
};

/**
 * 获取指定条件的课程
 * rewardID:申请记录号ID
 * userID:受奖励人ID
 * projectID:项目ID
 * awardType:奖惩类型
 * applyStatue:申请状态
 * senderID:颁奖人ID
 * @param page 分页
 */
exports.selectRecord = (rewardID,userID,projectID,awardType,senderID, page) => {
    let where = dealWhere(rewardID,userID,projectID,awardType,senderID);
    // let order = dealOrder(sort);
    let offset = !isNaN(parseInt(page)) ? parseInt(page) : 1;
    let object = {
        attributes: {exclude: ['createdAt', 'updatedAt']},
        // include: [{
        //     attributes: ['userID','nickname'],
        //     model: UserInformation,
        // },{
        //     attributes: ['projectID','projectName'],
        //     model: ProjectInformation,
        // }],
        limit: 10, offset: (10 * (offset - 1))
    };
    if (where !== undefined) object.where = where;
    // if (order !== undefined) object.order = order;
    // return ProjectRewardRecord.findAll(object);
    ProjectRewardRecord.findAll(object).then( async function(res){
        for(item of res){
            var rewardRecordItem=item;
            var getRes=await rewardRecordItem.getUserInformation(
                {
                    attributes:['nickname','userID']
                }
            ).then(then2await);
            rewardRecordItem.dataValues.UserInformation=getRes.dataValues;
            var getRes=await rewardRecordItem.getProjectInformation(
                {
                    attributes:['projectID','projectName'],
                }
            ).then(then2await);
            rewardRecordItem.dataValues.ProjectInformation=getRes.dataValues;            
        }
        return new Promise(function(resolve,reject){
            resolve(res)
        });
    });      
};

/**
 * 获取推荐项目
 */
// exports.selectReCourse = () => {
//     return ProjectRewardRecord.findAll({
//         order: [['applyCount', 'DESC']],
//         offset: 0,
//         limit: 8
//     })
// };

/**
 * 更新
 */
exports.update = (where, rows) => {
    return ProjectRewardRecord.update(rows, {where: where})
};

exports.insert = (value) => {
    return ProjectRewardRecord.create(value)
};
