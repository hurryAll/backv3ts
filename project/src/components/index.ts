//引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
//引入element-plus提供全部图标的组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// console.log(ElementPlusIconsVue);
import Category from '@/components/Category/index.vue';
// const allGlobalComponent={SvgIcon};
import { App, Component } from 'vue';
// { [name: string]: Component }
const allGlobalComponent:any = { SvgIcon,Category };
export default {
    install(app: App) {
        //获取对象的键，或字符串、数组的值
        Object.keys(allGlobalComponent).forEach((key: string) => {
            //将组件全局注册
            app.component(key, allGlobalComponent[key]);
        })
        //将图标全局注册
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
    }
}