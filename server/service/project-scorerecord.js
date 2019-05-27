
const {ProjectScoreRecord, ProjectInformation,UserInformation} = require('../model/create-table');
const Op = require('sequelize').Op;
const Sequelize=require('sequelize');
const sequelizeInstance = require('../config/database');

/**
 * 处理查询的 where 语句
 * 
 * userID:受奖励人ID
 * projectID:项目ID
 * scorerID:评分人ID
 */
function dealWhere(userID,projectID,scorerID) {
    let whereCase = {};
    if (userID !== undefined && !isNaN(parseInt(userID)))
        whereCase.userID = userID;
    if (projectID !== undefined && !isNaN(parseInt(projectID)))
        whereCase.projectID = projectID;        
    if (scorerID !== undefined && !isNaN(parseInt(scorerID)))
        whereCase.scorerID = scorerID;

    return JSON.stringify(whereCase) === '{}' ? undefined : whereCase;
}


/**
 * 获取申请记录
 */
exports.select = where => {
    return ProjectScoreRecord.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: where,
        raw: true
    })
};

/**
 * 获取指定条件的项目总数
 * userID:受奖励人ID
 * projectID:项目ID
 * scorerID:评分人ID
 */
exports.selectCount = (userID,projectID,scorerID) => {
    let where = dealWhere(userID,projectID,scorerID);
    let object = where === undefined ? {} : where;
    return ProjectScoreRecord.count({where:object});
};

/**
 * 获取指定条件的课程
 * userID:受奖励人ID
 * projectID:项目ID
 * scorerID:评分人ID
 * @param page 分页
 */
exports.selectApplyRecord = (userID,projectID,scorerID, page) => {
    let where = dealWhere(userID,projectID,scorerID);
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
    // return ProjectScoreRecord.findAll(object)
    // Instead Of Include: use GET
    ProjectScoreRecord.findAll(object).then( async function(res){
        for(item of res){
            var scoreRecordItem=item;
            var getRes=await scoreRecordItem.getUserInformation(
                {
                    attributes:['nickname','userID']
                }
            ).then(then2await);
            scoreRecordItem.dataValues.UserInformation=getRes.dataValues;
            var getRes=await scoreRecordItem.getProjectInformation(
                {
                    attributes:['projectID','projectName'],
                }
            ).then(then2await);
            scoreRecordItem.dataValues.ProjectInformation=getRes.dataValues;            
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
//     return ProjectScoreRecord.findAll({
//         order: [['applyCount', 'DESC']],
//         offset: 0,
//         limit: 8
//     })
// };

/**
 * 更新
 */
exports.update = (where, rows) => {
    return ProjectScoreRecord.update(rows, {where: where})
};

/**
 * 提交评分记录
 */
exports.insert = (value) => {
    return ProjectScoreRecord.create(value)
};

/**
 * 查询有效评分人数(原生Sql语句)
 */

exports.getScoreMemberNum=(projectID)=>{
    return sequelizeInstance.query('SELECT COUNT(DISTINCT scorerID) AS memberNum FROM ProjectScoreRecord WHERE projectID=?', {
        replacements : [projectID],//按顺序传入需要替换？的值
        type : Sequelize.QueryTypes.SELECT //指定查询类型
      }) 
};

/**
 * 提取用户总得分，以供计算项目最终得分
 */
exports.queryScoreFinal=(projectID)=>{
    return sequelizeInstance.query('SELECT SUM(attitudeScore) AS attScore,SUM(designScore) AS desScore,'+
    'SUM(codeScore) AS codScore, userID FROM ProjectScoreRecord WHERE projectID=? GROUP BY userID', {
        replacements : [projectID],//按顺序传入需要替换？的值
        type : Sequelize.QueryTypes.SELECT //指定查询类型
      }) 
};
