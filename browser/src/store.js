import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        effectiveTime: '',
        loginState: false,
        avatarUrl: '',
        nickname: ''
    },
    mutations: {
        login: (state, payload) => {
            state.effectiveTime = payload;
            state.loginState = true;
        },
        exit: state => {
            state.loginState = false;
        },
        changeAvatarUrl: (state, payload) => {
            state.avatarUrl = payload;
        },
        changeNickname: (state, payload) => {
            state.nickname = payload;
        }
    },
    actions: {}
})
