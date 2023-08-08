<template>
    <div class="logo" v-if="setting.useLogo">
        <img :src="setting.logo"  alt="">
        <p v-show="!store.fold">{{ setting.logoText }}</p>
    </div>
</template>
<script setup lang="ts">
import setting from '../../../setting'
import useLayOutSettingStore from '@/store/modules/setting.ts'
let store=useLayOutSettingStore();
</script>
<script lang="ts">
export default{
    name:'Logo'
}
</script>
<style lang="scss" scoped>
    .logo{
        width: 100%;
        height: $base-logo-height;
        display: flex;
        align-items: center;
        padding: 10px;
        img{
            margin-top: 5px;
            margin-left: 5px;
            width: 65px;
            height: 65px;
            border-radius: 60px;
        }
        p{
            font-size: $base-logo-title-fontSize;
            margin-left: 15px;
            margin-top: 6px;
        }
    }
</style>