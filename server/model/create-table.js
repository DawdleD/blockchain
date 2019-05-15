const sequelize = require('../config/database');

/**
 * 用户模块
 */
const UserInformation = sequelize.import('./user-information.js');
const UserPassport = sequelize.import('./user-passport.js');
/**
 * 课程模块
 */
const CourseInformation = sequelize.import('./course-information.js');
const CourseDetail = sequelize.import('./course-detail.js');
const CourseSystem = sequelize.import('./course-system.js');
const CourseType = sequelize.import('./course-type.js');
const CourseChapter = sequelize.import('./course-chapter.js');
const CourseFile = sequelize.import('./course-file.js');
const CourseVideo = sequelize.import('./course-video.js');
const CourseComment = sequelize.import('./course-comment.js');
const CourseClass = sequelize.import('./course-class.js');

/**
 * 项目模块
 */
const ProjectApplyRecord = sequelize.import('./project-applyrecord');
const ProjectCreateRecord = sequelize.import('./project-createrecord');
const ProjectInformation = sequelize.import('./project-information');
const ProjectPaymentRecord = sequelize.import('./project-paymentrecord');
const ProjectMember = sequelize.import('./project-projectmember');
const ProjectRewardRecord = sequelize.import('./project-rewardrecord');
const ProjectScoreRecord = sequelize.import('./project-scorerecord');



/**
 * 一个用户登录信息对应一个用户信息
 * 一对一关系
 */
UserPassport.hasOne(UserInformation, {foreignKey: 'userID'});
UserInformation.belongsTo(UserPassport, {foreignKey: 'userID'});
/**
 * 一个课程体系对应多个课程类别
 * 一对多关系
 */
CourseSystem.hasMany(CourseType, {foreignKey: 'systemID'});
CourseType.belongsTo(CourseSystem, {foreignKey: 'systemID'});
/**
 * 一个课程体系对应多节课程
 * 一对多关系
 */
CourseSystem.hasMany(CourseInformation, {foreignKey: 'systemID'});
CourseInformation.belongsTo(CourseSystem, {foreignKey: 'systemID'});
/**
 * 一个课程类别对应多节课程
 * 一对多关系
 */
CourseType.hasMany(CourseInformation, {foreignKey: 'typeID'});
CourseInformation.belongsTo(CourseType, {foreignKey: 'typeID'});
/**
 * 一个课程详情对应一个课程细节
 * 一对一关系
 */
CourseInformation.hasOne(CourseDetail, {foreignKey: 'courseID'});
CourseDetail.belongsTo(CourseInformation, {foreignKey: 'courseID'});
/**
 * 一个老师可上多节课
 * 一对多关系
 */
UserInformation.hasMany(CourseDetail,{foreignKey:'teacherID'});
CourseDetail.belongsTo(UserInformation,{foreignKey:'teacherID'});
/**
 * 一节课程对应多个目录
 * 一对多关系
 */
CourseInformation.hasMany(CourseChapter, {foreignKey: 'courseID'});
CourseChapter.belongsTo(CourseInformation, {foreignKey: 'courseID'});
/**
 * 一个目录对应多个视频
 * 一对多关系
 */
CourseChapter.hasMany(CourseVideo, {foreignKey: 'chapterID'});
CourseVideo.belongsTo(CourseChapter, {foreignKey: 'chapterID'});
/**
 * 一个目录对应多个文件
 * 一对多关系
 */
CourseChapter.hasMany(CourseFile, {foreignKey: 'chapterID'});
CourseFile.belongsTo(CourseChapter, {foreignKey: 'chapterID'});
/**
 * 一门课程对应多个评论
 * 一对多关系
 */
CourseInformation.hasMany(CourseComment, {foreignKey: 'courseID'});
CourseComment.belongsTo(CourseInformation, {foreignKey: 'courseID'});
/**
 * 一个用户可以对多门课程进行评论
 */
UserInformation.hasMany(CourseComment, {foreignKey: 'userID'});
CourseComment.belongsTo(UserInformation, {foreignKey: 'userID'});
/**
 * 一个学生能选多门课，一门课能有多个学生
 * 多对多关系
 */
UserInformation.belongsToMany(CourseInformation, {through: CourseClass, foreignKey: 'userID'});
CourseInformation.belongsToMany(UserInformation, {through: CourseClass, foreignKey: 'courseID'});


/**
 * Project 部分
 */

/**
 * 项目创建者与项目为一对多关系
 */
UserInformation.hasMany(ProjectInformation,{foreignKey:'creatorID',as:'CreateProjects'});
ProjectInformation.belongsTo(UserInformation,{foreignKey:'creatorID',as:'ProjectCreator'});

/**
 * 接收奖励用户与奖励记录为一对多关系
 */
UserInformation.hasMany(ProjectRewardRecord,{foreignKey:'userID',as:'ReceivedRewards'});
ProjectRewardRecord.belongsTo(UserInformation,{foreignKey:'userID',as:'RewardReceiver'});

/**
 * 发起奖励用户与奖励记录为一对多关系
 */
UserInformation.hasMany(ProjectRewardRecord,{foreignKey:'senderID',as:'SendRewards'});
ProjectRewardRecord.belongsTo(UserInformation,{foreignKey:'senderID',as:'RewardSender'});

/**
 * 接收评分用户与评分记录为一对多关系
 */
UserInformation.hasMany(ProjectScoreRecord,{foreignKey:'userID',as:'ReceivedScores'});
ProjectScoreRecord.belongsTo(UserInformation,{foreignKey:'userID',as:'ScoreReceiver'});

/**
 * 发起评分用户与评分记录为一对多关系
 */
UserInformation.hasMany(ProjectScoreRecord,{foreignKey:'scorerID',as:'SendScores'});
ProjectScoreRecord.belongsTo(UserInformation,{foreignKey:'scorerID',as:'ScoreSender'});

/**
 * 支付用户与项目支付记录为一对多关系
 */
UserInformation.hasMany(ProjectPaymentRecord,{foreignKey:'userID',as:'SendPayments'});
ProjectPaymentRecord.belongsTo(UserInformation,{foreignKey:'userID',as:'PaymentSender'});

/**
 * 用户与项目创建申请记录为一对多关系
 */
UserInformation.hasMany(ProjectCreateRecord,{foreignKey:'userID',as:'SendCreateApplys'});
ProjectCreateRecord.belongsTo(UserInformation,{foreignKey:'userID',as:'CreateApplySender'});

/**
 * 用户与项目参加申请记录为一对多关系
 */
UserInformation.hasMany(ProjectApplyRecord,{foreignKey:'userID',as:'SendAttendApplys'});
ProjectApplyRecord.belongsTo(UserInformation,{foreignKey:'userID',as:'AttendApplySender'});

/**
 * 用户与参加项目为多对多关系
 */

/**
 * ProjectMember与ProjectInformation为多对一关系
 * ProjectMember与UserInformation为多对一关系
 */

UserInformation.belongsToMany(ProjectInformation, {  through: 'projectMember', foreignKey: 'memberID',as:'AttendProjects' })
ProjectInformation.belongsToMany(UserInformation, {  through: 'projectMember', foreignKey: 'projectID',as:'AttendMembers' })
ProjectMember.belongsTo(UserInformation,{foreignKey:'memberID'});
ProjectMember.belongsTo(ProjectInformation,{foreignKey:'projectID'});
UserInformation.hasMany(ProjectMember,{foreignKey:'memberID'});
ProjectInformation.hasMany(ProjectMember,{foreignKey:'projectID'});
/**
 * 项目与项目奖励记录为一对多关系
 */
ProjectInformation.hasMany(ProjectRewardRecord,{foreignKey:'projectID',as:'ProjectRewards'});
ProjectRewardRecord.belongsTo(ProjectInformation,{foreignKey:'projectID',as:'RewardInProject'});


/**
 * 项目与项目评分记录为一对多关系
 */
ProjectInformation.hasMany(ProjectScoreRecord,{foreignKey:'projectID',as:'ProjectScores'});
ProjectScoreRecord.belongsTo(ProjectInformation,{foreignKey:'projectID',as:'ScoreInProject'});


/**
 * 被投资项目与投资记录为一对多关系
 */
ProjectInformation.hasMany(ProjectPaymentRecord,{foreignKey:'objectID',as:'ObjectPayments'});
ProjectPaymentRecord.belongsTo(ProjectInformation,{foreignKey:'objectID',as:'PaymentInProject'});

/**
 * 项目与项目申请记录为一对多关系
 */
ProjectInformation.hasMany(ProjectApplyRecord,{foreignKey:'projectID',as:'ProjectApplys'});
ProjectApplyRecord.belongsTo(ProjectInformation,{foreignKey:'projectID',as:'ApplyInProject'});


/**
 * 项目创建记录与项目支付记录为一对一关系
 */
ProjectCreateRecord.belongsTo(ProjectPaymentRecord,{foreignKey:'paymentID',as:'RecordPayment'});
ProjectPaymentRecord.hasOne(ProjectCreateRecord,{foreignKey:'paymentID',as:'PaymentInCreateRecord'});

/**
 * 项目申请记录与项目支付记录为一对一关系
 */
ProjectApplyRecord.belongsTo(ProjectPaymentRecord,{foreignKey:'paymentID',as:'RecordPayment'});
ProjectPaymentRecord.hasOne(ProjectApplyRecord,{foreignKey:'paymentID',as:'PaymentInApplyRecord'});

/**
 * Project部分 结束
 */


sequelize.sync({force: false}).then(() => {
    console.log('success to create all table')
}).catch((err) => {
    console.log(err);
    console.log('fail to create all table')
});



module.exports = {
    UserPassport, UserInformation,
    CourseInformation, CourseClass, CourseComment, CourseChapter,
    CourseVideo, CourseType, CourseSystem, CourseDetail, CourseFile,
    ProjectApplyRecord,ProjectCreateRecord,ProjectInformation,ProjectMember,
    ProjectPaymentRecord,ProjectRewardRecord,ProjectScoreRecord
};
