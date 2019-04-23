const CourseSystem = require('../../service/course-system');
const CourseType = require('../../service/course-type');
const CourseInfo = require('../../service/course-information');

/**
 * 获取课程体系
 */
exports.getSystem = async (req, res) => {
    await CourseSystem.select().then((rows) => {
        let system = [];
        for (let row in rows) if (rows.hasOwnProperty(row)) {
            system.push({
                id: rows[row].systemID,
                name: rows[row].systemName
            });
        }
        res.json({status: 1, data: system});
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'});
    })
};

/**
 * 获取课程类别
 */
exports.getType = async (req, res) => {
    const systemID = req.query.system;
    if (systemID === undefined) res.json({status: 0, msg: 'No data'});
    else {
        await CourseType.select({systemID: systemID}).then((rows) => {
            let type = [];
            for (let row in rows) if (rows.hasOwnProperty(row))
                type.push({
                    id: rows[row].typeID,
                    name: rows[row].typeName
                });
            res.json({status: 1, data: type})
        }).catch((err) => {
            console.log(err);
            res.json({status: 0, msg: '服务器错误'});
        })
    }
};

/**
 * 获取课程总页数
 */
exports.getCourseCount = async (req, res) => {
    const system = req.body.system;
    const type = req.body.type;
    const filter = req.body.filter;
    const search = req.body.search;
    await CourseInfo.selectCount(system, type, filter, search).then((count) => {
        res.json({status: 1, count: count})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    })
};

/**
 * 获取课程
 */
exports.getCourse = async (req, res) => {
    const search = req.params.search;
    const system = req.query.system;
    const type = req.query.type;
    const filter = req.query.filter;
    const sort = req.query.sort;
    const page = req.query.page;
    await CourseInfo.selectCourse(system, type, filter, sort, page, search).then((rows) => {
        res.json({status: 1, course: rows})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    });
};

/**
 * 获取推荐课程
 * */
exports.getRecommendCourse = async (req, res) => {
    await CourseInfo.selectReCourse().then((rows) => {
        res.json({status: 1, course: rows})
    }).catch((err) => {
        console.log(err);
        res.json({status: 0, msg: '服务器错误'})
    })
};
