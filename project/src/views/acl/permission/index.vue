<template>
    <el-table :data="PermisstionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border default-expand-all>
        <el-table-column prop="name" label="名称" sortable />
        <el-table-column prop="code" label="权限值" sortable />
        <el-table-column prop="updateTime" label="修改时间" sortable />
        <el-table-column label="操作" width="260px">
            <template #="{row}">
                <el-button type="primary" @click="addPermisstion(row)" style="width: 65px;" :disabled="row.level == 4">{{
                    row.level == 3 ? '添加功能' : '添加菜单' }}</el-button>
                <el-button type="success" @click="updatePermisstion(row)" style="width: 65px;"
                    :disabled="row.level == 1">编辑</el-button>
                    
                <el-popconfirm :title="`你确定要删除${row.name}吗?`" width="260px" @confirm="removeMenu(row.id)">
                    <template #reference>
                        <el-button type="danger" style="width: 65px;" :disabled="row.level == 1">删除</el-button>
                    </template>
                </el-popconfirm>

            </template>
        </el-table-column>
    </el-table>
    <!-- 对话框组件 -->
    <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'" width="40%" :before-close="handleClose">
        <el-form>
            <el-form-item label="名称:">
                <el-input placeholder="请输入菜单名称" v-model="menuData.name"></el-input>
            </el-form-item>
            <el-form-item label="权限:">
                <el-input placeholder="请输入权限值" v-model="menuData.code"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false" style="width: 50px;">取消</el-button>
                <el-button @click="save" type="primary" style="width: 50px;">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { reqAllPermisstion, reqAddOrUpdateMenu,reqRemoveMenu } from '@/api/acl/menu';
import type { MenuParams, PermisstionResponseData, PermisstionList, Permisstion } from '@/api/acl/menu/type';
import { ElMessage } from 'element-plus/lib/components/index.js';
//存储菜单的数据
let PermisstionArr = ref<PermisstionList>([]);
//对话框的显示与隐藏
let dialogVisible = ref<boolean>(false);
//携带参数
let menuData = reactive<MenuParams>({
    "code": "",
    "level": 0,
    "name": "",
    "pid": 0
});
//-------------------------------------------------
onMounted(() => {
    getHasPermisstion()
})
const getHasPermisstion = async () => {
    let result: PermisstionResponseData = await reqAllPermisstion();
    if (result.code == 200) {
        PermisstionArr.value = result.data;
    }
}
//添加菜单回调
const addPermisstion = (row: Permisstion) => {
    Object.assign(menuData, {
        "id": 0,
        "code": "",
        "level": 0,
        "name": "",
        "pid": 0
    })
    //对话框显示
    dialogVisible.value = true;
    //收集菜单的level
    menuData.level = row.level + 1;
    //给谁新增一个子菜单
    menuData.pid = (row.id as number);
}
//更新编辑菜单回调
const updatePermisstion = (row: Permisstion) => {
    dialogVisible.value = true;
    Object.assign(menuData, row);
}
//保存
const save = async () => {
    //新增或更新菜单
    let result: any = await reqAddOrUpdateMenu(menuData);
    if (result.code == 200) {
        dialogVisible.value = false
        ElMessage({
            type: 'success',
            message: menuData.id ? '更新成功' : '添加成功'
        })
        //再次获取菜单数据
        getHasPermisstion();
    }
}
//删除
const removeMenu=async(id:number)=>{
    let result:any=await removeMenu(id);
    if(result.code==200){
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        getHasPermisstion();
    }
}
 //-------------------------------------------------
</script>
<style scoped lang="scss"></style>