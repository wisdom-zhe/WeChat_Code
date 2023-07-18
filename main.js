
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 导入网络请求数据包
import {$http} from '@escook/request-miniprogram'

// 对象绑定
uni.$http=$http
// 配置全局的请求路径
$http.baseUrl='https://api-hmugo-web.itheima.net/'

// 封装数据请求失败弹框方法
uni.$showMsg=function(title='数据请求失败！',duration=1500){
  uni.showToast({
    title,
    duration,
    icon:'none',
  })
}

// 拦截器
$http.beforeRequest=function(options){
  uni.showLoading({
    title:'数据请求中....'
  })
}

// 响应后的要做的事情
$http.afterRequest=function(){
  uni.hideLoading()
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif