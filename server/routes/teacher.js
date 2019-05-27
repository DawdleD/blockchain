const express = require('express');
const router = express.Router();
const Student = require('../controllers/teacher/student');
/**
 * 获取学员信息
 */
router.get('/course/student', Student.getStudentInfo);

/**
 * 获取所授课程的信息
 */
router.get('/course/teacher',Student.getTeacherCourse);

/**
 * 添加学生
 */
router.post('/course/student/add',Student.addStudent);

/**
 * 删除学生
 */
router.post('/course/student/delete',Student.deleteStudent);

/**
 * 获取学生课后练习成绩
 */
router.post('/course/student/get-score',Student.getExerciseScore);

/**
 * 更新学生期末成绩
 */
router.post('/course/student/update-score',Student.updateScore);
module.exports = router;