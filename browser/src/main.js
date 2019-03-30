import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import {Notification, Button} from 'element-ui'


Vue.use(Button);
Vue.component(Notification.name, Notification);
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
