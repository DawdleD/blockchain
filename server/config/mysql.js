const all = {
    sequelize: {
        userName: 'root',
        password: 'Dewey1998!!@@',
        database: 'test',
        host: "cdb-3ta3bkhz.gz.tencentcdb.com",
        dialect: 'mysql',
        timezone: '+08:00',
        port: 10061,
        pool: {
            max: 100,
            min: 0,
            acquire: 30000,
            idle: 30000,
        },
        logging: false,
        define: {
            underscored: false,
            timestamps: true,
            paranoid: false
        }
    }
};

module.exports = all;