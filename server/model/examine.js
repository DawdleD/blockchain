'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Examine', {
        userID: {type: DataTypes.INTEGER(8).ZEROFILL, allowNull: false},
        examID: {type: DataTypes.INTEGER(8), primaryKey: true, allowNull: false},
        result: {type: DataTypes.JSON, allowNull: false},
        score: {type: DataTypes.FLOAT, allowNull: false}
    }, {freezeTableName: true});
};
