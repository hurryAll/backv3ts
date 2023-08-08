//书写品牌管理模块接口
import request from "@/utils/request";
import type { TradeMarkResponseData,TradeMark } from "./type";
//品牌管理模块接口地址
enum API{
    //获取品牌接口
    TRADEMARK_URL="/admin/product/baseTrademark/",
    //添加品牌接口
    ADDTRADEMARK_URL="/admin/product/baseTrademark/save",
    //修改已有品牌
    UPDATETRADEMARK_URL="/admin/product/baseTrademark/update",
    //删除
    DELETE_URL="/admin/product/baseTrademark/remove/"
}
//page获取第几页(默认第一页)  limit获取几个数据
export const reqHasTrademark=(page:number,limit:number)=>request.get<any,TradeMarkResponseData>(API.TRADEMARK_URL+`${page}/${limit}`)
//添加与修改已有品牌接口
export const reqAddOrUpdateTrademark=(data:TradeMark)=>{
    //有id传递说明是修改
    if(data.id){
        return request.put<any,any>(API.UPDATETRADEMARK_URL,data)
    }else{
        return request.post<any,any>(API.ADDTRADEMARK_URL,data)
    }
}
//删除已有品牌接口
export const reqDeleteTrademark=(id:number)=>request.delete<any,any>(API.DELETE_URL+id);