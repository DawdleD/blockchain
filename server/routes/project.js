
'use strict';
const express = require('express');
const router = express.Router();
const ProjectQuery = require('../controllers/project/projectquery');
const CreateRecord=require('../controllers/project/createrecord')
const ApplyRecord=require('../controllers/project/applyrecord')
const PaymentRecord=require('../controllers/project/paymentrecord');
const ProjectManagement=require('../controllers/project/projectmanagement')

// const CourseInformation = require('../controllers/course/information');

/**
 * 获取主页项目列表
 */
router.get('/query/getindexproject', ProjectQuery.getIndexProject);


/**
 * 获取项目列表
 */
router.get('/query/getproject', ProjectQuery.getProject);

/**
 * 获取项目页数
 */
router.post('/query/getprojectcount', ProjectQuery.getProjectCount);

/**
 * 获取项目列表(权限)
 */
router.get('/query/getprojectauthed', ProjectQuery.getProjectAuthed);

/**
 * 获取项目页数(权限)
 */
router.post('/query/getprojectcountauthed', ProjectQuery.getProjectCountAuthed);

/**
 * 获取项目详细信息
 */
router.get('/query/projectdetail',ProjectQuery.getProjectDetail);
/**
 * 获取成员详细信息
 */
router.get('/query/memberdetail',ProjectQuery.getMemberDetail);

/**
 * 获取支付记录个数
 */
router.post('/query/getPaymentCount',ProjectQuery.getPaymentCount);

/**
 * 获取支付记录
 */
router.get('/query/getPaymentRecord',ProjectQuery.getPaymentRecord);

/**
 * 获取创建申请列表
 */
router.get('/query/getCreateRecord',ProjectQuery.getCreateApply);

/**
 * 获取创建申请个数
 */
router.post('/query/getCreateRecordCount',ProjectQuery.getCreateApplyCount)

/**
 * 提交项目创建申请
 */
router.post('/createrecord/createapply',CreateRecord.createApply)

/**
 * 取消项目创建申请
 */
router.get('/createrecord/cancelApply',CreateRecord.cancelApply)
/**
 * 同意项目创建申请
 */
router.get('/createrecord/agreeApply',CreateRecord.agreeApply)
/**
 * 拒绝项目创建申请
 */
router.get('/createrecord/rejectApply',CreateRecord.rejectApply)



/**
 * 获取参加申请列表
 */
router.get('/query/getApplyRecord',ProjectQuery.getAttendApply)

/**
 * 获取参加申请个数
 */
router.post('/query/getApplyRecordCount',ProjectQuery.getAttendApplyCount);

/**
 * 提交项目参加申请
 */
router.post('/ApplyRecord/createapply',ApplyRecord.createApply)

/**
 * 取消项目参加申请
 */
router.get('/ApplyRecord/cancelApply',ApplyRecord.cancelApply)
/**
 * 同意项目参加申请
 */
router.get('/ApplyRecord/agreeApply',ApplyRecord.agreeApply)
/**
 * 拒绝项目参加申请
 */
router.get('/ApplyRecord/rejectApply',ApplyRecord.rejectApply)

/**
 * 获取成员管理列表
 */
router.get('/query/getProjectMember',ProjectQuery.getProjectMember)

/**
 * 获取成员管理个数
 */
router.post('/query/getProjectMemberCount',ProjectQuery.getProjectMemberCount);

// 项目管理部分
// router.get('/paymentrecord/comfirmpayment',PaymentRecord.comfirmPayment_test);

/**
 * 项目投资功能
 */
router.post('/projectmanagement/submitInvest',ProjectManagement.submitInvest);

/**
 * 关闭项目功能
 */
router.get('/projectmanagement/closeProject',ProjectManagement.closeProject);

/**
 * 查询项目临时评分
 */
router.get('/query/getProScore',ProjectManagement.queryProScore);

/**
 * 确认评分功能
 */
router.get('/projectmanagement/comfirmProScore',ProjectManagement.comfirmProScore);

/**
 * 项目成员移除功能
 */
router.get('/projectmanagement/deleteProjectMember',ProjectManagement.deleteProjectMember);

/**
 * 确认评分功能
 */
router.get('/projectmanagement/queryProScore',ProjectManagement.queryProScore);

/**
 * 项目奖惩提交功能
 */
router.post('/projectmanagement/submitReward',ProjectManagement.submitReward);

/**
 * 项目评分提交功能
 */
router.post('/projectmanagement/submitScore',ProjectManagement.submitScore);

/**
 * 项目状态记录功能
 */
router.post('/projectmanagement/regProjectState',ProjectManagement.registerProjectState);

/**
 * 修改项目信息
 */
router.post('/projectmanagement/modifyProject',ProjectManagement.modifyProject);

/**
 * 修改项目信息-头像
 */
router.post('/projectmanagement/updateAvatar',ProjectManagement.updateAvatar);

module.exports = router;
