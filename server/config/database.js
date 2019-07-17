const Sequelize = require('sequelize');
const config = require('./mysql');
const db = {
    sequelize: new Sequelize(config.sequelize.database
        , config.sequelize.userName
        , config.sequelize.password
        , config.sequelize)
};


module.exports = db.sequelize;


