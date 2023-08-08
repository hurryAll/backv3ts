import request from '@/utils/request.ts';
import { CategoryResponseData,AttrResponseData,Attr } from './type';
//属性管理
enum API{
    //获取1级分类接口地址
    C1_URL='/admin/product/getCategory1',
    C2_URL='/admin/product/getCategory2/',
    C3_URL='/admin/product/getCategory3/',
    ATTR_URL='/admin/product/attrInfoList/',
    ADDORUPDATEATTR_URL='/admin/product/saveAttrInfo',
    //删除已有属性接口
    DELETEATTR_URL='/admin/product/deleteAttr/'
}
//获取1级分类方法
export const reqC1=()=>request.get<any,CategoryResponseData>(API.C1_URL)
//2
export const reqC2=(category1Id:number|string)=>request.get<any,CategoryResponseData>(API.C2_URL+category1Id);
//3
export const reqC3=(category2Id:number|string)=>request.get<any,CategoryResponseData>(API.C3_URL+category2Id);
//获取对应id的商品属性
export const reqAttr=(category1Id:number|string,category2Id:number|string,category3Id:number|string)=>request.get<any,AttrResponseData>(API.ATTR_URL+`${category1Id}/${category2Id}/${category3Id}`)
//新增或修改已有的属性接口
export const reqAddorUpdateAttr=(data:Attr)=>request.post<any,any>(API.ADDORUPDATEATTR_URL,data);
//删除属性
export const reqRemoveAttr=(attrId:number)=>request.delete<any,any>(API.DELETEATTR_URL+attrId)