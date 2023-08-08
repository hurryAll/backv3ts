import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import globalComponent from '@/components/index';
import router from './router/index';
import pinia from './store/index';
//引入文件，该文件执行
import './permission'
//获取应用实例
const app=createApp(App);
app.use(pinia);
//安装element-plus插件
app.use(ElementPlus, {
    locale: zhCn
})
//use自动运行install方法
app.use(globalComponent);
app.use(router);
import '@/styles/index.scss'
import 'virtual:svg-icons-register'
//暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css';
//自定义指令
import {isHasButton} from '@/directive/has';
isHasButton(app);
// axios({
//     url:'/api/user/login',
//     method:'post',
//     data:{
//         username:'admin',
//         password:'111111',
//     }
// })
app.mount('#app')
