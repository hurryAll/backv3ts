//路由鉴权:路由跳转的权限设置
import router from "./router";
import nprogress from 'nprogress';
nprogress.configure({showSpinner:false});
//当在大仓库所在文件夹外调用小仓库时，需要一起调用大仓库才能使用
import pinia from "./store";
import useUserStore from './store/modules/user'
let userStore=useUserStore(pinia);
//引入样式
import "nprogress/nprogress.css"
//全局前置守卫,切换路由的钩子
router.beforeEach(async (to:any,from:any,next)=>{
    nprogress.start();
    let token=userStore.token;
    //每次切换页面检查token(是否登陆过的凭证)是否存在
    if(token){
        if(to.path=='/login'){
            next({path:'/'})
        }else{
            //如果登录成功有用户信息则放行
            if(userStore.username){
                next();
                //没有则获取信息后放行
            }else{
                try {
                    //获取用户信息后放行
                    await userStore.userInfo();
                    //若加载的是异步路由，可能还没加载出来就放行，因此需要等加载完毕后放行
                    // 按照老师的写法会出现死循环, 替换成这个即可解决:  next({...to,replace:true})
                    next({...to,replace:true})
                } catch (error) {
                    console.log(error);
                    //登陆成功，但获取信息失败(即token过期了)
                    //退出登录，删除所有信息并重新登录
                    await userStore.userLogout()
                    next({path:'/login',query:{redirect:to.path}});
                }
            }
        }
    }else{
        //token失效或者从来没登录过,就去登录
        if(to.path=='/login'){
            next();
        }else{
            next({path:'/login',query:{redirect:to.path}})
        }
    }
})
//全局后置
router.afterEach((to:any,from:any,next)=>{
    document.title="vue3-"+to.meta.title;
    nprogress.done();
})
