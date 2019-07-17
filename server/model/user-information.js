'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserInformation', {
        userID: {type: DataTypes.INTEGER(11).ZEROFILL, primaryKey: true, allowNull: false},
        birthday: {type: DataTypes.DATE, allowNull: true},
        sex: {type: DataTypes.STRING(1), allowNull: true},
        nickname: {type: DataTypes.STRING(45), allowNull: true},
        realName: {type: DataTypes.STRING(45), allowNull: true},
        avatarUrl: {type: DataTypes.STRING(255), allowNull: true}
    }, {freezeTableName: true});
};
