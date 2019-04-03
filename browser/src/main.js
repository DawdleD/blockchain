import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import {
    Aside, Carousel, CarouselItem, Container, Main, Message,
    DatePicker,Upload
} from 'element-ui'

Vue.component(Aside.name, Aside);
Vue.component(Main.name, Main);
Vue.component(Container.name, Container);
Vue.component(Carousel.name, Carousel);
Vue.component(CarouselItem.name, CarouselItem);
Vue.component(DatePicker.name, DatePicker);
Vue.component(Message.name, Message);
Vue.component(Upload.name,Upload);
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
