<template>
    <div>
        <el-card class="box-card">
            <el-button type="primary" size="defalut" class="add" icon="Plus" @click="addTrademark" v-has="`btn.Trademark.add`">添加品牌</el-button>
            <el-table style="margin: 10px 0;" :data="trademarkArr">
                <el-table-column label="序号" width="100px" align="center" type="index"></el-table-column>
                <el-table-column label="品牌名称" align="center" prop="tmName"></el-table-column>
                <el-table-column label="品牌LOGO">
                    <!-- 作用域插槽 element的,规定写法 -->
                    <template #="{ row }">
                        <img :src="row.logoUrl" alt="图片丢失了" style="width: 100px;height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #="{ row }">
                        <el-button type="" icon="Edit" style="margin-right: 10px;"
                            @click="changeTrademark(row)">
                        </el-button>
                        <el-popconfirm :title="`你确定要删除${row.tmName}吗?`" width="200px" icon="Delete" @confirm="removeTrademark(row.id)">
                            <template #reference>
                                <el-button type="" icon="Delete"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器组件 -->
            <!-- current-page 绑定当前页面 -->
            <el-pagination :pager-count="6" @current-change="getHasTrademark" @size-change="sizeChange"
                v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :disabled="false"
                :background="true" layout="total, sizes, prev, pager, next, jumper" :total=total />
        </el-card>
        <el-dialog :title="trademarkParams.id ? '修改品牌' : '添加品牌'" v-model="dialogFormVisible">
            <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <!-- 上传文件的服务器action -->
                    <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button type="primary" size="default" @click="cancel"
                    style="width: 80px;margin-right: 10px;">取消</el-button>
                <el-button type="primary" size="default" @click="confirm" style="width: 80px;">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { reqHasTrademark, reqAddOrUpdateTrademark,reqDeleteTrademark } from '@/api/product/trademark/index';
import { ref, onMounted, reactive, nextTick } from 'vue'
import { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus/lib/components/index.js';

//当前页码
let pageNo = ref<number>(1);
//每一页展示多少条数据
let limit = ref<number>(3);
//设置每页可展示多少条  :page-sizes
// 可以设置分页器的布局 layout
//是否禁用分页 disabled
let dialogFormVisible = ref<boolean>(false);
let total = ref<number>(0);
let trademarkArr = ref<Records>([]);
//收集新增的品牌数据
let trademarkParams = reactive<TradeMark>({
    tmName: '',
    logoUrl: ''
})
//当无参数传递时，自动设置当前页面在第一页，当点击切换页面时,会传递当前页
let getHasTrademark = async (p = 1) => {
    pageNo.value = p;
    let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
    total.value = result.data.total;
    trademarkArr.value = result.data.records;
}
onMounted(() => {
    getHasTrademark();
})
const sizeChange = () => {
    getHasTrademark();
}
const addTrademark = () => {
    trademarkParams.tmName = '';
    trademarkParams.logoUrl = '';
    trademarkParams.id = undefined;
    dialogFormVisible.value = true;

    //可以用nextTick调用
    //es6的选择方法,当页面渲染出了后,有了formRef组件，再调用方法
    formRef?.value.clearValidate('tmName');
    formRef?.value.clearValidate('logoUrl');
}
//修改
const changeTrademark = (row: TradeMark) => {
    //点击修改清除提示    
    nextTick(() => {
        //也可以
        formRef.value.resetFields();
        // formRef.value.clearValidate('tmName');
        // formRef.value.clearValidate('logoUrl');
    })
    //ES6的合并语法
    Object.assign(trademarkParams, row);
    // trademarkParams.tmName=row.tmName;
    // trademarkParams.logoUrl=row.logoUrl;
    // trademarkParams.id=row.id;
    dialogFormVisible.value = true;
}
const cancel = () => {
    dialogFormVisible.value = false;
}
const confirm = async () => {
    //会触发所有检验
    let checkAll = await formRef.value.validate();//返回一个promise对象,符合校验条件则向下运行
    let result = await reqAddOrUpdateTrademark(trademarkParams);
    // 新增或更新成功
    if (result.code == 200) {
        dialogFormVisible.value = false;
        ElMessage({
            type: 'success',
            message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
        })
        //再次发起请求获取数据
        //传参，当时修改数据，留在当前页；增加数据回到第一页
        getHasTrademark(trademarkParams.id ? pageNo.value : 1);
    } else {
        ElMessage({
            type: 'error',
            message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
        })
    }

}
//在上传文件前触发,限制上传文件的大小和类型
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
        if (rawFile.size / 1024 / 1024 < 4) {
            // beta->kb->M  文件小于4M
            return true;
        } else {
            ElMessage({
                type: 'error',
                message: '大小不可高于4M'
            })
            return false;
        }
    } else {
        ElMessage({
            type: 'error',
            message: '务必上传jpg/png/gif类型'
        })
        return false;
    }
}
//上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    trademarkParams.logoUrl = response.data;
    //图片上传成功,清除对应图片校验结果
    formRef.value.clearValidate('logoUrl');
}
//获取组件实例
let formRef = ref();

// 自定义校验
const validatorTmName = (rule: any, value: any, callBack: any) => {
    if (value.trim().length >= 2) {
        callBack();
    } else {
        callBack(new Error('品牌名称需至少2位'))
    }
}
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
    //图片的自定义校验用trigger不能触发,需要获取el-form组件实例,之后在确定方法config里触发
    if (value) {
        callBack();
    } else {
        callBack(new Error('务必上传logo图片'))
    }

}

//表单校验规则对象
const rules = {
    tmName: [
        { required: true, trigger: 'blur', validator: validatorTmName }
    ],
    logoUrl: [
        { required: true, validator: validatorLogoUrl }
    ]
}
const removeTrademark=async (id:number)=>{
    let result=await reqDeleteTrademark();
    if(result.code==200){
        ElMessage({
            type:'success',
            message:"删除商品成功"
        })
        //trademarkArr代表某一页的所有数据,当至少2条,删除一条还有一条留在本页,当只有1条，删完后返回上一条
        getHasTrademark(trademarkArr.value.length>1?pageNo.value:pageNo.value-1);
    }else{
        ElMessage({
            type:'error',
            message:'删除失败'
        })
    }
    
}
</script>
<style scoped lang="scss">
.box-card {
    .add {
        width: 100px;
    }
}
</style>
<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>