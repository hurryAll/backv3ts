<template>
    <!-- row与$index的含义:$index表示第几行,row是table所绑定的对象实例 -->
    <el-form label-width="100px">
        <el-form-item label="SPU名称">
            <el-input placeholder="请输入spu名称" v-model="SpuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select placeholder="" v-model="SpuParams.tmId">
                <el-option v-for="(item, index) in AllTradeMark" :value="item.id" :label="item.tmName"
                    :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input placeholder="" type="textarea" v-model="SpuParams.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
            <!-- action图片上传的接口地址
                list-type上传文件的展示类型
                on-preview点击文件触发
             -->
            <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handlerUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>

            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;height: 100%;" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性">
            <el-select v-model="saleAttrIdAndValueName"
                :placeholder="unSelectSaleAttr ? `${unSelectSaleAttr.length}项未选择` : '选择完毕'">
                <el-option v-for="(item, index) in unSelectSaleAttr" :key="item.id" :value="`${item.id}:${item.name}`"
                    :label="item.name"></el-option>
            </el-select>
            <el-button @click="addSaleAttr" :disabled="saleAttrIdAndValueName ? false : true" type="primary" icon="Plus"
                style="width:110px;margin-left: 15px;">添加属性值</el-button>
            <el-table style="margin: 10px 0;" border :data="saleAttr">
                <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
                <el-table-column label="销售属性名称" width="150px" prop="saleAttrName"></el-table-column>
                <el-table-column label="销售属性值">
                    <template #="{ row, $index }">
                        <el-tag @close="row.spuSaleAttrValueList.splice($index, 1)" style="margin-right: 5px;"
                            v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" class="mx-1" closable>
                            {{ item.saleAttrValueName }}
                        </el-tag>
                        <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag == true" placeholder=""
                            size="small" style="width: 100px;"></el-input>
                        <el-button v-else @click="toEdit(row)" type="success" size="small" icon="Plus"
                            style="width: 35px;margin-left: 3px;"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template #="{ row, $index }">
                        <el-button type="danger" size="small" icon="Delete" title="删除" style="width: 40px;"
                            @click="saleAttr.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" :disabled="saleAttr.length > 0 ? false : true" @click="save"
                style="width: 60px;">保存</el-button>
            <el-button type="primary" style="width: 60px;" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import { type SpuData, type SpuHasImg, type SaleAttrResponseData, type HasSaleAttrResponseData, type AllTradeMark, type Trademark, type SpuImg, type SaleAttr, HasSaleAttr, SaleAttrValue } from '@/api/product/spu/type';
import { reqAllTradeMark, reqSpuHasSaleAttr, reqSpuImageList, reqAllSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu';
import { computed, defineExpose, ref } from 'vue';
import { ElMessage } from 'element-plus/lib/components/index.js';
let SpuParams = ref<SpuData>({
    category3Id: "",//收集三级分类的ID
    spuName: "",//SPU的名字
    description: "",//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
});
let $emit = defineEmits(['changeShow'])
//存储已有的SPU数据
let AllTradeMark = ref<Trademark[]>([]);
//图片
let imgList = ref<SpuImg[]>([]);
//控制照片的放大显示效果(默认隐藏，点击显示)
let dialogVisible = ref<boolean>(false);
let dialogImageUrl = ref<string>('');
//销售属性
let saleAttr = ref<SaleAttr[]>([]);
let allSaleAttr = ref<HasSaleAttr[]>();
//收集将来还未选择的销售属性
let saleAttrIdAndValueName = ref<string>('');
const cancel = () => {
    $emit('changeShow', {flag:0,params:'update'})
}
//作为子组件的方法被父组件index.vue调用
const initgetSpu = async (spu: SpuData) => {
    //存储对象
    SpuParams.value = spu;
    // console.log(spu);  
    //获取全部品牌数据
    let result: AllTradeMark = await reqAllTradeMark();
    //获取某品牌的全部图片
    let result1: SpuHasImg = await reqSpuImageList((spu.id as number));
    //获取SPU销售属性的数据
    let result2: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number));
    //获取全部SPU销售属性
    let result3: HasSaleAttrResponseData = await reqAllSaleAttr();
    //存储全部品牌数据
    AllTradeMark.value = result.data;
    imgList.value = result1.data.map(item => {
        return {
            name: item.imgName,
            url: item.imgUrl,
        }
    })
    saleAttr.value = result2.data;
    allSaleAttr.value = result3.data;
}
//点击照片墙触发的方法
const handlePictureCardPreview = (file: any) => {
    dialogImageUrl.value = file.url;
    dialogVisible.value = true;
}
//点击照片删除按键触发
const handleRemove = () => { }
//照片上传成功之前约束文件大小与类型
const handlerUpload = (file: any) => {
    console.log(file);

    if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
        if (file.size / 1024 / 1024 < 3) {
            return true;
        } else {
            ElMessage({
                type: 'error',
                message: '图片大小需要小于3M'
            })
            return false;
        }
    } else {
        ElMessage({
            type: 'error',
            message: '图片仅支持上传png|jpg|gif'
        })
        return false;
    }

}
//计算属性
let unSelectSaleAttr = computed(() => {
    let unSelectArr = allSaleAttr.value?.filter(item => {
        //把每一个售卖属性的saleAttr交给every判断
        //当返回false时过滤(因为已经存在)
        return saleAttr.value.every(item1 => {
            //如果属性中存在已有的售卖属性，返回false
            //如果不存在返回true
            return item.name != item1.saleAttrName;
        });
    })
    //最后得到过滤好的不存在的attr属性
    return unSelectArr;
})
const addSaleAttr = () => {
    // baseSaleAttrId: number | string
    //   saleAttrName: string
    //   spuSaleAttrValueList: SpuSaleAttrValueList
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':');
    //准备新的销售对象，将来带给服务器
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    saleAttr.value.push(newSaleAttr);
}
//属性值按钮切换
const toEdit = (row: SaleAttr) => {
    row.flag = true;
    row.saleAttrValue = '';
}
const toLook = (row: SaleAttr) => {
    const { baseSaleAttrId, saleAttrValue } = row;
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: (saleAttrValue as string)
    }
    //不可为空·
    if ((saleAttrValue as string).trim() == '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空'
        })
        return;
    }
    //不可为重复
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue;
    })
    if (repeat) {
        ElMessage({
            type: 'error',
            message: '属性值不可重复'
        })
        return;
    }
    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue);
    //切换为查看模式
    row.flag = false;
}
const save = async () => {
    //照片墙的数据
    SpuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,
            imgUrl: (item.response && item.response.data) || item.url
        }
    })
    //整理销售属性数据
    SpuParams.value.spuSaleAttrList = saleAttr.value;
    let result = await reqAddOrUpdateSpu(SpuParams.value);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: SpuParams.value.id ? '更新成功' : '添加成功'
        })
        //切换场景
        $emit('changeShow', {flag:0,params:SpuParams.value.id?'update':'add'});
    } else {
        ElMessage({
            type: 'error',
            message: '更新失败'
        })
    }
}
//SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
    //清空数据
    Object.assign(SpuParams.value, {
        category3Id: "",//收集三级分类的ID
        spuName: "",//SPU的名字
        description: "",//SPU的描述
        tmId: '',//品牌的ID
        spuImageList: [],
        spuSaleAttrList: [],
    })
    //清空照片墙数据
    imgList.value = [];
    //清空销售属性
    saleAttr.value = [];
    //清除选项
    saleAttrIdAndValueName.value='';
    //存储三级分类id
    SpuParams.value.category3Id = c3Id;
    //所有品牌数据
    let result: AllTradeMark = await reqAllTradeMark();
    //所有属性数据
    let result3: HasSaleAttrResponseData = await reqAllSaleAttr();
    //存储数据
    AllTradeMark.value = result.data;
    allSaleAttr.value = result3.data;

}
defineExpose({ initgetSpu, initAddSpu });
</script>
<script lang="ts">
export default {
    name: 'spuForm'
}
</script>
<style scoped lang="scss"></style>