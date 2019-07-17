module.exports = function (sequelize, DataTypes) {
    var paymentRecord = sequelize.define('ProjectPaymentRecord', {
        paymentID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        userID: {
            type: DataTypes.INTEGER(11).ZEROFILL,
            allowNull: false,
        },
        payStatue: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        objectID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        courseID: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        payType: {
            type: DataTypes.ENUM('C', 'A', 'O'),
            allowNull: false,
        },
        relateEvent: {
            type: DataTypes.ENUM('COURSE', 'PROJECT'),
            allowNull: false,
        },
        payAmount: {
            type: DataTypes.INTEGER,
            defaultValue: '0',
        },
        txHash: {
            type: DataTypes.STRING(100)
        },
        logIndex: {
            type: DataTypes.INTEGER
        },

    }, {
        freezeTableName: true,
    });
    return paymentRecord;
};