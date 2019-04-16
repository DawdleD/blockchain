const Sequelize = require('sequelize');
module.exports = new Sequelize('test', 'aliserver', 'Dewey1998,,..', {
    host: '47.102.97.205',
    dialect: 'mysql',
    pool:{
        max:100,
        min:0,
        acquire:30000,
        idle:30000,
    }
});
