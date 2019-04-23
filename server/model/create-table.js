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

sequelize.sync({force: false}).then(() => {
    console.log('success to create all table')
}).catch((err) => {
    console.log(err);
    console.log('fail to create all table')
});

module.exports = {
    UserPassport, UserInformation,
    CourseInformation, CourseClass, CourseComment, CourseChapter,
    CourseVideo, CourseType, CourseSystem, CourseDetail, CourseFile
};
