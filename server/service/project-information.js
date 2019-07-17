
const {ProjectInformation, ProjectRewardRecord,ProjectApplyRecord,ProjectScoreRecord,ProjectMember, UserInformation} = require('../model/create-table');
const Op = require('sequelize').Op;

then2await=(gres)=>{return new Promise(function(resolve,reject){resolve(gres)})}

/**
 * 处理查询的 where 语句
 * 
 * creatorID:创建人ID
 * field:项目方向
 * search:检索内容（根据课程名调查）
 */
function dealWhere(field,creatorID, search,projectID) {
    let whereCase = {};
    if (field !== undefined && !isNaN(parseInt(field)))
        whereCase.projectField = field;
    if (creatorID !== undefined && !isNaN(parseInt(creatorID)))
        whereCase.creatorID = creatorID;       
    if (projectID !== undefined && !isNaN(parseInt(projectID)))
        whereCase.projectID = projectID;           
    // if (filter !== undefined && !isNaN(parseInt(filter)))
    //     switch (parseInt(filter)) {
    //         case 1:
    //             whereCase.price = 0;
    //             break;
    //         case 2:
    //             whereCase.price = {[Op.gt]: 0};
    //             break;
    //         case 3:
    //             whereCase.courseForm = 'R';
    //             break;
    //         case 4:
    //             whereCase.courseForm = 'L';
    //             break;
    //     }
    if (search !== undefined)
        whereCase.projectName = {[Op.like]: `%${search}%`};
    return JSON.stringify(whereCase) === '{}' ? undefined : whereCase;
}


/**
 * 获取课程
 */
exports.select = where => {
    return ProjectInformation.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: where,
        raw: true
    })
};

/**
 * 获取指定条件的项目总数
 * @param field 项目领域
 * @param creatorID 创建人用户ID
 * @param search 查找
 */
exports.selectCount = (field,creatorID, search,userID=undefined,projectID=undefined) => {
    let where = dealWhere(field,creatorID, search,projectID);
    let object = where === undefined ? {} : where;
    if(userID!=undefined){
        object["include"]=[
            {
              model: ProjectMember,
              where:{memberID:userID},
            },                        
          ]
    }         
    return ProjectInformation.count(object);
};

/**
 * 获取最新项目-供首页展示使用
 */
exports.selectIndexProject=async()=>{
    var res=await ProjectInformation.findAll({
        'order': [['createTime', 'DESC']],
        'limit':8,
        attributes: ['projectID', 'projectPic','projectFee'],
    })

    // ApplyCount指代提交报名的不同用户ID的数量，并非参与项目的实际人数
    for(var ind in res){
        console.log(res[ind])
        var applyCount=await ProjectApplyRecord.count({
            'attributes':['userID'],
            where:{'projectID':res[ind].projectID},
        })
        console.log(applyCount)
        res[ind].dataValues['applyCount']=applyCount
    }
    return res;
};


/**
 * 获取指定条件的课程
 * @param field 课程体系
 * @param page 分页
 * @param search 查找
 */
exports.selectProject = async (field,creatorID, page, search,projectID=undefined,userID=undefined,detailInfo=false) => {
    let where = dealWhere(field,creatorID, search,projectID);
    // let order = dealOrder(sort);
    let offset = !isNaN(parseInt(page)) ? parseInt(page) : 1;
    let object = {
        attributes: {exclude: ['createdAt', 'updatedAt']},
        limit: 10, offset: (10 * (offset - 1))
    };
    if(userID!=undefined){
        object["include"]=[
            {
                // model: UserInformation,
                // as:'AttendMembers',
                // where:{userID:userID}
              model: ProjectMember,
              where:{memberID:userID},
              include:[
                  {model:UserInformation,attributes:['nickname','userID']}
              ],
            },                        
          ]
    }      
    if (where !== undefined) object.where = where;
    object.raw=false;

    // Instead Of Include: use GET
    var res=await ProjectInformation.findAll(object).then(then2await);
    for(item of res){
        var projectItem=item;
        var getRes=await projectItem.getProjectCreator(
            {
                attributes:['nickname','userID']
            }
        ).then(then2await);   
        projectItem.dataValues.ProjectCreator=getRes.dataValues;
        // Get Creator's MemberInfo when necessary
        if(detailInfo==true&&creatorID!=undefined){
            var creatorMemberInfo=await ProjectMember.findOne({where:{
                memberID:creatorID,
                projectID:projectItem.dataValues.projectID
            }});
            projectItem.dataValues.ProjectCreatorMemberInfo=creatorMemberInfo.dataValues;
        } 
    }
    // 清空数据
    if(userID!=undefined&&detailInfo==false)
        for(item of res){
            item.dataValues.ProjectMembers=undefined;
        }
    return res;


};

/**
 * 获取项目具体信息，包括项目基础信息、项目创建人信息、项目成员信息、奖励信息、评分信息
 */
exports.getProjectDetail= async(projectID)=>{

    return ProjectInformation.findOne({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where:{projectID},
        include:[
          {
            model: ProjectMember,
            include:[
                {model:UserInformation,attributes:['nickname','userID']}
            ],
          },
          {
            model: UserInformation,
            attributes:['nickname','userID'],
            as:'ProjectCreator',
          },     
          {
            model: ProjectRewardRecord,
            as:'ProjectRewards',
          },     
        //   {
        //     model: ProjectScoreRecord,
        //     as:'ProjectScores',
        //   },                              
        ],
    })

};

/**
 * 获取用户项目履历详细信息
 */
exports.getMemberDetail= async(userID)=>{

    return UserInformation.findOne({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where:{userID},
        include:[
          {
            model: ProjectMember,
            include:[
                {model:ProjectInformation,attributes:['projectID','projectName']}
            ],            
          },
          {
            model: ProjectRewardRecord,
            as:'ReceivedRewards',
          },     
        //   {
        //     model: ProjectScoreRecord,
        //   },                              
        ],
    })

};


/**
 * 更新
 */
exports.update = (where, rows) => {
    return ProjectInformation.update(rows, {where: where})
};

exports.insert = (value) => {
    return ProjectInformation.create(value)
};
