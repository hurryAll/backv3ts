<template>
    <el-card>
        <el-form :inline="true" class="form">
            <el-form-item label="职务搜索">
                <el-input placeholder="请输入职务关键字" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width: 60px;" :disabled="!keyword" @click="search">搜索</el-button>
                <el-button type="primary" style="width: 60px;" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin:10px 0">
        <el-button type="primary" icon="Plus" style="width: 95px;" @click="addRole">添加职务</el-button>
        <el-table border style="margin: 20px 0;" :data="allRole">
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="职务名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="center" width="350px">
                <template #="{ row, $index }">
                    <el-button type="primary" icon="User" style="width: 100px;"
                        @click="setPermisstion(row)">分配权限</el-button>
                    <el-button type="primary" icon="Edit" style="width: 80px;" @click="updateRole(row)">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.roleName}吗？`" width="260px" @confirm="removeRole(row.id)">
                        <template #reference>
                            <el-button type="danger" icon="Delete" style="width: 80px;">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasRole"
            @size-change="sizeChange" />
    </el-card>
    <el-dialog :title="RoleParams.id ? '更新职务' : '添加职务'" v-model="dialogShow">
        <el-form :model="RoleParams" :rules="rules" ref="formRef">
            <el-form-item label="职务名称:" prop="roleName">
                <el-input placeholder="请输入职务名称" v-model="RoleParams.roleName"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" style="width: 80px;" @click="dialogShow = false">取消</el-button>
            <el-button type="primary" style="width: 80px;" @click="save">确定</el-button>
        </template>
    </el-dialog>
    <!-- 抽屉 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>分配权限</h4>
        </template>
        <template #default>
            <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="selectArr" :props="defaultProps" />
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button type="primary" @click="drawer = false" style="width: 60px;margin-right: 10px;">取消</el-button>
                <el-button type="primary" @click="confirmClick" style="width: 60px;">确认</el-button>
            </div>
        </template>
    </el-drawer>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqRemoveRole,reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermisstion } from '@/api/acl/role'
import type { RoleResponseData, Records, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type';
import useLayOutSettingStore from '@/store/modules/setting';
import { ElMessage } from 'element-plus/lib/components/index.js';
let pageNo = ref<number>(1);
let pageSize = ref<number>(10)
let keyword = ref<string>('');
//存储职位
let allRole = ref<Records>([]);
//职位总数
let total = ref<number>(0);
//定义仓库
let settingStore = useLayOutSettingStore();
//对话框显示与隐藏
let dialogShow = ref<boolean>(false);
//表单实例
let formRef = ref<any>();
//控制抽屉显示隐藏
let drawer = ref<boolean>(false);
//树形框架数据
const defaultProps = {
    children: 'children',
    label: 'name',
}
let tree = ref<any>();
//收集新增岗位数据
let RoleParams = reactive<RoleData>({
    roleName: ''
})
//定义数组存储用户权限的数据
let menuArr = ref<MenuList>([]);
//存储勾选的节点ID(四级)
let selectArr = ref<number[]>([]);
//---------------------------------------------
onMounted(() => {
    getHasRole();
})
const getHasRole = async (pager = 1) => {
    pageNo.value = pager;
    let result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value);
    if (result.code == 200) {
        total.value = result.data.total;
        allRole.value = result.data.records;
    }
}

const validatorRoleName = (rule: any, value: any, callback: any) => {
    if (value.trim().length >= 2) {
        callback();
    } else {
        callback(new Error('职务名称至少为2位'))
    }
}

const rules = {
    roleName: [
        { required: true, tirgger: 'blur', validator: validatorRoleName }
    ]
}
const sizeChange = () => {
    getHasRole();
}
//搜索按钮
const search = () => {
    getHasRole();
    keyword.value = '';
}
const reset = () => {
    settingStore.refresh = !settingStore.refresh;
}
const save = async () => {
    //保存前检查校验,ref获取表单实例
    await formRef.value.validate();
    let result: any = await reqAddOrUpdateRole(RoleParams);
    console.log(result);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: RoleParams.id ? '更新成功' : '添加成功'
        })
        dialogShow.value = false;
        getHasRole(RoleParams.id ? pageNo.value : 1);
    }
}

//添加职位按钮回调
const addRole = () => {
    //对话框显示
    dialogShow.value = true;
    //清空数据
    Object.assign(RoleParams, {
        roleName: '',
        id: 0
    })
    //清除上一次的校验
    nextTick(() => {
        formRef.value.clearValidate('roleName');
    })
}
const updateRole = (row: RoleData) => {
    dialogShow.value = true;
    //展示该栏的已有数据(带ID)
    Object.assign(RoleParams, row);
    nextTick(() => {
        formRef.value.clearValidate('roleName');
    })
}
//分配权限按钮  已有的职务数据
const setPermisstion = async (row: RoleData) => {
    drawer.value = true;
    //收集当前要分类权限的职务数据
    Object.assign(RoleParams, row);
    //根据职位获取权限的数据
    let result: MenuResponseData = await reqAllMenuList((RoleParams.id as number));
    if (result.code == 200) {
        menuArr.value = result.data;
        selectArr.value = filterSelectArr(menuArr.value, []);
    }
}
//运用递归!!!!!!
const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item: any) => {
        //因为给的数据从第四个节点开始可以勾选
        if (item.select && item.level == 4) {
            initArr.push(item.id);
        }
        //如果四级以及往后有子节点，则调用自身方法递归，将往后选择的勾选
        if (item.children && item.children.length > 1) {
            filterSelectArr(item.children, initArr);
        }
    })
    return initArr;
}
//抽屉确认按钮
const confirmClick = async () => {
    //获取点击的职务ID
    const roleId = RoleParams.id;
    //获取选中的选项ID
    let arr = tree.value.getCheckedKeys();
    //获取半选的ID
    let arr1 = tree.value.getHalfCheckedKeys();
    //arr与arr1结合
    let permissionId = arr.concat(arr1);
    let result: any = await reqSetPermisstion((roleId as number), permissionId);
    if (result.code == 200) {
        drawer.value = false;
        ElMessage({
            type: 'success',
            message: '分配成功'
        })
        // 页面刷新
        window.location.reload();
    }

}
//删除角色
const removeRole=async (id:number)=>{
    let result:any=await reqRemoveRole(id);
    if(result.code==200){
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        getHasRole(allRole.value.length>1?pageNo.value:pageNo.value-1);
    }
}
//------------------------------------------------------
</script>
<script lang="ts">
export default {
    name: 'Role'
}
</script>
<style scoped lang="scss">
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
}
</style>