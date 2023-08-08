import {createRouter,createWebHashHistory} from 'vue-router';
import { allRouters } from './routes';
let router=createRouter({
    history:createWebHashHistory(),
    //配置路由
    routes:allRouters,
    //路由切换的滚动行为
    scrollBehavior(){
        return{
            left:0,
            top:0
        }
    }
})
export default router;
