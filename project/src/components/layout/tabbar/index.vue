<template>
    <div class="tabbar">
        <div class="tabbar_left">
            <TabLeft></TabLeft>
        </div>
        <!-- 右侧 -->
            <TabRight></TabRight>
    </div>
</template>
<script setup lang="ts">
import TabLeft from './tabbar-left/index.vue';
import TabRight from './tabbar-right/index.vue';
</script>
<style scoped lang="scss">
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    // background-image: linear-gradient(to right, white, yellowgreen, white);
    background-color: rgb(25, 57, 101);
    .tabbar_left {
        display: flex;
        //在垂直方向居中align-items    水平justify-content
        align-items: center;
        margin-left: 20px;
    }

    .tabbar_right {
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            margin-left: 10px;
            margin-right: 10px;
        }
    }
}
</style>