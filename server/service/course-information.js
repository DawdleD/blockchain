'use strict';
const {CourseInformation, CourseDetail, UserInformation} = require('../model/create-table');
const Op = require('sequelize').Op;

/**
 * 处理查询的 where 语句
 */
function dealWhere(system, type, filter, search) {
    let whereCase = {};
    if (system !== undefined && !isNaN(parseInt(system)))
        whereCase.systemID = system;
    if (type !== undefined && !isNaN(parseInt(type)))
        whereCase.typeID = type;
    if (filter !== undefined && !isNaN(parseInt(filter)))
        switch (parseInt(filter)) {
            case 1:
                whereCase.price = 0;
                break;
            case 2:
                whereCase.price = {[Op.gt]: 0};
                break;
            case 3:
                whereCase.courseForm = 'R';
                break;
            case 4:
                whereCase.courseForm = 'L';
                break;
        }
    if (search !== undefined)
        whereCase.courseName = {[Op.like]: `%${search}%`};
    return JSON.stringify(whereCase) === '{}' ? undefined : whereCase;
}

/**
 * 处理排序的 order 语句
 */
function dealOrder(sort) {
    let orderCase = [];
    if (sort !== undefined && !isNaN(parseInt(sort))) {
        switch (parseInt(sort)) {
            case 1:
                orderCase.push(['favorableRate', 'DESC']);
                break;
            case 2:
                orderCase.push(['applyCount', 'DESC']);
                break;
            case 3:
                orderCase.push(['price', 'DESC']);
                break;
            case 4:
                orderCase.push(['price']);
                break;
        }
    }
    return orderCase.length === 0 ? undefined : orderCase;
}

/**
 * 获取课程
 */
exports.select = where => {
    return CourseInformation.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: where,
        raw: true
    })
};

/**
 * 获取指定条件的课程总数
 * @param system 课程体系
 * @param type 课程类别
 * @param filter 课程分类
 * @param search 查找
 */
exports.selectCount = (system, type, filter, search) => {
    let where = dealWhere(system, type, filter, search);
    let object = where === undefined ? {} : where;
    return CourseInformation.count(object);
};

/**
 * 获取指定条件的课程
 * @param system 课程体系
 * @param type 课程类别
 * @param filter 课程分类
 * @param sort 排序
 * @param page 分页
 * @param search 查找
 */
exports.selectCourse = (system, type, filter, sort, page, search) => {
    let where = dealWhere(system, type, filter, search);
    let order = dealOrder(sort);
    let offset = !isNaN(parseInt(page)) ? parseInt(page) : 1;
    let object = {
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [{
            attributes: ['teacherID'],
            model: CourseDetail,
            include: [{
                attributes: ['nickName'],
                model: UserInformation,
            }]
        }],
        limit: 10, offset: (10 * (offset - 1))
    };
    if (where !== undefined) object.where = where;
    if (order !== undefined) object.order = order;
    return CourseInformation.findAll(object)
};

/**
 * 获取推荐课程
 */
exports.selectReCourse = () => {
    return CourseInformation.findAll({
        order: [['applyCount', 'DESC']],
        offset: 0,
        limit: 8
    })
};

/**
 * 更新
 */
exports.update = (where, rows) => {
    return CourseInformation.update(rows, {where: where})
};
