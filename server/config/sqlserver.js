
var all = {
    sequelize:{
        userName: 'root',
        password: 'root',
        database: 'testsub2',
        host: "localhost",
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