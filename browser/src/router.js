import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Index from './views/Index'
import Login from './views/passport/Login'
import Register from './views/passport/Register'
import Reset from './views/passport/Reset'
import CourseList from './views/course/CourseList'


Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/home',
            name: 'Home',
            component: Home
        },
        {
            path: '/course/list',
            name: 'CourseList',
            component: CourseList
        },
        {
            path: '/passport/login',
            name: 'Login',
            component: Login,
            meta: {
                title: '登录'
            }
        },
        {
            path: '/passport/register',
            name: 'Register',
            component: Register,
            meta: {
                title: '注册'
            }
        },
        {
            path: '/passport/reset',
            name: 'Reset',
            component: Reset,
            meta: {
                title: '重置密码'
            }
        },
        {
            path: '/',
            name: 'index',
            component: Index,
            meta: {
                title: "以太坊在线学习平台"
            }
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
})
