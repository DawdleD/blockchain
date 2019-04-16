'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
/**
 * 用户登录信息表
 */
let UserPassport = sequelize.define('UserPassport', {
    userID: {type: Sequelize.INTEGER(8).ZEROFILL, primaryKey: true, allowNull: false},
    phone: {type: Sequelize.STRING(11), allowNull: false, uniqueKey: true},
    email: {type: Sequelize.STRING(100), uniqueKey: true, isEmail: true},
    password: {type: Sequelize.STRING(128), allowNull: false},
    salt: {type: Sequelize.STRING(64), allowNull: false},
    createTime: {type: Sequelize.DATE, allowNull: false},
    loginTime: {type: Sequelize.DATE, allowNull: true},
    failCount: {type: Sequelize.INTEGER, allowNull: false},
    accessLevel: {type: Sequelize.INTEGER, allowNull: false},
    banTime: {type: Sequelize.DATE, allowNull: true}
}, {freezeTableName: true});
/**
 * 用户个人信息表
 */
let UserInformation = sequelize.define('UserInformation', {
    userID: {type: Sequelize.INTEGER(8).ZEROFILL, primaryKey: true, allowNull: false},
    birthday: {type: Sequelize.DATE, allowNull: true},
    sex: {type: Sequelize.STRING(1), allowNull: true},
    nickname: {type: Sequelize.STRING(45), allowNull: true},
    realName: {type: Sequelize.STRING(45), allowNull: true},
    avatarUrl: {type: Sequelize.STRING(255), allowNull: true}
}, {freezeTableName: true});

UserInformation.belongsTo(UserPassport, {foreignKey: 'userID', onDelete: 'CASCADE'});

sequelize.sync({force: false}).then(() => {
    console.log('success to create table UserPassport and UserInformation')
}).catch((err) => {
    console.log(err);
    console.log('fail create')
});

module.exports = {
    UserPassport, UserInformation
};
