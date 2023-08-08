<template>
    <el-card>
        <el-form :inline="true">
            <el-form-item label="一级分类">
                <el-select :disabled="!flag" placeholder="" v-model="categoryStore.c1Id" @change="handler">
                    <!-- 把选择后的选项通过value传递给下一级 -->
                    <el-option :label="c1.name" :value="c1.id" v-for="c1 in categoryStore.c1Arr" :key="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <!-- value是收集的数据，收集给v-model绑定的那一方 -->
                <el-select :disabled="!flag" placeholder="" v-model="categoryStore.c2Id" @change="handler1">
                    <el-option :label="c2.name" v-for="c2 in categoryStore.c2Arr" :key="c2.id" :value="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select :disabled="!flag" placeholder="" v-model="categoryStore.c3Id">
                    <el-option v-for="c3 in categoryStore.c3Arr" :label="c3.name" :key="c3.id" :value="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup lang="ts">
import { onMounted,defineProps } from 'vue';
import useCategoryStore from '@/store/modules/category';
let categoryStore=useCategoryStore();
onMounted(()=>{
    categoryStore.getC1();
})
let handler=()=>{
    //当选好了三级分类，又想改变一级分类，需要把下方的数据都清空
    categoryStore.c2Arr=[];
    categoryStore.c2Id='';
    categoryStore.c3Arr=[];
    categoryStore.c3Id='';
    categoryStore.getC2();
}
// 将二级分类选的id交给三级
let handler1=()=>{
    //有了三级想改2级，清空3级数据
    categoryStore.c3Arr=[];
    categoryStore.c3Id='';
    categoryStore.getC3();
}
defineProps(['flag'])
</script>
<style scoped lang="scss"></style>