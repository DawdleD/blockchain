'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CourseFile', {
        fileID: {type: DataTypes.INTEGER(8), primaryKey: true, allowNull: false},
        fileName: {type: DataTypes.STRING(30), allowNull: false},
        fileUrl: {type: DataTypes.STRING, allowNull: false},
        fileSize: {type: DataTypes.BIGINT, allowNull: false},
        fileType: {type: DataTypes.STRING, allowNull: false},
        chapterID: {type: DataTypes.INTEGER(8), allowNull: false}
    }, {freezeTableName: true});
};
