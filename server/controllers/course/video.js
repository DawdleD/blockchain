const fs = require('fs');
const CourseClass = require('../../service/course-class');
const path = require('path');
/**
 * 获取课程课件
 */
exports.getCourseWare = async (req, res) => {
    try {
        if (req.session.userID === undefined) res.json({status: 0, msg: '非法请求'});
        else {
            let courseID = req.query.courseID;
            let inClass = await CourseClass.inClass({courseID, userID: req.session.userID});
            if (inClass) {
                const courseWare = path.resolve(__dirname, `../../static/courseware/${req.query.wareID}.pdf`);
                if (fs.existsSync(courseWare)) {
                    let pdf = path.resolve(courseWare);
                    res.download(pdf);
                } else res.json({status: 0, msg: '文件不存在'})

            } else res.json({status: 0, msg: '非法请求'})
        }
    } catch (e) {
        console.log(e);
        res.json({status: 0, msg: '服务器错误'})
    }
};
