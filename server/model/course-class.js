'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CourseClass', {
        userID: {type: DataTypes.INTEGER(11).ZEROFILL, allowNull: false},
        courseID: {type: DataTypes.INTEGER(8), allowNull: false},
        score: {type: DataTypes.FLOAT, allowNull: false},
        joinTime: {type: DataTypes.DATE, allowNull: false}
    }, {freezeTableName: true});
};
