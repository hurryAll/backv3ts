import request from "@/utils/request";
import type { UserResponseData,User,AllRoleResponseData,SetRoleData } from "./type";
enum API{
    //获取用户信息
    ALLUSER_URL='/admin/acl/user/',
    //添加一个新用户
    ADDUSER_URL='/admin/acl/user/save',
    //更新账号
    UPDATEUSER_URL='/admin/acl/user/update',
    //获取全部职位以及当前用户职位
    ALLROLEURL='/admin/acl/user/toAssign/',
    //给用户分配职务
    SETROLE_URL='/admin/acl/user/doAssignRole',
    //删除某一个账号
    DELETEUSER_URL='/admin/acl/user/remove/',
    //批量删除
    DELETEMOREUSER_URL='/admin/acl/user/batchRemove'
}
//获取用户信息
export const reqUserInfo=(page:number,limit:numbe,username:string)=>request.get<any,UserResponseData>(API.ALLUSER_URL+page+'/'+limit+'?username='+username);
export const reqAddOrUpdateUser=(data:User)=>{
    //如果携带id
    if(data.id){
        return request.put<any,any>(API.UPDATEUSER_URL,data);
    }else{
        return request.post<any,any>(API.ADDUSER_URL,data);
    }
}
export const reqAllRole=(skuId:number)=>request.get<any,AllRoleResponseData>(API.ALLROLEURL+skuId);
//分配职务
export const reqSetUserRole=(data:SetRoleData)=>request.post<any,any>(API.SETROLE_URL,data);
//删除一个账号
export const reqRemoveUser=(userId:number)=>request.delete(API.DELETEUSER_URL+userId);
//批量删除
export const reqSelectUser=(idList:number[])=>request.delete(API.DELETEMOREUSER_URL,{data:idList});