'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CourseComment', {
        courseID: {type: DataTypes.INTEGER(8), allowNull: false},
        userID: {type: DataTypes.INTEGER(8).ZEROFILL, allowNull: false},
        star: {type: DataTypes.INTEGER(1), allowNull: false},
        content: {type: DataTypes.STRING, allowNull: true},
        time: {type: DataTypes.DATE, allowNull: false}
    }, {freezeTableName: true});
};
