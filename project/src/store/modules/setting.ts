//小仓库：layout组件相关配置仓库
import {defineStore} from 'pinia'

let useLayOutSettingStore=defineStore('SettingStore',{
    state:()=>{
        return{
            fold:false,//控制折叠
            refresh:true,//控制刷新按钮
        }
    }
})
export default useLayOutSettingStore;