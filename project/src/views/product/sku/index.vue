<template>
    <div>
        <el-card>
            <el-table style="margin-bottom: 10px;" :data="skuArr">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="名称" show-overflow-tooltip width="150px" prop="skuName"></el-table-column>
                <el-table-column label="描述" show-overflow-tooltip width="150px" prop="skuDesc"></el-table-column>
                <el-table-column label="图片" width="150px">
                    <template #="{ row }">
                        <img :src="row.skuDefaultImg" :alt="row.skuName" style="width: 100px;height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="重量" prop="weight"></el-table-column>
                <el-table-column label="价格" prop="price"></el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template #="{ row }">
                        <el-button type="primary" :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
                            @click="updateSale(row)"></el-button>
                        <el-button type="primary" icon="Edit" @click="updateSku"></el-button>
                        <el-button type="primary" icon="InfoFilled" @click="findSku(row)"></el-button>
                        <el-popconfirm :title="`你确定删除${row.skuName}吗?`" width="200px" @confirm="removeSku(row.id)">
                            <template #reference>
                                <el-button type="primary" icon="Delete"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 切换页面,current-change会自动给方法注入页码 -->
            <!-- 改变页面容量,size-change会把每页容量注入 -->
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
                :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
                @current-change="getHasSku" @size-change="handler" />

            <!-- 抽屉组件，展示商品详情 -->
            <el-drawer v-model="drawer" title="展示商品详情" :before-close="handleClose">
                <span>
                    <el-row>
                        <el-col :span="6">名称</el-col>
                        <el-col :span="18">{{ skuInfo.skuName }}</el-col>
                    </el-row>
                    <el-row style="margin: 10px 0;">
                        <el-col :span="6">描述</el-col>
                        <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
                    </el-row>
                    <el-row style="margin: 10px 0;">
                        <el-col :span="6">价格</el-col>
                        <el-col :span="18">{{ skuInfo.price }}</el-col>
                    </el-row>
                    <el-row style="margin: 15px 0;">
                        <el-col :span="6">平台属性</el-col>
                        <el-col :span="18">
                            <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" style="margin: 5px 5px;">{{
                                item.valueName }}</el-tag>
                        </el-col>
                    </el-row>
                    <el-row style="margin: 10px 0;">
                        <el-col :span="6">销售属性</el-col>
                        <el-col :span="18">
                            <el-tag v-for="item in skuInfo.skuSaleAttrValueList" style="margin: 5px 5px;">{{
                                item.saleAttrValueName }}</el-tag>
                        </el-col>
                    </el-row>
                    <el-row style="margin: 20px 0;">
                        <el-col :span="6">商品图片</el-col>
                        <el-col :span="18">
                            <el-carousel :interval="4000" type="card" height="200px">
                                <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                                    <img :src="item.imgUrl" style="width: 100%;height: 100%;">
                                </el-carousel-item>
                            </el-carousel>
                        </el-col>
                    </el-row>
                </span>
            </el-drawer>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqRemoveSku } from '@/api/product/sku/index';
import type { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus/lib/components/index.js';
//分页器当前页
let pageNo = ref<number>(1);
//分页器每页数据数
let pageSize = ref<number>(10);
let total = ref<number>(0);
let skuArr = ref<SkuData[]>([]);
//控制抽屉的显示与隐藏
let drawer = ref<boolean>(false);
//存储商品信息
let skuInfo = ref<SkuData>({});
onMounted(() => {
    getHasSku();
})
//获取sku
const getHasSku = async (pager = 1) => {
    pageNo.value = pager;
    let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value);
    if (result.code == 200) {
        total.value = result.data.total;
        skuArr.value = result.data.records;
    }
}
const handler = (pg: number) => {
    // pageSize.value=pg;加不加都可以
    getHasSku();
}
//上架与下架
const updateSale = async (row: SkuData) => {
    //1代表上架，此时点击更新为下架
    if (row.isSale == 1) {
        //下架操作
        //断言，务必是number类型的id
        let result = await reqCancelSale((row.id as number));
        //提示
        ElMessage({
            type: 'success',
            message: '下架成功'
        })
        //发起请求
        getHasSku(pageNo.value);

    } else {
        //更新为上架
        await reqSaleSku((row.id as number));
        ElMessage({
            type: 'success',
            message: '上架成功'
        })
        getHasSku(pageNo.value); 2
    }
}
//更新SKU
const updateSku = () => { };
//查看商品详情按钮的回调
const findSku = async (row: SkuData) => {
    //展示抽屉
    drawer.value = true;
    //获取商品信息
    let result: SkuInfoData = await reqSkuInfo((row.id as number));
    skuInfo.value = result.data;
}
//删除商品
const removeSku = async (id: number) => {
    let result: any = await reqRemoveSku(id);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
    }else{
        ElMessage({
            type:'success',
            message:'删除失败'
        })
    }

}

// const handler=(num:number)=>{
//     pageNo.value=num;
//     getHasSku(pageNo.value);
// }
</script>
<script lang="ts">
export default {
    name: 'sku'
}
</script>
<style scoped lang="scss">
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>