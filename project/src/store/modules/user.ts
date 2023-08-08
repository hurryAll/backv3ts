//创建用户相关的小仓库
import { defineStore } from 'pinia'
// import { reqLogin,reqUserInfo } from '@/api/user';
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user';
// import { loginForm,loginResponseData } from '@/api/user/type';
import type {loginFormData,loginResponseData,userInfoReponseData,} from '@/api/user/type'
import type { UserState } from '../types/type';
import router from '@/router';
import { allRouters,asyncRouters,anyRouters } from '../../router/routes';
//引入深拷贝方法
//@ts-ignore  忽略文件ts校验
import cloneDeep from 'lodash/cloneDeep';
function filterAsyncRoute(asyncRoute:any,routes:any){
    return asyncRoute.filter((item:any)=>{
        if(routes.includes(item.name)){
            if(item.children&&item.children.length>0){
                item.children=filterAsyncRoute(item.children,routes);
            }
            return true;
        }
    })
}

let userStore = defineStore('Users', {
    state: (): UserState => {
        return {
            token: localStorage.getItem('TOKEN'),
            menuRouters: allRouters,//存储菜单页面的路由信息
            username: '',
            avatar: '',
            //存储用户包含的按钮
            buttons:[]
        }
    },
    actions: {
        async userLogin(data: loginFormData) {
            let result: loginResponseData = await reqLogin(data);
            
            //判断登录
            if (result.code === 200) {
                //断言  保证右方是字符串的情况下赋值给token
                this.token = (result.data as string)
                localStorage.setItem('TOKEN', (result.data as string))
                //返回成功的
                return 'ok'
            } else {
                //但会失败的promise对象    返回错误的原因的文字给组件
                return Promise.reject(new Error(result.data))
            }
        },
        async userInfo() {
            let result:userInfoReponseData = await reqUserInfo();
            console.log(result.data.routes);
            if (result.code === 200) {
                this.username = result.data.name;
                this.avatar = result.data.avatar;
                this.buttons=result.data.buttons;
                //深拷贝,防止filter过滤对原数组产生影响
                let userAsyncRoute=filterAsyncRoute(cloneDeep(asyncRouters),result.data.routes);
                //菜单数据
                this.menuRouters=[...allRouters,...userAsyncRoute,...anyRouters];
                //目前路由只注册了常量路由,需要动态追加用户剩余路由
                [...userAsyncRoute,...anyRouters].forEach((route:any)=>{
                    //向路由对象追加路由
                    router.addRoute(route);
                })
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
        async userLogout() {
            let result:any = await reqLogout();
            if (result.code == 200) {
                this.token = '';
                this.username = '';
                this.avatar = '';
                localStorage.removeItem('TOKEN');
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message));
            }
        }
    },
    getters: {}
})
//对外暴露小仓库
export default userStore;