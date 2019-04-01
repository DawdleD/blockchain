import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import {Carousel, CarouselItem, Message} from 'element-ui'

Vue.component(Carousel.name, Carousel);
Vue.component(CarouselItem.name, CarouselItem);
Vue.component(Message.name, Message);
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
