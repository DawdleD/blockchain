'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CourseFile', {
        fileID: {type: DataTypes.INTEGER(8), primaryKey: true, autoIncrement: true, allowNull: false},
        fileStr: {type: DataTypes.STRING, allowNull: false},
        fileName: {type: DataTypes.STRING(30), allowNull: false},
        fileSize: {type: DataTypes.BIGINT, allowNull: false},
        fileType: {type: DataTypes.STRING, allowNull: false},
        chapterID: {type: DataTypes.INTEGER(8), allowNull: false}
    }, {freezeTableName: true, paranoid: true});
};
