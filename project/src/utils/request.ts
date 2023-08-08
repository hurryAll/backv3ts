//1.对axios进行二次封装，使用请求与响应拦截器
import axios from 'axios';
import { ElMessage } from 'element-plus/lib/components/index.js';
import useUserStore from '@/store/modules/user';
import { useRouter } from 'vue-router';
let request=axios.create({
    baseURL:import.meta.env.VITE_APP_BASE_API,//基础路径上会自动携带/api
    timeout:5000,
})
//2.给request添加请求和响应拦截器
request.interceptors.request.use((config)=>{
    //config配置对象，包含headers属性请求头等，经常给服务器携带公共参数
    //必须返回config才行
    let userStore=useUserStore();
    let $router=useRouter();
    if(userStore.token){
        config.headers.token=userStore.token;
    }
    
    return config;
})
//第三步:响应拦截器
request.interceptors.response.use(
    (response) => {
      //成功回调
      //简化数据
      return response.data
    },
    (error) => {
      //失败回调:处理http网络错误的
      //定义一个变量:存储网络错误信息
      let message = ''
      //http状态码
      const status = error.response.status
      switch (status) {
        case 401:
          message = 'TOKEN过期'
          break
        case 403:
          message = '无权访问'
          break
        case 404:
          message = '请求地址错误'
          break
        case 500:
          message = '服务器出现问题'
          break
        default:
          message = '网络出现问题'
          break
      }
      //提示错误信息
      ElMessage({
        type: 'error',
        message,
      })
      return Promise.reject(error)
    },
  )
export default request;