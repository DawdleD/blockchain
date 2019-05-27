
var all = {
    sequelize:{
        // userName: 'root',
        // password: 'root',
        // database: 'testsub3',
        // host: "localhost",
        userName: 'aliserver',
        password: 'Dewey1998,,..',
        database: 'server',
        host: "47.102.97.205",        
        dialect: 'mysql',
        timezone: '+08:00',
        define: {
            underscored: false,
            timestamps: true,
            paranoid: true
        }
    }
};

module.exports = all;