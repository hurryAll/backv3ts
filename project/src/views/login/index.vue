<template>
    <div class="login_container">
        <!-- element-plue -->
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <!-- ref获取el-form组件实例 -->
                <el-form class="login_form" :model="formData" :rules="rules" ref="loginForms">
                    <h1>你好</h1>
                    <h2>欢迎使用</h2>
                    <!-- prop加上要被校验的表单数据的名字 -->
                    <el-form-item label="" prop="username">
                        <el-input placeholder="账号" :prefix-icon="User" v-model="formData.username"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="password">
                        <el-input placeholder="密码" type="password" :prefix-icon="Lock" v-model="formData.password"
                            show-password></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button :loading="loading" type="primary" class="login_btn" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import { User, Lock } from "@element-plus/icons-vue"
import { reactive, ref } from 'vue'
// import { loginForm } from "@/api/user/type";
import userStore from '@/store/modules/user';
import { useRouter, useRoute } from "vue-router";
import { ElNotification } from "element-plus/lib/components/index.js";
import { getTime } from '@/utils/time'
let $router = useRouter();
let useStore = userStore();
let loginForms = ref();
//reactive代理对象,收集用户密码数据
let formData = reactive({ username: 'admin', password: 'atguigu123' })
//rule:即为校验规则对象
//value:即为表单元素文本内容
//函数:如果符合条件callBack放行通过即为
//如果不符合条件calBack方法,注入错误提示信息
const validatorUserName = (rule: any, value: any, callback: any) => {
    if (value.length >= 5) {
        callback();
    } else {
        callback(new Error('用户名长度至少为5'))
    }
}

const validatorPassword = (rule, value: any, callback: any) => {
    if (value.length >= 6) {
        callback();
    } else {
        callback(new Error('密码长度至少为6'))
    }
}

//表单校验需要的配置对象
const rules = {
    username: [
        //规则对象属性:
        //required,代表这个字段务必要校验的
        //min:文本长度至少多少位
        //max:文本长度最多多少位
        //message:错误的提示信息
        //trigger:触发校验表单的时机 change->文本发生变化触发校验,blur:失去焦点的时候触发校验规则
        // { required: true, message: '用户名不可为空', trigger: 'change' },
        // { required: true, min: 6, max: 10, message: '用户名长度至少为6,最多10位', trigger: 'change' }
        { trigger: 'change', validator: validatorUserName }
    ],
    password: [
        { trigger: 'change', validator: validatorPassword }
        // {required:true,min:6,max:15,message:'密码最少6位,最多15位',trigger:'change'}
    ]
}

let $route = useRoute();
let loading = ref(false)
let login = async () => {
    //在登录之前判定，如果不符合账号密码规范则不可正常调用login
    //格式均正确则可返回一个true,代码继续进行,否则false代码停止
    // let redirect:any=$route.query.redirect;
    // console.log(redirect);
    await loginForms.value.validate();
    loading.value = true;
    try {
        await useStore.userLogin(formData);
        // let redirect:any=$route.query.redirect;
        //登录成功跳转到首页
        let redirect:any = $route.query.redirect;
        $router.push({ path: redirect || '/' })
        //成功登录提示信息
        ElNotification({
            type: 'success',
            message: '登录成功',
            title: `Hi,${getTime()}~`
        })
    } catch (error) {
        loading.value = false
        ElNotification({
            type: 'error',
            //catch的参数必须是any类型   所以在下边定义Error类型
            message: (error as Error).message,
        })
    }
}
</script>
<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background-color: antiquewhite;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;
}

.login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
        color: white;
        font-size: 40px;
    }

    h2 {
        color: white;
        font-size: 20px;
        margin-top: 20px;
        margin-bottom: 10px;
    }
}

.login_btn {
    width: 100%;
}
</style>