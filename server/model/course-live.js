'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CourseLive', {
        courseID: {type: DataTypes.INTEGER(8), primaryKey: true, allowNull: false},
        title: {type: DataTypes.STRING(30), allowNull: false},
        txTime: {type: DataTypes.DATE, allowNull: false},
        streamName: {type: DataTypes.STRING, allowNull: false},
        pushUrl:{type:DataTypes.STRING,allowNull:false},
        pushName: {type: DataTypes.STRING, allowNull: false}
    }, {freezeTableName: true});
};
