'use strict';

const {CourseVideo, CourseChapter, CourseInformation} = require('../model/create-table');

/**
 * 查询课程文件
 * @param where
 */
exports.select = where => {
    return CourseVideo.findAll({
        where: where
    })
};

/**
 * 根据课程ID查询视频ID
 */
exports.selectAll = courseID =>{
  return CourseVideo.findAll({
      attributes:['videoID','examID'],
      include:[{
          model:CourseChapter,
          attributes: [],
          include: [{
              model:CourseInformation,
              attributes:[],
              where: {courseID}
          }]
      }]
  })
};
