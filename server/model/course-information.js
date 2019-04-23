'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CourseInformation', {
        courseID: {type: DataTypes.INTEGER(8), primaryKey: true, allowNull: false},
        courseName: {type: DataTypes.STRING(60), allowNull: false},
        courseDescription: {type: DataTypes.STRING(300), allowNull: false},
        courseImage: {type: DataTypes.STRING, allowNull: false},
        systemID: {type: DataTypes.INTEGER(4), allowNull: false},
        typeID: {type: DataTypes.INTEGER(4), allowNull: false},
        price: {type: DataTypes.FLOAT, allowNull: false},
        courseForm: {type: DataTypes.STRING(1), allowNull: true},
        favorableRate: {type: DataTypes.FLOAT, allowNull: true},
        applyCount: {type: DataTypes.INTEGER(6), allowNull: true}
    }, {freezeTableName: true});
};
