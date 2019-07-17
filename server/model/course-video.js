'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CourseVideo', {
        videoID: {type: DataTypes.INTEGER(8), autoIncrement: true, primaryKey: true, allowNull: false},
        videoName: {type: DataTypes.STRING(30), allowNull: false},
        videoUrl: {type: DataTypes.STRING, allowNull: false},
        wareUrl: {type: DataTypes.STRING, allowNull: true},
        videoDuration: {type: DataTypes.INTEGER, allowNull: false},
        chapterID: {type: DataTypes.INTEGER(8), allowNull: false},
        examID: {type: DataTypes.INTEGER(8), allowNull: true},
        fileId: {type: DataTypes.STRING, allowNull: true}
    }, {freezeTableName: true});
};
