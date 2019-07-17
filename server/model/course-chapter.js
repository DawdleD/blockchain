'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CourseChapter', {
        chapterID: {type: DataTypes.INTEGER(8), primaryKey: true, autoIncrement: true, allowNull: false},
        chapterName: {type: DataTypes.STRING(30), allowNull: false},
        courseID: {type: DataTypes.INTEGER(8), allowNull: false}
    }, {freezeTableName: true, paranoid: true});
};
