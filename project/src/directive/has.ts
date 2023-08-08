import pinia from "@/store";
import useUserStore from '@/store/modules/user'
let userStore=useUserStore();
export const isHasButton=(app:any)=>{
//全局自定义指令
app.directive('has',{
    //代表使用这个指令的dom的生命周期
    //el就是使用这个指令的dom元素
    //option可以收集参数等
    mounted(el:any,option:any){
        if(!userStore.buttons.includes(option.value)){
            el.parentNode.removeChild(el);
        }
        
    }
})
}