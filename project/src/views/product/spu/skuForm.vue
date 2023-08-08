<template>
    <el-form label-width="80px">
        <el-form-item label="SKU名称">
            <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(g)">
            <el-input placeholder="重量(g)" type="number" v-model="skuParams.weight"></el-input>
        </el-form-item>
        <el-form-item label="SKU描述">
            <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form :inline="true">
                <el-form-item style="line-height: 50px;" :label="item.attrName" v-for="item in attrArr"
                    :key="item.id">
                    <el-select style="margin: 10px 0;" v-model="item.attrIdAndValueId" value-key="" placeholder="" clearable
                        filterable @change="">
                        <el-option :label="attrValue.valueName" :value="`${item.id}:${attrValue.id}`"
                            v-for="attrValue in item.attrValueList" :key="attrValue.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form :inline="true">
                <el-form-item :label="item.saleAttrName" v-for="item in SaleArr" :key="item.id">
                    <el-select v-model="item.saleIdAndValueId" value-key="" placeholder="" clearable filterable @change="">
                        <el-option :value="`${item.id}:${saleAttrValue.id}`"
                            v-for="saleAttrValue in item.spuSaleAttrValueList" :key="saleAttrValue.id"
                            :label="saleAttrValue.saleAttrValueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片名称">
            <el-table border :data="imgArr" ref="table">
                <el-table-column type="selection" width="100px" align="center">
                </el-table-column>
                <el-table-column label="图片">
                    <template #="{ row, $index }">
                        <img :src="row.imgUrl" style="width: 100px;height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="imgName"></el-table-column>
                <el-table-column label="操作">
                    <template #="{ row, $index }">
                        <el-button type="primary" size="default" style="width: 80px;" @click="handler(row)">操作</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item label="">
            <el-button type="primary" style="width: 80px;margin-right: 15px;" @click="save">保存</el-button>
            <el-button type="primary" style="width: 80px;" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import { reqAttr } from '@/api/product/attr';
import { reqSpuImageList, reqSpuHasSaleAttr,reqAddSku } from '@/api/product/spu';
import { defineEmits, reactive, ref } from 'vue';
import type { SkuData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus/lib/components/index.js';
//平台属性
let attrArr = ref<any>();
//销售属性
let SaleArr = ref<any>();
//照片的数据
let imgArr = ref<any>();
//获取table组件实例
let table = ref<any>();
//收集sku参数
let skuParams = reactive<SkuData>({
    //父组件传递过来的数据
    "category3Id": "",//三级分类的ID
    "spuId": "",//已有的SPU的ID
    "tmId": "",//SPU品牌的ID
    //v-model收集
    "skuName": "",//sku名字
    "price": "",//sku价格
    "weight": "",//sku重量
    "skuDesc": "",//sku的描述

    "skuAttrValueList": [//平台属性的收集
    ],
    "skuSaleAttrValueList": [//销售属性
    ],
    "skuDefaultImg": "",//sku图片地址
})
const cancel = () => {
    $emit('changeShow', { flag: 0, params: '' });
}
//子组件方法对外暴露
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
    skuParams.category3Id = spu.category3Id;
    skuParams.spuId = spu.id;
    skuParams.tmId = spu.tmId;
    //获取平台属性
    let result: any = await reqAttr(c1Id, c2Id, spu.category3Id);
    //获取对应销售属性
    let result1: any = await reqSpuHasSaleAttr(spu.id);
    //获取照片墙的数据
    let result2: any = await reqSpuImageList(spu.id);
    //存储数据
    attrArr.value = result.data;
    SaleArr.value = result1.data;
    imgArr.value = result2.data;
}
const handler = (row: any) => {

    //首先排他，把所有的全部取消选中
    imgArr.value.forEach((item: any) => {
        table.value.toggleRowSelection(item, false);
    })
    //其次将点击的复选框选中
    table.value.toggleRowSelection(row, true);
    skuParams.skuDefaultImg = row.imgUrl;
}
const save =async () => {
    //平台属性
    skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
        if (next.attrIdAndValueId) {
            let [attrId, valueId] = next.attrIdAndValueId.split(':');
            prev.push({
                attrId,
                valueId
            })
        }
        return prev;
    }, []);
    //销售属性
    skuParams.skuSaleAttrValueList=SaleArr.value.reduce((prev:any,next:any)=>{
        if(next.saleIdAndValueId){
            let [saleAttrId,saleAttrValueId]=next.saleIdAndValueId.split(':');
            prev.push({
                saleAttrId,
                saleAttrValueId
            })
        }
        return prev;
    },[])
    //添加SKU请求
    let result:any=await reqAddSku(skuParams);
    if(result.code==200){
        ElMessage({
            type:'success',
            message:'sku添加成功'
        })
        $emit('changeShow',{flag:0,params:''});
    }else{
        ElMessage({
            type:'error',
            message:'sku添加失败'
        })
    }
    
}
//自定义事件方法
let $emit = defineEmits(['changeShow'])
defineExpose({ initSkuData })
</script>
<style scoped lang="scss"></style>