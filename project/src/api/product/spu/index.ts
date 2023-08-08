import request from "@/utils/request";
import type { HasSpuResponseData,AllTradeMark,SpuHasImg,SaleAttrResponseData,HasSaleAttrResponseData, SpuData, SkuData,SkuInfoData} from "./type";
enum API{
    //获取已有的SPU数据
    HASSPU_URL="/admin/product/",
    //获取全部品牌的数据
    ALLTRADEMARK_URL='/admin/product/baseTrademark/getTrademarkList',
    //获取某个SPU下全部的售卖商品的图片数据
    IMAGE_URL='/admin/product/spuImageList/',
    //获取某个SPU下全部的已有的销售属性接口地址
    SPUHASSALEATTR_URL='/admin/product/spuSaleAttrList/',
    //获取整个项目全部的销售属性[颜色,版本,尺度]
    ALLSALEATTR_URL='/admin/product/baseSaleAttrList',
    //新增一个新的spu
    ADDSPU_URL='/admin/product/saveSpuInfo',
    //更新已有SPU
    UPDATESPU_URL='/admin/product/saveSpuInfo',
    //追加一个新增的SKU地址
    ADDSKU_URL='/admin/product/saveSkuInfo',
    //查看某个已有得SPU下的全部售卖商品(即sku)
    SKUINFO_URL='/admin/product/findBySpuId/',
    //删除SPU
    REMOVESPU_URL='/admin/product/deleteSpu/'
}
//获取某个三级分类下已有的SPU数据
export const reqHasSpu=(page:number,limit:number,category3Id:number|string)=>request.get<any,HasSpuResponseData>(API.HASSPU_URL+`${page}/${limit}?category3Id=${category3Id}`)
//获取全部的SPU的品牌的数据
export const reqAllTradeMark=()=>request.get<any,AllTradeMark>(API.ALLTRADEMARK_URL);
export const reqSpuImageList=(spuId:number)=>request.get<any,SpuHasImg>(API.IMAGE_URL+spuId);
export const reqSpuHasSaleAttr=(spuId:number)=>request.get<any,SaleAttrResponseData>(API.SPUHASSALEATTR_URL+spuId);
//获取全部销售属性
export const reqAllSaleAttr=()=>request.get<any,HasSaleAttrResponseData>(API.ALLSALEATTR_URL);
//添加新SPU、更新SPU
export const reqAddOrUpdateSpu=(data:SpuData)=>{
    if(data.id){
        //就是修改
        return request.post(API.UPDATESPU_URL,data)
    }else{
        //新增
        return request.post(API.ADDSPU_URL,data);
    }
}
//添加sku
export const reqAddSku=(data:SkuData)=>request.post<any,any>(API.ADDSKU_URL,data);
//获取sku数据
export const reqSkuList=(spuId:number|string)=>request.get<any,SkuInfoData>(API.SKUINFO_URL+spuId);
//删除spu
export const reqRemoveSpu=(spuId:number|string)=>request.delete<any,any>(API.REMOVESPU_URL+spuId);