
const {ProjectInformation, ProjectRewardRecord,ProjectScoreRecord,ProjectMember, UserInformation} = require('../model/create-table');
const Op = require('sequelize').Op;

then2await=(gres)=>{return new Promise(function(resolve,reject){resolve(gres)})}

/**
 * 处理查询的 where 语句
 * 
 * creatorID:创建人ID
 * field:项目方向
 * search:检索内容（根据课程名调查）
 */
function dealWhere(field,creatorID, search) {
    let whereCase = {};
    if (field !== undefined && !isNaN(parseInt(field)))
        whereCase.projectField = field;
    if (creatorID !== undefined && !isNaN(parseInt(creatorID)))
        whereCase.creatorID = creatorID;        
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
exports.selectCount = (field,creatorID, search,userID=undefined) => {
    let where = dealWhere(field,creatorID, search);
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
 * 获取指定条件的课程
 * @param field 课程体系
 * @param page 分页
 * @param search 查找
 */
exports.selectProject = async (field,creatorID, page, search,userID=undefined,detailInfo=false) => {
    let where = dealWhere(field,creatorID, search);
    // let order = dealOrder(sort);
    let offset = !isNaN(parseInt(page)) ? parseInt(page) : 1;
    let object = {
        attributes: {exclude: ['createdAt', 'updatedAt']},
        limit: 10, offset: (10 * (offset - 1))
    };
    if(userID!=undefined){
        object["include"]=[
            {
              model: ProjectMember,
              where:{memberID:userID},
              include:[
                  {model:UserInformation,attributes:['nickName','userID']}
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
                attributes:['nickName','userID']
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
                {model:UserInformation,attributes:['nickName','userID']}
            ],
          },
          {
            model: UserInformation,
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
