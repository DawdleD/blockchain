'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserPassport', {
        userID: {type: DataTypes.INTEGER(11).ZEROFILL, primaryKey: true, allowNull: false},
        phone: {type: DataTypes.STRING(11), allowNull: false, uniqueKey: true},
        email: {type: DataTypes.STRING(100), uniqueKey: true, isEmail: true},
        password: {type: DataTypes.STRING(128), allowNull: false},
        salt: {type: DataTypes.STRING(64), allowNull: false},
        createTime: {type: DataTypes.DATE, allowNull: false},
        loginTime: {type: DataTypes.DATE, allowNull: true},
        failCount: {type: DataTypes.INTEGER, allowNull: false},
        accessLevel: {type: DataTypes.INTEGER, allowNull: false},
        banTime: {type: DataTypes.DATE, allowNull: true}
    }, {freezeTableName: true});
};
