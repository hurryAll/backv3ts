<template>
    <div class="tabbar_right">
        <el-button size="default" circle icon="Refresh" @click="fresh"></el-button>
        <el-button size="default" circle icon="FullScreen" @click="fullScreen"></el-button>
        <el-popover palcement="bottom" title="主题设置" :width="300" trigger="hover">
            <el-form>
                <el-form-item label="主题颜色">
                    <el-color-picker @change="setColor" v-model="color" show-alpha :predefine="predefineColors" size="small" />
                </el-form-item>
                <el-form-item label="暗黑模式">
                    <el-switch @change="changeDark" v-model="dark" size="large" style="margin-left: 10px;" inline-prompt="true" active-icon="MoonNight" inactive-icon="Sunny"/>
                </el-form-item>
            </el-form>
            <template #reference>
                <el-button size="default" circle icon="Setting"></el-button>
            </template>
        </el-popover>
        <img :src="userStore.avatar" alt="" style="width: 24px;height: 24px;margin:0 5px;border-radius: 50%;">
        <!-- 下拉菜单 -->
        <el-dropdown style="margin-right: 20px;">
            <span class="el-dropdown-link">
                {{ userStore.username }}
                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import useLayOutSettingStore from '@/store/modules/setting';
import useUserStore from '@/store/modules/user';
import { useRouter, useRoute } from 'vue-router';
let $router = useRouter();
let userStore = useUserStore();
let store = useLayOutSettingStore();
let $route = useRoute();
//收集开关
let dark=ref<boolean>(false);
//颜色组件数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])
//点击刷新
let fresh = () => {
    store.refresh = !store.refresh;
}
//点击全屏
let fullScreen = () => {
    //检查是否全屏，并返回布尔值
    let full = document.fullscreenElement;
    if (!full) {
        //实现全屏
        document.documentElement.requestFullscreen();
    } else {
        //退出全屏
        document.exitFullscreen();
    }
}
let logout = async () => {
    await userStore.userLogout();
    $router.push({ path: '/login', query: { redirect: $route.path } });
}
//switch开关的change事件进行暗黑模式的切换
const changeDark=()=>{
    //获取html根节点
    let html=document.documentElement;
    console.log(html);
    //判断是否有类名
    dark.value?html.className='dark':html.className='';
}
//主题颜色的设置
const setColor=()=>{
    const html=document.documentElement;
    html.style.setProperty('--el-color-primary',color.value);
}
</script>
<style scoped lang="scss"></style>