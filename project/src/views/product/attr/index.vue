<template>
    <Category :flag="flag"></Category>
    <el-card style="margin: 10px 0;">
        <div v-show="flag">
            <el-button @click="addAttr" type="primary" icon="Plus" style="width: 100px;"
                :disabled="categoryStore.c3Id ? false : true">添加属性</el-button>
            <el-table border style="margin: 10px 0;" :data="attrArr">

                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="属性名称" align="center" width="120px" prop="attrName"></el-table-column>
                <el-table-column label="属性值名称" align="center">
                    <template #="{ row }">
                        <el-tag style="margin: 5px;" v-for="item in row.attrValueList" :key="item.id">{{
                            item.valueName }}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                    <!-- row：已有的某个属性对象 -->
                    <template #="{ row }">
                        <el-button type="primary" icon="Edit" style="width: 30px;" @click="updateAttr(row)"></el-button>

                        <el-popconfirm :title="`你确定要删除${row.attrName}`" @confirm="deleteAttr(row.id)">
                            <template #reference>
                                <el-button type="primary" icon="Delete" style="width: 30px;"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- ----------------------------------------------------------------------------- -->

        <div v-show="!flag">
            <el-form :inline="true">
                <el-form-item label="属性名称">
                    <el-input placeholder="输入属性名称" v-model="attrParams.attrName"></el-input>
                </el-form-item>
            </el-form>
            <el-button :disabled="!attrParams.attrName" @click="addAttrValue" type="primary" style="width: 120px;"
                size="default" icon="Plus">添加属性值</el-button>
            <el-button type="primary" style="width: 80px;" size="default">取消</el-button>
            <!-- 表单绑定了attrParams.attrValueList -->
            <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
                <el-table-column type="index" align="center" label="序号" width="130px"></el-table-column>
                <el-table-column label="属性值名称">
                    <!-- row即为当前属性值对象 -->
                    <template #="{ row, $index }">
                        <!-- el-input的ref可以得到组件el-input的实例 -->
                        <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flagEdit" v-model="row.valueName"
                            placeholder="请输入你的属性值名称" @blur="showEdit(row, $index)"></el-input>
                        <div v-else @click="showInput(row, $index)">{{ row.valueName }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="属性值操作">
                    <template #="{ $index }">
                        <el-button type="danger" icon="Delete" style="width: 50px;"
                            @click="attrParams.attrValueList.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- disabled保证在没有属性值的时候不让保存 -->
            <el-button type="primary" style="width: 80px;" size="default" @click="save"
                :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
            <el-button type="primary" style="width: 80px;" size="default" @click="cancel">取消</el-button>
        </div>
    </el-card>
</template>
<script setup lang="ts">
import useCategoryStore from '@/store/modules/category.ts'
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue';
import { reqAttr, reqAddorUpdateAttr, reqRemoveAttr } from '@/api/product/attr/index';
import { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
import { ElMessage } from 'element-plus/lib/components/index.js';
let categoryStore = useCategoryStore();
let attrArr = ref<Attr[]>([]);
let flag = ref<boolean>(true);
let inputArr = ref<any>([]);
//路由组件销毁的时候
onBeforeUnmount(() => {
    //清空仓库的数据
    categoryStore.$reset();
})
let showEdit = (row: AttrValue, $index: number) => {
    //错误1检查:空值
    if (row.valueName.trim() == '') {
        //删除属性值为空的元素
        //splice第一个参数，从哪个索引开始，第二个参数，删除几个
        attrParams.attrValueList.splice($index, 1);
        ElMessage({
            type: 'error',
            message: '属性不能为空'
        })
        return;
    }
    //错误2检查:重复值
    let repeat = attrParams.attrValueList.find((item) => {
        if (item != row) {
            //返回重复值判断，如果不重复返回undefined，重复则返回proxy对象
            return item.valueName === row.valueName;
        }
    });
    if (repeat) {
        attrParams.attrValueList.splice($index, 1);
        ElMessage({
            type: 'error',
            message: '属性值不可重复'
        })
        return;
    }
    row.flagEdit = false;
}
let showInput = (row: AttrValue, $index: number) => {
    row.flagEdit = true;
    //当改变显示时,不可能立即拿到数据，因此需要渲染结束后才行
    //点击属性值自动聚焦
    nextTick(() => {
        inputArr.value[$index].focus();
    })

}
//监听仓库的三级id
watch(() => categoryStore.c3Id, () => {
    getAttr();
})
let getAttr = async () => {
    //清空（避免获取数据之后修改id）当切换了一二级目录时所有的信息清空
    attrArr.value = [];
    if (!categoryStore.c3Id) return;
    const { c1Id, c2Id, c3Id } = categoryStore;
    let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
    if (result.code == 200) {
        //获取表单属性与属性值数据
        attrArr.value = result.data;
    }
}
let attrParams = reactive<Attr>({
    attrName: "",//新增的属性的名字
    attrValueList: [//新增的属性值数组
    ],
    categoryId: '',//三级分类的ID
    categoryLevel: 3,//代表的是三级分类
})
let addAttr = () => {
    //添加数据之前先把之前内容框的数据清空再操作
    //object.assign可以合并对象
    Object.assign(attrParams, {
        attrName: "",
        attrValueList: [
        ],
        categoryId: '',
        categoryLevel: 3,
    })
    flag.value = false;
    attrParams.categoryId = categoryStore.c3Id;
}
let updateAttr = (row: Attr) => {
    flag.value = false;
    //后面的值覆盖前面的
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
}
let cancel = () => [
    flag.value = true
]
let addAttrValue = () => {
    attrParams.attrValueList.push({
        valueName: '',
        flagEdit: true,
    })
    //按了添加属性后会增加一行，以下内容让输入框自动聚焦
    nextTick(() => {
        inputArr.value[attrParams.attrValueList.length - 1].focus();
    })
}
let save = async () => {
    let result: any = await reqAddorUpdateAttr(attrParams);
    if (result.code == 200) {
        flag.value = true;
        ElMessage({
            type: 'success',
            message: attrParams.id ? '修改成功' : '添加成功'
        })
        // 再次获取属性与属性值信息
        getAttr();
    } else {
        ElMessage({
            type: 'error',
            message: attrParams.id ? '修改失败' : '添加失败'
        })
    }
}
let deleteAttr = async (attrId: number) => {
    let result: any = await reqRemoveAttr(attrId);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getAttr();
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }

}
</script>
<style scoped lang="scss"></style>