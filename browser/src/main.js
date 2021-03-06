import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueLazyLoad from 'vue-lazyload'
import ELEMENT from 'element-ui'
Vue.use(ELEMENT)
// import {
//     Aside, Carousel, CarouselItem, Container, Main, Message,
//     MessageBox, DatePicker, Upload, Dialog, Pagination, Step, Steps,Table,TableColumn,Button,Tabs,TabPane,
//     Form,FormItem,Input,InputNumber,Dropdown,DropdownItem,DropdownMenu,Select,Option,Row,Col,
// } from 'element-ui'
/* Element-Ui 插件 S*/
// Vue.component(Button.name, Button);
// Vue.component(TableColumn.name, TableColumn);
// Vue.component(Table.name, Table);
// Vue.component(Aside.name, Aside);
// Vue.component(Main.name, Main);
// Vue.component(Container.name, Container);
// Vue.component(Carousel.name, Carousel);
// Vue.component(CarouselItem.name, CarouselItem);
// Vue.component(DatePicker.name, DatePicker);
// Vue.component(Dialog.name, Dialog);
// Vue.component(Message.name, Message);
// Vue.component(MessageBox.name, MessageBox);
// Vue.component(Upload.name, Upload);
// Vue.component(Pagination.name, Pagination);
// Vue.component(Step.name, Step);
// Vue.component(Steps.name, Steps);
// Vue.component(Tabs.name,Tabs);
// Vue.component(TabPane.name,TabPane);
// Vue.component(Form.name, Form);
// Vue.component(FormItem.name, FormItem);
// Vue.component(Input.name,Input);
// Vue.component(InputNumber.name,InputNumber);
// Vue.component(Dropdown.name, Dropdown);
// Vue.component(DropdownItem.name,DropdownItem);
// Vue.component(DropdownMenu.name,DropdownMenu);
// Vue.component(Select.name,Select);
// Vue.component(Option.name,Option);

// Vue.component(Col.name,Col);
// Vue.component(Row.name,Row);
/* Element-Ui 插件 E*/

import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faChevronLeft, faChevronRight, faSearch, faWallet, faCog, faSignOutAlt,
    faAddressCard, faBookOpen, faFileAlt, faTasks, faAward, faEnvelope,
    faInfoCircle, faAngleRight, faLongArrowAltDown, faThLarge, faBook,
    faPlayCircle, faVideo, faCalendarAlt, faFileImage, faFileArchive,
    faFilePdf, faFilePowerpoint, faFileWord, faFileExcel, faStar, faCheck,
    faTimes, faPlus, faCheckCircle, faShieldAlt, faMobileAlt, faTimesCircle,
    faUser, faLock, faExchangeAlt
} from '@fortawesome/free-solid-svg-icons'

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
/* font-awesome 图标库 E*/
library.add(
    faChevronRight, faChevronLeft, faSearch, faWallet, faCog, faSignOutAlt,
    faAddressCard, faBookOpen, faFileAlt, faTasks, faAward, faEnvelope,
    faInfoCircle, faAngleRight, faLongArrowAltDown, faThLarge, faBook,
    faPlayCircle, faVideo, faCalendarAlt, faFileImage, faFileArchive,
    faFilePdf, faFilePowerpoint, faFileWord, faFileExcel, faStar, faCheck,
    faTimes, faPlus, faCheckCircle, faShieldAlt, faMobileAlt, faTimesCircle,
    faUser, faLock, faExchangeAlt
);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VueLazyLoad);

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
