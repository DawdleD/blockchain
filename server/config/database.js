const Sequelize = require('sequelize');
var config = require('./sqlserver');
var db = {
    sequelize:new Sequelize(config.sequelize.database
        ,config.sequelize.userName
        ,config.sequelize.password
        ,config.sequelize)
};


module.exports = db.sequelize;


