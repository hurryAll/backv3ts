import request from "@/utils/request";
import type { RoleResponseData } from "./type";
import { RoleData,MenuResponseData } from "./type";
enum API{
    //获取全部的职位
    ALLROLE_URL='/admin/acl/role/',
    //新增岗位接口
    ADDROLE_URL='/admin/acl/role/save',
    //更新职务
    UPDATEROLE_URL='/admin/acl/role/update',
    //获取全部的菜单按钮数据
    ALLPERMISSTION="/admin/acl/permission/toAssign/",
    //给相应职务分配权限
    SETPERMISTION_URL='/admin/acl/permission/doAssign',
    //删除已有职位
    REMOVEROLE_URL='/admin/acl/role/remove/'
}
//获取全部职位
export const reqAllRoleList=(page:number,limit:number,roleName:string)=>request.get<any,RoleResponseData>(API.ALLROLE_URL+`${page}/${limit}?roleName=${roleName}`)
//添加与更新职务
export const reqAddOrUpdateRole=(data:RoleData)=>{
    if(data.id){
        return request.put(API.UPDATEROLE_URL,data)
    }else{
        return request.post(API.ADDROLE_URL,data);
    }
}
//获取全部菜单与按钮权限数据
export const reqAllMenuList=(roleId:number)=>request.get<any,MenuResponseData>(API.ALLPERMISSTION+roleId)
//给相应职位下发权限
export const reqSetPermisstion=(roleId:number,permissionId:number[])=>request.post(API.SETPERMISTION_URL+`?roleId=${roleId}&&permissionId=${permissionId}`);
//删除职位
export const reqRemoveRole=(roleId:number)=>request.delete(API.REMOVEROLE_URL+roleId);