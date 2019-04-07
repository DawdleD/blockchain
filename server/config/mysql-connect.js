'use strict';
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: '47.102.97.205',
    user: 'aliserver',
    password: 'Dewey1998,,..',
    database: 'server',
    port: 3306
});
/**
 *
 * @param sql sql语句
 * @param values 传入值
 * @returns {Promise<any>}
 */
let query = (sql, values) => {
// 返回一个 Promise
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log("连接数据库失败");
                console.log(err);
                reject(err);
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        console.log("SQL执行失败");
                        console.log(err);
                        reject(err);
                    } else resolve(rows);
                    // 结束会话
                    connection.release();
                });
            }
        });
    });
};

module.exports = {query};
