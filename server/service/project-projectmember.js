const {ProjectMember,UserInformation,ProjectInformation} = require('../model/create-table');


/**
 * 处理查询的 where 语句
 * 
 * memberID:成员ID
 * projectID:项目ID
 * memberType:成员类型
 */
function dealWhere(memberID,projectID,memberType) {
    let whereCase = {};
    if (memberID !== undefined && !isNaN(parseInt(memberID)))
        whereCase.memberID = memberID;
    if (projectID !== undefined && !isNaN(parseInt(projectID)))
        whereCase.projectID = projectID;        
    if (memberType !== undefined && !isNaN(parseInt(memberType)))
        whereCase.memberType = memberType;

    return JSON.stringify(whereCase) === '{}' ? undefined : whereCase;
}

/**
 * 处理查询的 where 语句
 * 
 * memberID:成员ID
 * projectID:项目ID
 * memberType:成员类型
 * creatorID：项目创建者ID（用于权限控制）
 */
exports.selectProjectMemberCount = (memberID,projectID,memberType,creatorID=undefined) => {
    let where = dealWhere(memberID,projectID,memberType);
    let object = where === undefined ? {} : where;
    if(creatorID!=undefined){
        object["include"]=[{
            model:ProjectInformation,
            where:{creatorID},
        }]
    }
    return ProjectMember.count(object);
};

/**
 * 获取指定条件的课程
 * 
 * memberID:成员ID
 * projectID:项目ID
 * memberType:成员类型
 * creatorID：项目创建者ID（用于权限控制）
 * @param page 分页
 */
exports.selectMember = async (memberID,projectID,memberType,page,creatorID=undefined) => {
    let where = dealWhere(memberID,projectID,memberType);
    // let order = dealOrder(sort);
    let offset = !isNaN(parseInt(page)) ? parseInt(page) : 1;
    let object = {
        attributes: {exclude: ['createdAt', 'updatedAt']},
        limit: 10, offset: (10 * (offset - 1))
    };
    if(creatorID!=undefined){
        object["include"]=[{
            model:ProjectInformation,
            where:{creatorID}
        }]
    }    
    if (where !== undefined) object.where = where;
    // if (order !== undefined) object.order = order;
    // return ProjectApplyRecord.findAll(object);
    var res=await ProjectMember.findAll(object).then(then2await);
    for(item of res){
        var projectMemberItem=item;
        var getRes=await projectMemberItem.getUserInformation(
            {
                attributes:['nickname','userID']
            }
        ).then(then2await);
        projectMemberItem.dataValues.UserInformation=getRes.dataValues;
        // 查询项目成员未内联项目信息表时，进行再查询。
        if(creatorID==undefined){
            var getRes=await projectMemberItem.getProjectInformation(
                {
                    attributes: ['projectID','projectName'],
                }
            ).then(then2await);
            projectMemberItem.dataValues.ProjectInformation=getRes.dataValues;                
        }
    }    
    return res;
};

/**
 * 查询用户是否在项目内
 */
exports.select = where => {
    return ProjectMember.findAll({
        where: where
    })
};

/**
 * 为用户添加项目
 */
exports.insert = (value) => {
    return ProjectMember.create(value)
};

/**
 * 查询项目参与人数
 */
exports.selectCount = where => {
    return ProjectMember.count({where: where})
};

exports.update = (where, rows) => {
    return ProjectMember.update(rows, {where: where})
};

exports.delete = (where)=>{
    return ProjectMember.destroy({where:where})
}