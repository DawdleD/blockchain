'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CourseDetail', {
        courseID: {type: DataTypes.INTEGER(8), primaryKey: true, allowNull: false},
        teacherID: {type: DataTypes.INTEGER(11).ZEROFILL, allowNull: false},
        courseSummary: {type: DataTypes.STRING(500), allowNull: true},
        courseTarget: {type: DataTypes.STRING(500), allowNull: true},
        startTime: {type: DataTypes.DATE, allowNull: false},
        finishTime: {type: DataTypes.DATE, allowNull: false},
        courseArrange: {type: DataTypes.STRING(10), allowNull: true}
    }, {freezeTableName: true});
};
