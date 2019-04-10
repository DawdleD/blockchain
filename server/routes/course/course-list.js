'use strict';
const express = require('express');
const router = express.Router();
const mysql = require('../../config/mysql-connect');
const courseSelect = require('./course-select');

/**
 * 获取课程体系
 */
router.get('/system', async (req, res) => {
    const cmd = `select * from CourseSystem`;
    await mysql.query(cmd, null).then((rows) => {
        let system = [];
        for (let row in rows) {
            system.push({
                id: rows[row]['SystemID'],
                name: rows[row]['SystemName']
            });
        }
        res.json({status: 1, data: system});
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, message: '服务器错误'});
    })
});
/**
 * 获取课程类别
 */
router.get('/type', async (req, res) => {
    const systemID = req.query.system;
    if (systemID === undefined) res.json({
        status: 0,
        message: 'No data'
    });
    else {
        const cmd = `select TypeID,TypeName from CourseType where SystemID = ?`;
        await mysql.query(cmd, [systemID]).then((rows) => {
            let type = [];
            for (let row in rows) type.push({
                id: rows[row]['TypeID'],
                name: rows[row]['TypeName']
            });
            res.json({
                status: 1,
                data: type
            })
        }).catch((err) => {
            console.log(err);
            res.json({status: 0, message: '服务器错误'});
        })
    }

});
/**
 * 插入（测试用）
 */
router.get('/insert', async (req, res) => {
    let system = [101, 102, 103, 104, 105, 106, 107];
    let type = [
        [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009],
        [1101, 1102, 1103, 1104, 1105],
        [1201, 1202],
        [1301, 1302, 1303],
        [1401, 1402, 1403, 1404, 1405],
        [1501, 1502, 1503, 1504],
        [1601, 1602, 1603, 1604, 1605]
    ];
    const cmd = `INSERT INTO CourseInformation(CourseID, CourseName, CourseDescription, SystemID, TypeID, Price, CourseForm, FavorableRate, ApplyCount)
     VALUES (?,?,?,?,?,?,?,?,?)`;
    for (let i = 0; i < 500; i++) {
        console.log(`第${i}条添加`);
        let courseID = parseInt(Math.random().toString().slice(2, 7));
        let courseName = '测试课程';
        let courseDescription = '测试课程描述';
        let systemID = system[courseID % 7];
        let typeTemp = type[courseID % 7].length;
        let typeID = type[courseID % 7][courseID % typeTemp];
        let price = (Math.random() * 1000).toFixed(2);
        let courseForm = courseID % 2 === 0 ? 'R' : 'L';
        let favorableRate = Math.random().toFixed(2);
        let applyCount = courseID % 3 === 0 ? parseInt(Math.random().toString().slice(2, 5)) : 0;
        await mysql.query
        (cmd, [courseID, courseName, courseDescription, systemID, typeID, price, courseForm, favorableRate, applyCount]).then(() => {
            console.log(`第${i}条已添加`);
        }).catch(() => {
            console.log(`第${i}条添加失败`);
        })
    }
    res.json({
        value: "正在执行"
    })
});
/**
 * 获取课程页数
 */
router.post('/count', async (req, res) => {
    const system = req.body['system'];
    const type = req.body['type'];
    const filter = req.body['filter'];
    const countCmd = courseSelect.getCourseSql(system, type, filter, null, null, true);
    await mysql.query(countCmd, [system, type]).then((rows) => {
        let courseSum = rows[0]['count(*)'];
        res.json({
            status: 1,
            count: courseSum % 10 === 0 ? Math.floor(courseSum / 10) : Math.floor(courseSum / 10) + 1
        })
    }).catch((err) => {
        console.log(err);
        res.json({
            status: 0,
            message: '服务器错误'
        })
    })
});
/**
 * 获取课程
 */
router.get('/', async (req, res) => {
    const system = req.query['system'];
    const type = req.query['type'];
    const filter = req.query['filter'];
    const sort = req.query['sort'];
    const page = req.query['page'];
    const cmd = courseSelect.getCourseSql(system, type, filter, sort, page, false);
    await mysql.query(cmd, [system, type]).then((rows) => {
        res.json({
            status: 1,
            course: rows
        })
    }).catch((err) => {
        console.log(err);
        res.json({
            status: 0,
            message: '服务器错误'
        })
    });
});
/**
 * 获取推荐课程
 */
router.get('/recommend', async (req, res) => {
    const cmd = `select CourseID,CourseName,Price,ApplyCount 
    from CourseInformation order by ApplyCount desc limit 0,8`;
    await mysql.query(cmd, null).then((rows) => {
        res.json({
            status: 1,
            course: rows
        })
    }).catch((err) => {
        console.log(err);
        res.json({
            status: 0,
            message: '服务器错误'
        })
    })
});
module.exports = router;
