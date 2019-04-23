'use strict';

const {CourseChapter} = require('../model/create-table');

/**
 * 查询章节
 * @param where
 */
exports.select = where => {
    return CourseChapter.findAll({
        where: where
})
};
