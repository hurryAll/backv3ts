<template>
    <div class="box">
        <!-- <h1>404</h1> -->
        <img src="../../assets/images/error_images/404.png">
        <button @click="goHome">返回首页</button>
    </div>
</template>
<script setup lang="ts">
import {useRouter} from 'vue-router';
let $router=useRouter();
let goHome=()=>{
    $router.push('/home');
}
</script>
<style scoped lang="scss">
.box{
    width: 100vw;
    height: 100vh;
    background: rgb(136, 208, 28);
    img{
        margin: 0 auto;
        width: 700px;
        height: 400px;
    }
    button{
        display: flex;
        text-align: center;
        line-height: 30px;
        width: 67px;
        height: 30px;
        border: 1px solid black;
        margin: 0 auto;
    }
}
</style>