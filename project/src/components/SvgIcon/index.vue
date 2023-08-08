<template>
    <div>
        <!-- 键值一致省略 -->
        <svg :style="{width,height}">
      <!-- 属性值务必以 # icon- 开头 -->
      <use :xlink:href="prefix+name" :fill=color></use>
    </svg>
    </div>
</template>
<script setup lang="ts">
//接收父组件传递过来的参数
defineProps({
    prefix:{
        type:String,
        default:'#icon-'
    },
    //提供使用的图标名字
    name:String,
    color:{
        type:String,
        default:'black'
    },
    width:{
        type:String,
        default:'16px'
    },
    height:{
        type:String,
        default:'16px'
    }
})
</script>
<style scoped></style>