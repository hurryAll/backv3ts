<template>
    <div class="layout_container">
        <div class="layout_slider" :class="{fold:store.fold?true:false}">
            <logo></logo>
            <!-- 左侧功能菜单  滚动 -->
            <!-- :class="{ fold: store.fold ? true : false }"  不加这个就相当于右侧压住了左侧，左侧宽度不变 -->
            <el-scrollbar class="scrollBar">
                <!-- <p v-for="item in 200" :key="item" class="scrollbar-demo-item">{{ item }}</p> -->
                <!-- default-active默认激活，当直接通过网址跳转路由时，会让激活的页面高亮(否则还会是最开始的页面高亮，不会同步) -->
                <el-menu :collapse="store.fold" :collapse-transition="false" :default-active="$route.path" background-color="$base-menu-background" text-color="black"
                    active-text-color="blue">
                    <Menu :getMenuStore="menu.menuRouters"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>
        <div class="layout_tabber" :class="{ fold: store.fold ? true : false }">
            <Tabber></Tabber>
        </div>
        <div class="layout_main" :class="{ fold: store.fold ? true : false }">
            <!-- 二级路由显示处 -->
            <!-- 封装 -->
            <Main></Main>
        </div>
    </div>
</template>
<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router';
import logo from './logo/index.vue';
import Menu from './menu/index.vue'
import useMenuStore from '../../store/modules/user';
import Main from '@/components/main/index.vue';
import Tabber from './tabbar/index.vue'
let store = useLayOutSettingStore();
let menu = useMenuStore()
let $route = useRoute();
// console.log($route.path);每次刷新只触发一次

</script>
<script lang="ts">
export default {
    name: 'Tabbar'
}
</script>
<style lang="scss" scoped>
.layout_container {
    width: 100%;
    height: 100vh;
    // background: yellowgreen;

    .layout_slider {
        width: $base-menu-width;
        height: 100vh;
        background: $base-menu-background;
        transition: all 0.3s;

        .scrollBar {
            // width: 100%;
            width: $base-menu-width;
            height: calc(100vh - $base-logo-height);

            .el-menu {
                border-right: none;
            }
        }

        // 当样式是后来创建的,要加且&
        &.fold {
            width: $base-menu-min-width;
        }
    }

    .layout_tabber {
        width: calc(100% - $base-menu-width); //计算100%减去左侧菜单栏后的宽度
        height: $base-tabber-height;
        position: fixed; //固定定位
        top: 0;
        left: $base-menu-width;
        // background: rgb(243, 234, 241);
        transition: all 0.3s;
        &.fold {
            width: calc(100vw - $base-menu-min-width);
            left:$base-menu-min-width;
        }
    }

    .layout_main {
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabber-height);
        position: absolute;
        top: $base-tabber-height;
        left: $base-menu-width;
        // background: rgb(212, 169, 245);
        // background-color: rgb(74, 82, 90);
        padding: 30px;
        overflow: auto;
        transition: all 0.3s;
        &.fold{
            width: calc(100vw - $base-menu-min-width);
            left:$base-menu-min-width;
        }
    }
}</style>