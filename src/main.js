import Vue from 'vue'
import Index from './Index.vue'
import {routes} from './route.js'

import 'ant-design-vue/dist/antd.css';
import axios from 'axios'

// 部分引入antd组件
// import {Layout, Menu, Breadcrumb, Icon} from 'ant-design-vue';
// Vue.use(Layout);
// Vue.use(Menu);
// Vue.use(Breadcrumb);
// Vue.use(Icon);

// 全部引入antd组件
import Antd from 'ant-design-vue';
Vue.use(Antd);

// 引入vue router
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// vuex状态管理
import Vuex from 'vuex'
Vue.use(Vuex);

// axios改写为vue的全局属性，方便使用
Vue.prototype.$axios= axios

// 引入echarts。改为每个页面按需引入，最小引入原则
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts

// vue configs
Vue.config.productionTip = false

// 路由
const router = new VueRouter({
  routes // short for `routes: routes`
});
// 全局存储
const store = new Vuex.Store({
  state:{
    breadcrumbs:[
      { path: '/', breadcrumbName: '首页', breadcrumbIcon: 'home'}
    ],
    queryParams: new Map(),
  },
  mutations: {
    addBreadcrumb(state, breadcrumb) {
      // window.console.log('addBreadcrumb:', breadcrumb);
      state.breadcrumbs.push(breadcrumb);
    },
    removeBreadcrumb(state, index) {
      // window.console.log('removeBreadcrum:', index);
      state.breadcrumbs.splice(index + 1, state.breadcrumbs.length);
    },
    saveQueryParams(state, params) {
      window.console.log('save query param', state, params)
      state.queryParams.set(params.path, params.param)
    },
    removeQueryParam(state, path) {
      window.console.log('remove query param', state, path)
    }
  }
})

new Vue({
  render: h => h(Index),
  router,
  store,
}).$mount('#app')
