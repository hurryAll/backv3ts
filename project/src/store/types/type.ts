//定义小仓库state的数据类型
import { CategoryObj } from "@/api/product/attr/type";
import { RouteRecordRaw } from "vue-router";
export interface UserState{
    token:string|null,
    menuRouters:RouteRecordRaw[],
    username:string,
    avatar:string,
    buttons:string[]
}
//定义分类仓库state对象类型
export interface CategoryState{
    c1Id:string|number,
    c1Arr:CategoryObj[],
    c2Id:string|number,
    c2Arr:CategoryObj[],
    c3Id:string|number,
    c3Arr:CategoryObj[]
}
