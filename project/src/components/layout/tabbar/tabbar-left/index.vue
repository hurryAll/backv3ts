<template>
    <!-- 顶部左侧静态 -->
    <el-icon style="margin-right: 10px;" @click="changeIcon">
        <!-- <Expand /> -->
        <!-- 调用全局组件 -->
        <component :is="store.fold?'Fold':'Expand'"></component>
    </el-icon>
    <!-- 左侧面包屑动态展示路由的名字与图标 -->
    <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index" v-show="item.meta.title">
            <el-icon style="margin: 0 5px;">
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{item.meta.title}}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import useLayOutSettingStore from '@/store/modules/setting';
import { useRoute } from 'vue-router';
let store=useLayOutSettingStore();
// let fold=ref(false);
let changeIcon=()=>{
    store.fold=!store.fold
}
let $route=useRoute();
</script>
<script lang="ts">
export default{
    name:'TabLeft'
}
</script>
<style scoped lang="scss"></style>