'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CourseExam', {
        examID: {type: DataTypes.INTEGER(8), primaryKey: true, allowNull: false},
        exam: {type: DataTypes.JSON, allowNull: false},
        answer: {type: DataTypes.JSON, allowNull: false},
        startTime: {type: DataTypes.DATE, allowNull: true},
        endTime: {type: DataTypes.DATE, allowNull: true}
    }, {freezeTableName: true});
};
