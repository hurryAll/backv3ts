<template>
    <!-- 使用template进行循环，渲染的时候不会渲染template,用div也行,但是template更好 -->
    <template v-for="item in getMenuStore" :key="item.path">
        <!-- 当路由不存在子路由 -->
        <!-- index唯一标识 -->
        <template v-if="!item.children">
            <el-menu-item v-show="!item.meta.hide" :index="item.path" @click="goRoute">
                <!-- 这里有具名插槽 -->
                <el-icon>
                    <!-- 载入全局组件 -->
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
        </template>
        <!-- 当有子路由但是只有一个，就没有必要折叠 -->
        <template v-if="item.children && item.children.length == 1">
            <el-menu-item v-show="!item.children[0].meta.hide" :index="item.children[0].path" @click="goRoute">
                <el-icon>
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
                <template #title>
                    {{ item.children[0].meta.title }}
                </template>
            </el-menu-item>
        </template>
        <!-- 有子路由且多 -->
        <!-- 因为要进行递归，后方是否隐藏不肯定,因此设置为不隐藏，在内部重新筛查 -->
        <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 1">
            <!-- 一个插槽 -->
            <template #title>
                    <el-icon>
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
            </template>
            <Menu :getMenuStore="item.children"></Menu>
        </el-sub-menu>
    </template>
</template>
<script setup lang="ts">
defineProps(['getMenuStore']);
import { useRouter } from 'vue-router';
let $router = useRouter();
let goRoute = (vc) => {
    $router.push(vc.index)
}
</script>
<!-- 递归调用自身  要给递归设置名字 -->
<script lang="ts">
export default {
    name: 'Menu'
}
</script>
<style scoped lang="scss">
.el-menu-item:hover {
    background-color: rgb(212, 237, 229) !important;
    // color: red !important;
}

/* #cc:hover {
    background-color: aquamarine !important;
    color: red !important;
} */
</style>
<!-- <el-menu-item index="1">首页</el-menu-item>
<el-menu-item index="2">数据大屏</el-menu-item>
<el-sub-menu index="3">
    <template #title>权限管理</template>
    <el-menu-item index="3-1">用户管理</el-menu-item>
    <el-menu-item index="3-2">角色管理</el-menu-item>
    <el-menu-item index="3-3">菜单管理</el-menu-item>
</el-sub-menu> -->