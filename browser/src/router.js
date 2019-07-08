import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Index from './views/Index'

import Login from './views/passport/Login'
import Register from './views/passport/Register'
import Reset from './views/passport/Reset'

import Course from './views/Course'
import CourseList from './components/course/List'
import CourseInformation from './components/course/Information'


import Project from './views/Project'
import ProjectList from './components/project/List'
import ProjectInformation from './components/project/Information'

import Profile from './views/Profile'
import ProfileCourse from './components/profile/Course'
import ProfileCertificate from './components/profile/Certificate'
import ProfileExam from './components/profile/Exam'
import ProfilePersonal from './components/profile/Personal'
import ProfileProject from './components/profile/Project'
import ProfileWallet from './components/profile/Wallet'

import ProfileAttendApplyManagement_teacher from './components/profile/AttendApplyManagement_teacher'
import ProfileCreateApplyManagement_teacher from './components/profile/CreateApplyManagement_teacher'
import ProfileProject_teacher from './components/profile/Project_teacher'
import ProfileProjectMember_teacher from './components/profile/ProjectMember_teacher'

const TeacherProject  = () =>import( './views/teacher/Project');
const PAAM  = () =>import( './components/teacher/project/AttendApplyManagement_teacher');
const PCAM  = () =>import( './components/teacher/project/CreateApplyManagement_teacher');
const PP  = () =>import( './components/teacher/project/Project_teacher');
const PPM  = () =>import( './components/teacher/project/ProjectMember_teacher');


Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {path: '/home', name: 'Home', component: Home},
        {
            path: '/course', name: 'Course', component: Course, children: [
                {path: '/course/list', name: 'CourseListSearch', component: CourseList, meta: {title: '在线学习'}},
                {path: '/course/list/:search', name: 'CourseList', component: CourseList, meta: {title: '在线学习'}},
                {
                    path: '/course/:courseID/information',
                    name: 'CourseInformation',
                    component: CourseInformation,
                    meta: {title: '课程信息'}
                }
            ]
        },
        {
            path: '/project', name: 'Project', component: Project, children: [
                {path: '/project/list', name: 'ProjectListSearch', component: ProjectList, meta: {title: '项目实践'}},
                {path: '/project/list/:search', name: 'ProjectList', component: ProjectList, meta: {title: '项目实践'}},
                {
                    path: '/project/:projectID/information',
                    name: 'ProjectInformation',
                    component: ProjectInformation,
                    meta: {title: '项目信息'}
                }
            ]
        },        
        {path: '/passport/login', name: 'Login', component: Login, meta: {title: '登录'}},
        {path: '/passport/register', name: 'Register', component: Register, meta: {title: '注册'}},
        {path: '/passport/reset', name: 'Reset', component: Reset, meta: {title: '重置密码'}},
        {path: '/', name: 'Index', component: Index, meta: {title: "以太坊在线学习平台"}},
        {
            path: '/profile', name: 'Profile', component: Profile,
            children: [
                {path: '/profile/personal', name: 'personal', component: ProfilePersonal, meta: {title: '个人信息'}},
                {path: '/profile/wallet', name: 'wallet', component: ProfileWallet, meta: {title: '我的钱包'}},
                {path: '/profile/course', name: 'course', component: ProfileCourse, meta: {title: '我的课程'}},
                {path: '/profile/exam', name: 'exam', component: ProfileExam, meta: {title: '我的考试'}},
                {path: '/profile/project', name: 'project', component: ProfileProject, meta: {title: '我的项目'}},
                {path: '/profile/project_teacher', name: 'project_teacher', component: ProfileProject_teacher, meta: {title: '我的项目'}},
                {path: '/profile/attendapply_teacher', name: 'attendapply_teacher', component: ProfileAttendApplyManagement_teacher, meta: {title: '项目参加请求管理'}},
                {path: '/profile/createapply_teacher', name: 'createapply_teacher', component: ProfileCreateApplyManagement_teacher, meta: {title: '项目创建请求管理'}},
                {path: '/profile/projectmember_teacher', name: 'projectmember_teacher', component: ProfileProjectMember_teacher, meta: {title: '项目成员管理'}},

                {
                    path: '/profile/certificate',
                    name: 'certificate',
                    component: ProfileCertificate,
                    meta: {title: '我的证书'}
                }
            ]
        },
        {
            path: '/teacher/project', name: 'TeacherProject', component: TeacherProject, children: [
                {path: '/teacher/project/project', name: 'PP', component: PP, meta: {title: '项目管理'}},
                {path: '/teacher/project/attendapply', name: 'PAAM', component: PAAM, meta: {title: '项目报名申请管理'}},
                {path: '/teacher/project/createapply', name: 'PCAM', component: PCAM, meta: {title: '项目创建申请管理'}},
                {path: '/teacher/project/projectmember', name: 'PPM', component: PPM, meta: {title: '项目成员管理'}},
            ]
        },        
        {
            path: '/about', name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
})
