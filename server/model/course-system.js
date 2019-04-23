'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CourseSystem', {
        systemID: {type: DataTypes.INTEGER(4), primaryKey: true, allowNull: false},
        systemName: {type: DataTypes.STRING(30), allowNull: false}
    }, {freezeTableName: true});
};
