'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserInformation', {
        userID: {type: DataTypes.INTEGER(8).ZEROFILL, primaryKey: true, allowNull: false},
        birthday: {type: DataTypes.DATE, allowNull: true},
        sex: {type: DataTypes.STRING(1), allowNull: true},
        nickName: {type: DataTypes.STRING(45), allowNull: true},
        realName: {type: DataTypes.STRING(45), allowNull: true},
        avatarUrl: {type: DataTypes.STRING(255), allowNull: true},
        userAddress:{type:DataTypes.STRING(100),allowNull:false},
    }, {freezeTableName: true});
};
