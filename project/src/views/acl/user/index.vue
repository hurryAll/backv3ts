<template>
    <el-card>
        <el-form :inline="true" class="form">
            <el-form-item label="用户名">
                <el-input placeholder="你输入搜索用户名" v-model=keyword></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width: 80px;" :disabled="!keyword" @click="search">搜索</el-button>
                <el-button type="primary" style="width: 80px;" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0;">
        <el-button type="primary" style="width: 80px;" @click="addUser">添加用户</el-button>
        <el-button type="danger" style="width: 80px;" :disabled="selectIdArr.length?false:true" @click="deleteSelectUser">批量删除</el-button>
        <el-table border style="margin: 15px 0;" :data="userArr" @selection-change="selectChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="序号" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="center" width="300px">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" style="width: 80px;" icon="User"
                        @click="setRole(row)">分配角色</el-button>
                    <el-button type="primary" size="small" style="width: 80px;" icon="Edit"
                        @click="updateUser(row)">编辑</el-button>
                    <el-popconfirm :title="`你确请要删除${row.username}吗`" width="260px" @confirm="deleteUser(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" style="width: 80px;" icon="Delete">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9]" :background="true"
            layout="prev, pager, next, jumper,->,total, sizes" :total="total" @current-change="getHasUser"
            @size-change="handler" />
    </el-card>
    <!-- 抽屉 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>{{ userParams.id ? '更新用户' : '新增用户' }}</h4>
        </template>
        <template #default>
            <el-form :model="userParams" :rules="rules" ref="formRef">
                <el-form-item label="用户姓名" prop="username"><el-input placeholder="请输入用户姓名"
                        v-model="userParams.username"></el-input></el-form-item>
                <el-form-item label="用户昵称" prop="name"><el-input placeholder="请输入用户昵称"
                        v-model="userParams.name"></el-input></el-form-item>
                <el-form-item label="用户密码" prop="password" v-if="!userParams.id"><el-input placeholder="请输入用户密码"
                        v-model="userParams.password"></el-input></el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex:auto">
                <el-button style="width: 60px;" @click="cancel">取消</el-button>
                <el-button type="primary" style="width: 60px;" @click="save">确定</el-button>
            </div>
        </template>
    </el-drawer>
    <!-- 对职务分配的抽屉 -->
    <el-drawer v-model="drawer1">
        <template #header>
            <h4>分配角色(职位)</h4>
        </template>
        <template #default>
            <el-form>
                <el-form-item label="用户姓名">
                    <el-input v-model="userParams.username" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="角色列表">
                    <el-checkbox v-model="checkAll" @change="handleCheckAllChange"
                        :indeterminate="isIndeterminate">全选</el-checkbox>
                    <el-checkbox-group v-model="userRole" @change="handleCheckedFormChange">
                        <!-- 这里lable的role是要收集的值 提交给userRole  注：数据需要是ref的响应式数据-->
                        <el-checkbox v-for="(role, index) in allRole" :key="index"
                            :label="role">{{ role.roleName }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button style="width: 50px;" @click="drawer1 = false">取消</el-button>
                <el-button type="primary" @click="confirmClick" style="width: 50px;">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole,reqRemoveUser,reqSelectUser } from '@/api/acl/user/index';
import type { UserResponseData, Records, User, AllRoleResponseData, AllRole, SetRoleData } from '@/api/acl/user/type';
import { ElMessage } from 'element-plus/lib/components/index.js';
import useLayOutSettingStore from '@/store/modules/setting';
//当前页
let pageNo = ref<number>(1);
let pageSize = ref<number>(5);
//用户总个数
let total = ref<number>(0);
//存储全部用户的数组
let userArr = ref<Records[]>([]);
//定义响应式抽屉
let drawer = ref<boolean>(false);
//控制分配角色的抽屉显示
let drawer1 = ref<boolean>(false);
//使用ref变成响应式数据
//角色
const allRole = ref<AllRole>([]);
//当前用户已有角色
let userRole = ref<AllRole>([]);
//等待批量删除的用户ID
let selectIdArr=ref<User[]>([]);
//响应式数据收集用户搜索字段
let keyword=ref<string>('');
//获取仓库
let settingStore=useLayOutSettingStore();
//收集用户信息的响应式数据
let userParams = reactive<User>({
    username: '',
    name: '',
    password: ''
})
//搜索按钮
const search=()=>{
    getHasUser();
    keyword.value='';
}
//重置
const reset=()=>{
    settingStore.refresh=!settingStore.refresh;
}
//删除某个用户
const deleteUser=async (id:number)=>{
    let result=await reqRemoveUser(id);
    if(result.code==200){
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        getHasUser(userArr.value.length>1?pageNo.value:pageNo.value-1);
    }
}
//批量删除
const deleteSelectUser=async ()=>{
//整理批量删除的参数
let idsList:any=selectIdArr.value.map(item=>{
    return item.id;
})
    let result:any=await reqSelectUser(idsList);
    if(result.code==200){
        ElMessage({
            type:'success',
            message:'批量删除成功'
        })
        getHasUser(userArr.value.length>1?pageNo.value:pageNo.value-1);
    }

}
//批量删除的勾选复选框勾选触发
//自动注入选中的数据信息
const selectChange=(value:any)=>{
    selectIdArr.value=value;
}
//复选框全选
let checkAll = ref<boolean>(false);
//是否全选判断
const isIndeterminate = ref<boolean>(true);
//全选复选框的change事件
const handleCheckAllChange = (val: boolean) => {
    // 点击全选按钮会自动注入ture或false
    userRole.value = val ? allRole.value : [];
    isIndeterminate.value = false;
}
//点击确认
const confirmClick =async () => {
    //收集参数
    let data:SetRoleData={
        userId:(userParams.id as number),
        roleIdList:userRole.value.map(item=>{return (item.id as number)})
    }
    let result:any=await reqSetUserRole(data);
    if(result.code==200){
        ElMessage({
            type:'success',
            message:'分配成功'
        })
        drawer1.value=false;
        //获取更新完毕用户的信息并停留在当前页
        getHasUser(pageNo.value);
    }
}
//分配角色
const setRole = async (row: User) => {
    Object.assign(userParams, row);
    let result: AllRoleResponseData = await reqAllRole((userParams.id as number));
    if (result.code == 200) {
        //存储全部职位
        allRole.value = result.data.allRolesList;
        //存储当前用户已有的职位
        userRole.value = result.data.assignRoles;
        drawer1.value = true;
    }
}
//底部复选框，当发生选项改变触发
const handleCheckedFormChange = (value: string[]) => {
    // isIndeterminate.value=!(allRole.value.length===userRole.value.length);
    const checkedCount = value.length;
    checkAll.value = checkedCount === allRole.value.length;
    isIndeterminate.value = !(checkedCount === allRole.value.length);
}

//获取form实例
const formRef = ref<any>();
onMounted(() => {
    getHasUser();
})
//获取全部的用户信息
const getHasUser = async (pager = 1) => {
    pageNo.value = pager;
    let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value,keyword.value);
    if (result.code == 200) {
        total.value = result.data.total;
        userArr.value = result.data.records;
    }
}
//页面大小改变，注入参数
const handler = () => {
    //注入参数改变页大小，同时默认传第一页
    getHasUser();
}
const addUser = () => {
    drawer.value = true;
    //清空数据
    Object.assign(userParams, {
        id: 0,
        username: '',
        name: '',
        password: ''
    })
    //清除校验结果
    nextTick(() => {
        // formRef.value.resetFields();
        formRef.value.clearValidate('username');
        formRef.value.clearValidate('name');
        formRef.value.clearValidate('password');
    })
}
const updateUser = (row: User) => {
    drawer.value = true;
    //存储收集的信息
    Object.assign(userParams, row);
    nextTick(() => {
        //这里不能用resetFields，它会清除表单数据
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
    })
}
const save = async () => {
    //在保存之前，要校验是否符合要求  返回true或false
    await formRef.value.validate();
    let result: any = await reqAddOrUpdateUser(userParams);
    //添加或更新成功
    if (result.code == 200) {
        //关闭抽屉
        drawer.value = false;
        ElMessage({ type: 'success', message: userParams.id ? '更新成功' : '添加成功' })
        // getHasUser(userParams.id?pageNo.value:1);
        //浏览器刷新(每次修改用户，翻译修改了自己，则刷新退出,不然token失效获取不到数据)
        window.location.reload();
    } else {
        drawer.value = false;
        ElMessage({ type: 'error', message: userParams.id ? '更新失败' : '添加失败' })
    }
}
const cancel = () => {
    drawer.value = false;
}
//自定义username校验
const validatorUsername = (rule: any, value: any, callBack: any) => {
    if (value.length >= 5) {
        callBack();
    } else {
        callBack(new Error('用户名至少五位'))
    }
}
//自定义校验name
const validatorName = (rule: any, value: any, callBack: any) => {
    if (value.length >= 5) {
        callBack();
    } else {
        callBack(new Error('用户昵称至少五位'))
    }
}
//自定义校验密码
const validatorPassword = (rule: any, value: any, callBack: any) => {
    if (value.length >= 6) {
        callBack();
    } else {
        callBack(new Error('用户昵称至少六位'))
    }
}
//表单校验的规则对象
const rules = {
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    name: [{ required: true, trigger: 'blur', validator: validatorName }],
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

</script>
<script lang="ts">
export default {
    name: 'user'
}
</script>
<style scoped lang="scss">
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>