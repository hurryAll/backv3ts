<template>
  <div>
    <!-- 一级路由放置处(一级就是一级该放的地方，二级是二级的地方，二级在一级里，一级也渲染出来) -->
    <router-view></router-view>
    </div>
</template>
<script setup lang="ts">
// 引入图标组件

// import { onMounted } from 'vue';
// import {reqLogin} from '../src/api/user/index'
//@ts-ignore
import { Plus } from '@element-plus/icons-vue'
// console.log(import.meta.env);获取配置信息

// onMounted(()=>{
//   reqLogin({
//     username:'admin',
//     password:'111111'
//   })

  // request({
  //   url:'/user/login',
  //   method:'post',
  //   data:{
  //     username:'admin',
  //     password:'111111'
  //   }
  // }).then(res=>{
  //   console.log(res);
  // })
// })
</script>


<style scoped lang="scss">
div{
  h1{
    color:$color;
  }
}
</style>