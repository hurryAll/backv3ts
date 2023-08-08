//统一管理咱们项目用户相关的接口
import request from '@/utils/request'
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from './type'
//项目用户相关的请求地址
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

//登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息
export const reqUserInfo = () =>
  request.get<any, userInfoReponseData>(API.USERINFO_URL)
//退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
  

// mock统一管理接口
// enum API{
//     LOGIN_URL="/user/login",
//     USERINFO_URP="/user/info"
// }
// //登录接口   ts接口用来规范数据类型
// export const reqLogin=(data:loginForm)=>request.post<loginResponseData>(API.LOGIN_URL,data)
// //获取用户信息
// export const reqUserInfo=()=>request.get<userResponseData>(API.USERINFO_URP)