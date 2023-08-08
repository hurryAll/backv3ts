<template>
    <el-card>
        <div class="box">
            <img :src="userStore.avatar" alt="" class="avatar">
            <div class="bottom">
                <h3 class="title">{{ getTime() }}{{ userStore.username }}</h3>
                <p class="subtitle">Vue3+ts网页</p>
            </div>
        </div>
    </el-card>
    <div class="last">
        <svg-icon name="welcome" width="500px" height="400px"></svg-icon>
    </div>
</template>
<script setup lang="ts">
import useUserStore from '@/store/modules/user';
import { getTime } from '@/utils/time';
//获取存储用户数据的仓库对象
let userStore = useUserStore();
</script>
<style scoped lang="scss">
.box {
    display: flex;
    .avatar{
        width: 180px;
        height: 180px;
        border-radius:180px;
    }
    .bottom{
        margin-top: 50px;
        margin-left: 30px;
    }
    .title{
        font-size: 35px;
        font-weight: 900;
        margin-bottom: 30px;
    }
    .subtitle{
        font-style: italic;
        color: rgba(71, 211, 169, 0.545);
    }
}
.last{
    display: flex;
    justify-content: center;
}
</style>