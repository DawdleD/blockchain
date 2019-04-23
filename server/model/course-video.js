'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CourseVideo', {
        videoID: {type: DataTypes.INTEGER(8), primaryKey: true, allowNull: false},
        videoName: {type: DataTypes.STRING(30), allowNull: false},
        videoUrl: {type: DataTypes.STRING, allowNull: false},
        videoDuration: {type: DataTypes.INTEGER, allowNull: false},
        chapterID: {type: DataTypes.INTEGER(8), allowNull: false}
    }, {freezeTableName: true});
};
