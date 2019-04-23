'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CourseType', {
        typeID: {type: DataTypes.INTEGER(4), primaryKey: true, allowNull: false},
        typeName: {type: DataTypes.STRING(30), allowNull: false},
        systemID: {type: DataTypes.INTEGER(4), allowNull: false}
    }, {freezeTableName: true});
};
