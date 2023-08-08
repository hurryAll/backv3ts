<template>
    <div>
        <Category :flag="flag"></Category>
        <el-card style="margin: 10px 0;">
            <div v-show="show == 0 ? true : false">
                <el-button type="primary" icon="Plus" style="width: 100px;" :disabled="categoryStore.c3Id ? false : true"
                    @click="addSpu">添加SPU</el-button>
                <el-table style="margin: 10px 0;" border :data="records">
                    <el-table-column label="序号" align="center" type="index" width="80px"></el-table-column>
                    <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                    <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
                    <el-table-column label="SPU操作">
                        <template #="{ row, index }">
                            <el-button type="primary" icon="Plus" style="width: 40px;" title="添加SKU"
                                @click="addSku(row)"></el-button>
                            <el-button type="primary" icon="Edit" style="width: 40px;" title="修改SPU"
                                @click="updateSpu(row)"></el-button>
                            <el-button type="primary" icon="View" style="width: 40px;" title="查看SKU"
                                @click="findSku(row)"></el-button>
                            <el-popconfirm :title="`你确定删除${row.spuName}吗`" width="200px" @confirm="deleteSpu(row)">
                                <template #reference>
                                    <el-button type="primary" icon="Delete" style="width: 40px;" title="删除SPU"></el-button>
                                </template>
                            </el-popconfirm>

                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <!-- current-change当每页变化时触发 -->
                <!-- size-change是每页容量变化触发 -->
                <!-- 为什么这里的size-change不直接调用getHasSpu:这两种事件会分别注入当前页或页面大小,因此如果直接调用getHasSpu则注入了页面大小,同时会注入当前页面,因此先调用一个函数再说 -->
                <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                    :background="true" @current-change="getHasSpu" @size-change="changeSize"
                    layout="prev, pager, next, jumper,->,sizes,total" :total="total" />
            </div>
            <spuForm ref="SpuForm" v-show="show == 1 ? true : false" @changeShow="changeShow"></spuForm>
            <skuForm ref="sku" v-show="show == 2 ? true : false" @changeShow="changeShow"></skuForm>
            <el-dialog v-model="showDig" title="SKU列表">
                <el-table :data="skuArr">
                    <el-table-column label="sku名字" prop="skuName"></el-table-column>
                    <el-table-column label="sku价格" prop="price"></el-table-column>
                    <el-table-column label="sku重量" prop="weight"></el-table-column>
                    <el-table-column label="sku图片">
                        <template #="{ row, $index }">
                            <img :src="row.skuDefaultImg" :alt="row.skuName" style="width: 100px;height: 100px;">
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import spuForm from '@/views/product/spu/spuForm.vue';
import skuForm from '@/views/product/spu/skuForm.vue';
import { HasSpuResponseData, Records, SkuInfoData, SkuData } from '@/api/product/spu/type';
import useCategoryStore from '@/store/modules/category';
import { ref, watch,onBeforeUnmount } from 'vue';
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu/index';
import type { SpuData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus/lib/components/index.js';
let flag = ref<boolean>(true);
let show = ref<number>(2);
let categoryStore = useCategoryStore();
//默认页数
let pageNo = ref<number>(1);
//每页展示数据数量
let pageSize = ref<number>(3);
//存储已有的spu数据
let records = ref<Records>([]);
let total = ref<number>(0);
//获取组件实例
let SpuForm = ref<any>();
//获取子组件实例
let sku = ref<any>();
//存储所有SKU数据
let skuArr = ref<SkuData[]>([]);
//控制dialog sku展示
let showDig = ref<boolean>(false);
watch(() => categoryStore.c3Id, () => {
    if (!categoryStore.c3Id) return;
    getHasSpu();
})
const getHasSpu = async (pager = 1) => {
    //默认第一页，当传参则按照传的来
    pageNo.value = pager;
    let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id);
    if (result.code == 200) {
        records.value = result.data.records;
        total.value = result.data.total;
    }
}
const changeSize = () => {
    getHasSpu();
}
const addSpu = () => {
    show.value = 1;
    //调用子组件的方法初始化数据
    SpuForm.value.initAddSpu(categoryStore.c3Id);
}
const changeShow = (obj: any) => {
    show.value = obj.flag;
    if (obj.params == 'update') {
        //如果是更新则修改后保留在本业
        getHasSpu(pageNo.value);
    } else {
        //新增跳转到第一页
        getHasSpu();
    }
}
const updateSpu = (row: SpuData) => {
    show.value = 1;
    SpuForm.value.initgetSpu(row);
}
const addSku = (row: SpuData) => {
    //切换展示页面
    show.value = 2;
    sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row);
}
//查看sku列表的数据
const findSku = async (row: SpuData) => {
    let result: SkuInfoData = await reqSkuList((row.id as number));
    if (result.code == 200) {
        skuArr.value = result.data;
        //对话框显示
        showDig.value = true;
    }

}
const deleteSpu = async (row: SpuData) => {
    let result: any = await reqRemoveSpu((row.id as number));
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        //删除后重新获取剩余SPU数据
        getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1);
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }

}
    //路由组件销毁前,清空仓库数据
    onBeforeUnmount(()=>{
        categoryStore.$reset();
    })
</script>
<script lang="ts">
export default {
    name: 'hhhhhhh'
}
</script>
<style scoped lang="scss"></style>